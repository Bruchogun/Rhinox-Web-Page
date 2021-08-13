import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import { getRate } from "../../functions";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { id_item, id_account, quantity, cost, currency_code } = req.body;
        const rate = await getRate("usd", currency_code)
        const {rows: result} = await sql`

                WITH _t as (
                    UPDATE items
                    SET quantity = quantity + ${quantity}
                    WHERE id_item = ${id_item}
    
                ), new_inv_income as(
                    INSERT INTO public.inv_incomes
                        ( id_item, id_account, quantity, amount, rate )
                        VALUES (${id_item}::integer, ${id_account}::integer, ${quantity}::numeric, ${cost}::numeric, ${rate}::numeric)
                        RETURNING id_inv_income
                )
    
                SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                    id_balance,
                    ${-Math.abs(cost)},
                    id_inv_income,
                    'inv_incomes'
                ) FROM balances, new_inv_income
                WHERE id_account = ${id_account};
            `;
    
        res.json({
            success:"Inventario repuesto exitosamente",
            result
        });
    }
)
