import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { client, items, description, address, price } = req.body;

        if(price < 0) return res.json({error: 'El precio es inválido.'})
        if(!client) return res.json({error: 'Ingrese un cliente.'})
        if(!address) return res.json({error: 'Ingrese una dirección.'})
        for (let index = 0; index < items.length; index++) {
            if(!items[index].item) return res.json({error: `Revise el artículo ${index+1}.`})
            if(!items[index].quantity || items[index].quantity < 0  || !Number.isInteger(items[index].quantity) ) return res.json({error: `Revise la cantidad del artículo ${index+1}.`})
        }

        let combos_fixed = items.filter(item => item.item.id_combo);
        let recipes_fixed = items.filter(item => item.item.id_recipe);
        let items_fixed = items.filter(item => item.item.id_item);

        items_fixed = items_fixed.map(x=>{
            return({
                id_item: x.item.id_item,
                quantity: x.quantity
            });
        })

        combos_fixed = combos_fixed.map(x=>{
            return({
                id_combo: x.item.id_combo,
                quantity: x.quantity
            });
        })

        recipes_fixed = recipes_fixed.map(x=>{
            return({
                id_recipe: x.item.id_recipe,
                quantity: x.quantity
            });
        })

        const {rows: orders} = await sql`

            WITH new_order as (
                INSERT INTO public.orders
                    ( id_join_clients_client_address, price, description, is_active, is_paid )
                        SELECT
                            id_join_clients_client_address,
                            ${price}::decimal,
                            ${description}::character varying,
                            TRUE,
                            FALSE
                        FROM join_clients_client_addresses
                        WHERE id_client = ${client.id_client} AND id_client_address = ${address.id_client_address}
                    RETURNING id_order
            ), new_join_orders_items as(
                INSERT INTO join_orders_items 
                    (id_order, id_item, quantity)
                    SELECT 
                        new_order.id_order,
                        x.id_item,
                        x.quantity
                    FROM json_to_recordset(${JSON.stringify(items_fixed)}::json) as x("id_item" int, "quantity" decimal(30,10)),
                        new_order
            ), new_join_orders_recipes as(
                INSERT INTO join_orders_recipes 
                    (id_order, id_recipe, quantity)
                    SELECT 
                        new_order.id_order,
                        x.id_recipe,
                        x.quantity
                    FROM json_to_recordset(${JSON.stringify(recipes_fixed)}::json) as x("id_recipe" int, "quantity" decimal(30,10)),
                        new_order
            ), new_join_orders_combos as(
                INSERT INTO join_orders_combos 
                    (id_order, id_combo, quantity)
                    SELECT 
                        new_order.id_order,
                        x.id_combo,
                        x.quantity
                    FROM json_to_recordset(${JSON.stringify(combos_fixed)}::json) as x("id_combo" int, "quantity" decimal(30,10)),
                        new_order
            ), new_update as(
                UPDATE items
                    SET quantity = items.quantity - subquery.quantity
                    FROM
                    (
                        SELECT
                            id_item,
                            sum(quantity_combos) as quantity
                            
                        FROM (
                            SELECT
                                id_item,
                                sum(x.quantity * join_combos_items.quantity) as quantity_combos
                            
                                FROM json_to_recordset(${JSON.stringify(combos_fixed)}::json) as x("id_combo" int, "quantity" decimal(30,10))
                                JOIN join_combos_items USING(id_combo)
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(x.quantity * join_recipes_items.quantity) as quantity_recipes
                            
                                FROM json_to_recordset(${JSON.stringify(recipes_fixed)}::json) as x("id_recipe" int, "quantity" decimal(30,10))
                                JOIN join_recipes_items USING(id_recipe)
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(x.quantity) as quantity_items
                            
                                FROM json_to_recordset(${JSON.stringify(items_fixed)}::json) as x("id_item" int, "quantity" decimal(30,10))
                                group by (id_item)
                        ) as sub_subquery
                        group by (id_item)
                    ) as subquery
                    WHERE items.id_item = subquery.id_item
            )
                INSERT INTO inv_expenses
                    (id_item, quantity)
                    SELECT
                            id_item,
                            sum(quantity_combos) as quantity
                            
                        FROM (
                            SELECT
                                id_item,
                                sum(x.quantity * join_combos_items.quantity) as quantity_combos
                            
                                FROM json_to_recordset(${JSON.stringify(combos_fixed)}::json) as x("id_combo" int, "quantity" decimal(30,10))
                                JOIN join_combos_items USING(id_combo)
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(x.quantity * join_recipes_items.quantity) as quantity_recipes
                            
                                FROM json_to_recordset(${JSON.stringify(recipes_fixed)}::json) as x("id_recipe" int, "quantity" decimal(30,10))
                                JOIN join_recipes_items USING(id_recipe)
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(x.quantity) as quantity_items
                            
                                FROM json_to_recordset(${JSON.stringify(items_fixed)}::json) as x("id_item" int, "quantity" decimal(30,10))
                                group by (id_item)
                        ) as sub_subquery
                        group by (id_item);
            `
        ;

        res.json( {
            data: orders,
            success:`Orden creada exitosamente.` 
        });
    }
)