import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";



export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: brands} = await sql`
            select * from brands;
            
        `;

        res.json({
            brands
        });
    }
)