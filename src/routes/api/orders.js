import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const get = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {

        const {rows: orders} = await sql`

            WITH combos_fixed as (
                SELECT 
                    id_order,
                    array_agg(jsonb_build_object(
                        'name', combos.name,
                        'quantity', join_orders_combos.quantity)
                    ) as combos
                FROM orders
                    LEFT JOIN join_orders_combos USING(id_order)
                    LEFT JOIN combos USING(id_combo) 
                GROUP BY id_order
            ), recipes_fixed as (
                SELECT
                    combos_fixed.*,
                    array_agg(jsonb_build_object(
                    'name', recipes.name,
                    'quantity', join_orders_recipes.quantity)
                    ) as recipes
                FROM combos_fixed
                    LEFT JOIN join_orders_recipes USING(id_order)
                    LEFT JOIN recipes USING(id_recipe)
                GROUP BY id_order, combos
            ), items_fixed as (
                SELECT 
                    recipes_fixed.*,
                    array_agg(jsonb_build_object(
                        'name', products.code,
                        'quantity', join_orders_items.quantity)
                    ) as items
                FROM recipes_fixed
                    LEFT JOIN join_orders_items USING (id_order)
                    LEFT JOIN items USING(id_item)
                    LEFT JOIN products USING(id_product) 
                GROUP BY id_order, combos, recipes
            )
                SELECT 
                    orders.id_order,
                    orders.id_join_clients_client_address,
                    orders.price,
                    orders.description as order_description,
                    orders.is_active,
                    orders.is_paid,
                    orders.is_in_process,
                    orders.is_done,
                    clients.name,
                    clients.last_name,
                    clients.phone_code1,
                    clients.phone_number1,
                    clients.phone_code2,
                    clients.phone_number2,
                    clients.description as client_description,
                    client_addresses.address,
                    client_addresses.description as address_description,
                    items_fixed.*
                FROM items_fixed
                    JOIN orders USING (id_order)
                    JOIN join_clients_client_addresses USING(id_join_clients_client_address)
                    JOIN clients USING(id_client)
                    JOIN client_addresses USING(id_client_address)
            ;
            

            
            `;

        res.json({
            orders
        });
    }
)


{
    orders: [
        {
            id_order: 2,
            combos_fixed: [
                {
                name: "Combo vacio",
                quantity: 1
                },
                {
                name: "Combo de fescos",
                quantity: 2
                }
            ],
            items_fixed: [
                {
                name: "Cocacola",
                quantity: 3
                },
                {
                name: "Frescolita",
                quantity: 4
                }
            ],
            recipes_fixed: [
                {
                name: "Pizza",
                quantity: 5
                },
                {
                name: "Pizza de nada",
                quantity: 6
                }
            ],
            
        },
        {
            id_order: 1,
            items_fixed: [
            {
            name: "Cocacola",
            quantity: 1
            },
            {
            name: "Frescolita",
            quantity: 2
            }
        ]
        }
    ]
}