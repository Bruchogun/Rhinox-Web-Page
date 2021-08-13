import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { code, brand, id_supplier, id_measure, cost, price, min_stock, mid_stock, max_stock, description, manufacture} = req.body;
        if(cost >= price) return res.json({error: "El costo debe ser menor que el precio de venta."})
        if(min_stock > max_stock || min_stock > mid_stock) return res.json({error: "La 'cantidad mínima de stock' debe ser la menor."})
        if(mid_stock > max_stock || mid_stock < min_stock) return res.json({error: "La 'cantidad media de stock' debe ser la intermedia."})
        if(max_stock < mid_stock || max_stock < min_stock) return res.json({error: "La 'cantidad máxima de stock' debe ser la mayor."})

        const {rows: items} = await sql`

            WITH new_product as (
                INSERT INTO public.products
                    (id_measure, code, description, manufacture)
                    VALUES (${id_measure}::integer, 
                            ${code}::character varying, 
                            ${description}::character varying, 
                            ${manufacture}::character varying)
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
                    ( id_brand, id_product, cost, price, min_stock, mid_stock, max_stock, id_supplier )
                    SELECT
                        brand.id_brand,
                        product.id_product,
                        ${cost}::numeric,
                        ${price}::numeric,
                        ${min_stock}::numeric, 
                        ${mid_stock}::numeric, 
                        ${max_stock}::numeric, 
                        ${id_supplier}::integer
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
