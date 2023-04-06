import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: client_addresses} = await sql`

            select * from client_addresses
                JOIN join_clients_client_addresses using(id_client_address);

            `;

        res.json({
            client_addresses
        });
    }
)