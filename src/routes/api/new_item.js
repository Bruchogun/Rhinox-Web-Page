import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { code, brand, id_supplier, id_measure, cost, price, min_stock, max_stock, description, manufacture, is_vendible} = req.body;
        if(Number(cost) >= Number(price)) return res.json({error: "El costo debe ser menor que el precio de venta."})

        const {rows: items} = await sql`

            WITH new_product as (
                INSERT INTO public.products
                    (id_measure, code, description, min_stock, max_stock)
                    VALUES (${id_measure}::integer, 
                            ${code}::character varying, 
                            ${description}::character varying, 
                            ${min_stock}::numeric, 
                            ${max_stock}::numeric
                            )
                    ON CONFLICT(code) DO NOTHING
                    RETURNING id_product
            ), new_brand as (
                INSERT INTO public.brands
                    (name)
                    VALUES (${brand}::character varying)
                    ON CONFLICT(name) DO NOTHING
                    RETURNING id_brand
            )
                INSERT INTO public.items
                    ( id_brand, id_product, cost, price, id_supplier, manufacture, is_vendible )
                    SELECT
                        brand.id_brand,
                        product.id_product,
                        ${cost}::numeric,
                        ${price}::numeric,
                        ${id_supplier}::integer,
                        ${manufacture}::character varying,
                        ${is_vendible}::boolean
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
                    RETURNING id_item;

            `; 
        res.json({
            success:"Artículo ingresado al inventario",
            items
        });
    }
)
