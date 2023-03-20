import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { id_item, description, quantity } = req.body;
        const {rows: inv_expenses} = await sql`

            WITH new_inv_expense as (
                INSERT INTO public.inv_expenses
                    ( id_item, quantity )
                    VALUES ( ${id_item}::integer, ${quantity}::decimal )
                    RETURNING id_inv_expense
            )
                UPDATE items
                    SET quantity = quantity - ${quantity}
                    WHERE id_item = ${id_item}
        `;

        res.json({
            success: 'Gasto realizado',
            data: inv_expenses
        })
    }
)