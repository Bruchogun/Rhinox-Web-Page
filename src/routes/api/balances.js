import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";



export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: balances} = await sql`
            
            SELECT * FROM balances
            JOIN accounts USING(id_account)
            JOIN currencys USING(id_currency);
            
        `;

        res.json({
            balances
        });
    }
)