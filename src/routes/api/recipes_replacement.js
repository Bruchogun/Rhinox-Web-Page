import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { recipe, quantity } = req.body;
        const {rows: result} = await sql`

                WITH _t AS (
                    UPDATE items
                    SET quantity = quantity - (subquery.recipe_quantity * ${quantity})
                    FROM (
                        SELECT 
                            id_recipe,
                            id_item,
                            join_recipes_items.quantity AS recipe_quantity,
                            items.quantity AS item_quantity,
                            recipes.name
                            
                            FROM join_recipes_items
                            JOIN recipes USING(id_recipe)
                            JOIN items USING(id_item)
                            WHERE id_recipe = ${recipe.id_recipe}
                    ) AS subquery
                    WHERE items.id_item = subquery.id_item
                ), __t AS (
                    UPDATE items
                    SET quantity = quantity + ${quantity}
                    FROM (
                        SELECT 
                            id_item,
                            id_product,
                            code

                            FROM items
                            JOIN products USING(id_product)
                            WHERE code = ${recipe.name}
                    ) AS subquery
                    WHERE items.id_item = subquery.id_item
                ), ___t AS (
                    INSERT INTO public.inv_incomes
                        ( id_item, quantity, amount )
                        SELECT 
                            id_item,
                            ${quantity},
                            0

                            FROM items
                            JOIN products USING(id_product)
                            WHERE code = ${recipe.name}
                        RETURNING id_inv_income
                )
                    INSERT INTO public.inv_expenses
                        ( id_item, quantity )
                        SELECT 
                            id_item,
                            (join_recipes_items.quantity * ${quantity}) AS quantity
                            
                            FROM join_recipes_items
                            JOIN recipes USING(id_recipe)
                            JOIN items USING(id_item)
                            WHERE id_recipe = ${recipe.id_recipe}
                        RETURNING id_inv_expense

            `;
    
        res.json({
            success:"Receta repuesta exitosamente",
            result
        });
    }
)