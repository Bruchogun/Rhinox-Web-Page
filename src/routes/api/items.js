import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: items} = await sql`

            select

            id_item,
            quantity,
            products.code as product_code,
            measures.unit,
            products.description,
            products.manufacture,
            items.cost,
            items.price,
            min_stock,
            mid_stock,
            max_stock,
            suppliers.name as supplier,
            brands.name as brand_name

            from items
            join brands using(id_brand)
            join products using(id_product)
            join measures using(id_measure)
            join suppliers using(id_supplier);

            `;

        res.json({
            items
        });
    }
)