import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: supplier_addresses} = await sql`

            select * from supplier_addresses
            join suppliers using(id_supplier);

            `;

        res.json({
            supplier_addresses
        });
    }
)