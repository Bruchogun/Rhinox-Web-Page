import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, recipe_price, description, manufacture, items_recipe, prepare_time} = req.body;
        if (!name) return res.json({error: "Ingrese al menos un nombre válido"})

        const {rows: recipe} = await sql`

            WITH new_recipe as (
                INSERT INTO recipes
                (price, name, description, manufacture, prepare_time)
                VALUES (${recipe_price}::numeric, ${name}::character varying, ${description}::character varying, ${manufacture}::character varying, ${prepare_time}::numeric)
                RETURNING id_recipe
            )
                INSERT INTO join_recipes_items
                (id_recipe, id_item, quantity)
                SELECT 
                    new_recipe.id_recipe,
                    x.id_item,
                    x.quantity
                FROM new_recipe, json_to_recordset(${JSON.stringify(items_recipe)}) as x("id_item" int, "quantity" decimal(30,10));
                    
            `;

        res.json({
            success: 'Proveedor registrado exitosamente',
            recipe
        })
    }
)
