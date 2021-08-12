import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {description, amount, income, expense} = req.body;
        if(expense.id_account === income.id_account){
            return res.json({error: "Seleccione cuentas diferentes."}); 
        }else if (expense.id_currency !== income.id_currency){
            return res.json({error: "Seleccione cuentas con monedas iguales."}); 
        }else{
            const {rows: wire_transfers} = await sql`
    
                WITH new_wire_transfers as (
                    INSERT INTO wire_transfers
                        (description)
                        VALUES (${description}::character varying)
                        RETURNING id_wire_transfer
                )
                SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                    id_balance,
                    CASE WHEN id_account=${expense.id_account} THEN ${-(amount)}::numeric ELSE ${amount}::numeric END,
                    id_wire_transfer,
                    'wire_transfers' 
                ) FROM balances, new_wire_transfers
                    WHERE id_account = ${income.id_account}::integer OR id_account = ${expense.id_account}::integer
    
                ;
            `;
            res.json({
                success:"Transferencia realizada",
                wire_transfers
            });
        }
    }
)