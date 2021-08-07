import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: stocks} = await sql`

            select

            id_stock,
            stocks.quantity as stocks_quantity,
            id_storage,
            storages.name as storages_name,
            products.code as products_code,
            measures.unit,
            products.description,
            products.manufacture,
            items.cost,
            items.price,
            min_stock,
            mid_stock,
            max_stock,
            suppliers.name as supplier,
            id_item

            from items
            join brands using(id_brand)
            join products using(id_product)
            join stocks using(id_item)
            join storages using(id_storage)
            join measures using(id_measure)
            join suppliers using(id_supplier);

            `;

        res.json({
            stocks
        });
    }
)