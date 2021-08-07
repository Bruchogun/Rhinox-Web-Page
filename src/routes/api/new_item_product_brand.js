import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { code, description, brand , cost, price, storage, measure, min_stock, mid_stock, max_stock, supplier, manufacture} = req.body;
        const {rows: items} = await sql`

            WITH new_product as (
                INSERT INTO public.products
                    (code, description, id_measure, min_stock, mid_stock, max_stock, manufacture)
                    VALUES (${code}::character varying, ${description}::character varying, ${measure}::integer, ${min_stock}::numeric, ${mid_stock}::numeric, ${max_stock}::numeric, ${manufacture}::character varying)
                    ON CONFLICT(code) DO NOTHING
                    RETURNING id_product
            ), new_brand as (
                INSERT INTO public.brands
                    (name)
                    VALUES (${brand}::character varying)
                    ON CONFLICT(name) DO NOTHING
                    RETURNING id_brand
            ), new_item as (
                INSERT INTO public.items
                    ( id_brand, id_product, cost, price, id_supplier )
                    SELECT
                        brand.id_brand,
                        product.id_product,
                        ${cost}::numeric,
                        ${price}::numeric,
                        ${supplier}::integer
                    FROM
                        (
                            SELECT COALESCE(
                                (SELECT id_product FROM new_product),
                                (SELECT id_product FROM products WHERE code = ${code})
                            ) AS id_product
                        ) AS product,
                        (
                            SELECT COALESCE(
                                (SELECT id_brand FROM new_brand),
                                (SELECT id_brand FROM brands WHERE name = ${brand})
                            ) AS id_brand
                        ) AS brand
                    LIMIT 1
                    RETURNING id_item
            )
            INSERT INTO public.stocks
                ( id_item, id_storage )
                SELECT id_item, ${storage}
                FROM new_item
                RETURNING id_stock;

            `; 
            //[ code, description, brand , cost, price, storage, measure, min_stock, mid_stock, max_stock, supplier]
        let data = items[0]
        res.json({
            success:"Artículo ingresado al inventario",
            data
        });
    }
)
