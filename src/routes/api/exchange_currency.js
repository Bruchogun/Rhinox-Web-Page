import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {description, income, expense} = req.body;
        if(expense.id_account === income.id_account){
            return res.json({error: "Seleccione cuentas diferentes."});
        }else if (expense.id_currency === income.id_currency){
            return res.json({error: "Seleccione cuentas con monedas diferentes."});
        }
        const {rows: exchange_currency} = await sql`

                WITH new_exchange_currencys as (
                    INSERT INTO exchange_currencys
                        (description)
                        VALUES (${description}::character varying)
                        RETURNING id_exchange_currency
                )
                SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                    id_balance,
                    CASE WHEN id_account=${expense.id_account} THEN ${-Math.abs(expense.amount)}::numeric ELSE ${income.amount}::numeric END,
                    id_exchange_currency,
                    'exchange_currencys' 
                ) FROM balances, new_exchange_currencys
                WHERE id_account IN (${expense.id_account}::integer, ${income.id_account}::integer)
                ;
            `
        ;
        res.json({
            success:"Cambio de moneda realizado",
            exchange_currency
        });
    }
)