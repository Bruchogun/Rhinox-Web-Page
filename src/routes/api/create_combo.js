import { compose } from 'compose-middleware';
import { ROLES_CREATE } from '../../constants/PERMISSIONS';
import { sql } from '../../db';
import checkPermissionsMW from '../../middlewares/checkPermissionsMW';

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, price, items_quantity, recipes_quantity, description} = req.body;
        
        if (!name) return res.json({error: 'Ingrese un nombre'})
        if (price < 1) return res.json({error: 'Ingrese un precio válido'})
        if (!description) return res.json({error: 'Ingrese una descripción'})
    
        let items_fixed = items_quantity.map(x=>{
            return({
                id_item: x.item.id_item,
                quantity: x.quantity
            });
        })

        let recipes_fixed = recipes_quantity.map(x=>{
            return({
                id_recipe: x.recipe.id_recipe,
                quantity: x.quantity
            });
        })

        
        const {rows: combo} = await sql`

            WITH new_combo as (
                INSERT INTO public.combos
                    (name, price, description)
                    VALUES (
                        ${name}::character varying, 
                        ${price}::numeric,
                        ${description}::character varying)
                    RETURNING id_combo
            )
                INSERT INTO join_combos_items  (id_combo, id_item, quantity)
                    SELECT new_combo.id_combo, x.id_item, x.quantity 
                        FROM
                            json_to_recordset(${JSON.stringify(items_fixed)}::json) as x("id_item" int, "quantity" decimal(30,10)),
                            new_combo
                    UNION
                        
                        SELECT new_combo.id_combo, join_recipes_items.id_item, (x.quantity * join_recipes_items.quantity) AS quantity
                        FROM 
                            json_to_recordset(${JSON.stringify(recipes_fixed)}::json) as x("id_recipe" int, "quantity" decimal(30,10))
                        JOIN join_recipes_items USING(id_recipe)
                        CROSS JOIN new_combo
                        ;
                `;
            res.json({
                success: 'Combo registrado exitosamente',
                combo
            })
    }
)
