import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { id_account, amount, description, id_measure, quantity } = req.body;
        const {rows: general_expenses} = await sql`

            WITH new_general_expense as (
                INSERT INTO public.general_expenses
                    ( id_account, amount, description, id_measure, quantity )
                    VALUES ( ${id_account}::integer, ${amount}::decimal, ${description}::character varying, ${id_measure}::integer, ${quantity}::decimal)
                    RETURNING id_general_expense
            )
            SELECT alter_balance(id_balance, ${-Math.abs(amount)}, id_general_expense, 'general_expenses')
            FROM new_general_expense, balances
            WHERE id_account = ${id_account};

            `;

        res.json({
            success: 'Gasto realizado',
            data: general_expenses
        })
    }
)