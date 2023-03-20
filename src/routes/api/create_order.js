import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { name, id_currency } = req.body;
        const {rows: accounts} = await sql`

            WITH new_account_ as (
                INSERT INTO public.accounts
                    ( name, id_currency )
                    VALUES (${name}::character varying, ${id_currency}::integer)
                    RETURNING id_account
            )
                INSERT INTO balances (id_account)
                    SELECT id_account FROM new_account_;

            `
        ;

        let data = accounts[0]
        res.json( {
            data,
            success:"Cuenta registrada" 
        });
    }
)