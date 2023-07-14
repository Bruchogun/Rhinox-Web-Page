import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { id_item, id_account, quantity, cost } = req.body;
        const {rows: result} = await sql`

                WITH _t as (
                    UPDATE items
                    SET quantity = quantity + ${quantity}
                    WHERE id_item = ${id_item}
                ), new_inv_income as (
                    INSERT INTO public.inv_incomes
                        ( id_item, id_account, quantity, amount )
                        VALUES (${id_item}::integer, ${id_account}::integer, ${quantity}::numeric, ${cost}::numeric)
                        RETURNING id_inv_income
                )
                SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                    ${id_account}::integer,
                    ${-Math.abs(cost)}::numeric,
                    id_inv_income,
                    'inv_incomes'
                ) FROM new_inv_income;
            `;
    
        res.json({
            success:"Inventario repuesto exitosamente",
            result
        });
    }
)
