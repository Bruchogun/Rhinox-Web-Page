import { compose } from 'compose-middleware';
import { ROLES_CREATE } from '../../constants/PERMISSIONS';
import { sql } from '../../db';
import checkPermissionsMW from '../../middlewares/checkPermissionsMW';

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, items, id_measure, recipe_cost, recipe_price, time, description, manufacture, checked, min_stock, max_stock} = req.body;
        
        let items_fixed = items.map(x=>{
            return({
                id_item: x.item.id_item,
                quantity: x.quantity
            });
        })

        if (!name) return res.json({error: 'Ingrese un nombre'})
        if (!items_fixed) return res.json({error: 'Ingrese al menos un ingrediente'})
        if (Number(recipe_cost) < 0 || Number(recipe_cost) > Number(recipe_price)) return res.json({error: 'Ingrese un costo válido'})
        if (Number(recipe_price) < 0 || Number(recipe_cost) > Number(recipe_price)) return res.json({error: 'Ingrese un precio válido'})
        if (Number(time) < 0) return res.json({error: 'Ingrese un tiempo válido'})
        if (!description) return res.json({error: 'Ingrese una descripción'})
        if (!manufacture) return res.json({error: 'Ingrese las indicaciones de preparación'})
        
        if(checked){
            const {rows: recipe} = await sql`

                WITH new_recipe as (
                    INSERT INTO public.recipes
                        (name, description, manufacture, time, cost, price)
                        VALUES (
                            ${name}::character varying, 
                            ${description}::character varying, 
                            ${manufacture}::character varying, 
                            ${time}::numeric,
                            ${recipe_cost}::numeric,
                            ${recipe_price}::numeric)
                        RETURNING id_recipe
                )
                    INSERT INTO join_recipes_items  (id_recipe, id_item, quantity)
	                    SELECT new_recipe.id_recipe, x.id_item, x.quantity 
                            FROM 
                                json_to_recordset(${JSON.stringify(items_fixed)}::json::json) as x("id_item" int, "quantity" decimal(30,10)),
                                new_recipe;
                        
                `;
            res.json({
                success: 'Receta registrada exitosamente',
                recipe
            })
        }else{

            if (!id_measure) return res.json({error: 'Ingrese una unidad de medida'})
            if (Number(min_stock) < 0 && Number(max_stock) < Number(min_stock)) return res.json({error: 'Ingrese un stock mínimo válido'})
            if (Number(max_stock) < 0 && Number(max_stock) < Number(min_stock)) return res.json({error: 'Ingrese un stock máximo válido'})
    
            const {rows: recipe} = await sql`

                WITH new_product as (
                    INSERT INTO public.products
                        (id_measure, code, description, min_stock, max_stock)
                        VALUES (${id_measure}::integer, 
                                ${name}::character varying, 
                                ${description}::character varying, 
                                ${min_stock}::numeric, 
                                ${max_stock}::numeric
                                )
                        ON CONFLICT(code) DO NOTHING
                        RETURNING id_product
                ), new_brand as (
                    INSERT INTO public.brands
                        (name)
                        VALUES (${'Rhinox Pizza'}::character varying) --Default brand for Rhino'x Pizza
                        ON CONFLICT(name) DO NOTHING
                        RETURNING id_brand
                ), new_recipe as (
                    INSERT INTO public.recipes
                        (name, description, manufacture, time, cost, price, is_vendible)
                        VALUES (
                            ${name}::character varying, 
                            ${description}::character varying, 
                            ${manufacture}::character varying, 
                            ${time}::numeric,
                            ${recipe_cost}::numeric,
                            ${recipe_price}::numeric,
                            ${checked}::boolean)
                        RETURNING id_recipe
                ), new_join_recipes_items as (
                    INSERT INTO join_recipes_items  (id_recipe, id_item, quantity)
	                    SELECT new_recipe.id_recipe, x.id_item, x.quantity 
                            FROM 
                                json_to_recordset(${JSON.stringify(items_fixed)}::json::json) as x("id_item" int, "quantity" decimal(30,10)),
                                new_recipe
                )
                    INSERT INTO public.items
                        ( id_brand, id_product, cost, price, id_supplier, manufacture, is_vendible )
                        SELECT
                            brand.id_brand,
                            product.id_product,
                            ${recipe_cost}::numeric,
                            ${recipe_price}::numeric,
                            ${1}::integer, --Default supplier for Rhino'x Pizza
                            ${manufacture}::character varying,
                            ${checked}::boolean
                        FROM
                            (
                                SELECT COALESCE(
                                    (SELECT id_product FROM new_product),
                                    (SELECT id_product FROM products WHERE code = ${name})
                                ) AS id_product
                            ) AS product,
                            (
                                SELECT COALESCE(
                                    (SELECT id_brand FROM new_brand),
                                    (SELECT id_brand FROM brands WHERE name = ${'Rhinox Pizza'})
                                ) AS id_brand
                            ) AS brand
                        LIMIT 1
                        RETURNING id_item;
                        
                `;
            res.json({
                success: 'Receta registrada exitosamente',
                recipe
            })
        }
        

    }
)
