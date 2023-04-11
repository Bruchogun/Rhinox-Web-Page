import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const { order, is_canceled, account } = req.body;
        if(is_canceled){ //Order is canceled
            order.is_active = false
            order.is_paid = false
            order.is_in_process = false
            //order.is_done determinates if the stock was spent

            if(order.is_done){
                const {rows: update_order_status} = await sql`
                    UPDATE orders
                        SET is_active = ${order.is_active},
                            is_paid = ${order.is_paid},
                            is_in_process = ${order.is_in_process},
                            is_done = ${order.is_done}
                        WHERE id_order = ${order.id_order};
        
                `;
    
                res.json({
                    success: 'Orden cancelada',
                    data: update_order_status
            })

            }else{
                const {rows: update_order_status} = await sql`

                WITH _t as(
                    UPDATE orders
                        SET is_active = ${order.is_active},
                            is_paid = ${order.is_paid},
                            is_in_process = ${order.is_in_process},
                            is_done = ${order.is_done}
                        WHERE id_order = ${order.id_order}
                ), __t as (
                    UPDATE items
                    SET quantity = items.quantity + subquery.quantity
                    FROM
                    (
                        SELECT
                            id_item,
                            sum(sub_subquery.quantity_combos) as quantity
                            
                        FROM (
                            SELECT
                                id_item,
                                sum(join_orders_combos.quantity * join_combos_items.quantity) as quantity_combos

                                FROM join_orders_combos
                                JOIN join_combos_items USING(id_combo)
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(join_orders_recipes.quantity * join_recipes_items.quantity) as quantity_recipes
                            
                                FROM join_orders_recipes
                                JOIN join_recipes_items USING(id_recipe)
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(join_orders_items.quantity) as quantity_items
                            
                                FROM join_orders_items
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                        ) as sub_subquery
                        group by (id_item)
                    ) as subquery
                    WHERE items.id_item = subquery.id_item
            )
                INSERT INTO inv_incomes
                    (id_item, quantity, amount)
                    SELECT
                            id_item,
                            sum(quantity_combos) as quantity,
                            0
                        FROM (
                            SELECT
                                id_item,
                                sum(join_orders_combos.quantity * join_combos_items.quantity) as quantity_combos
                            
                                FROM join_orders_combos
                                JOIN join_combos_items USING(id_combo)
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(join_orders_recipes.quantity * join_recipes_items.quantity) as quantity_recipes
                            
                                FROM join_orders_recipes
                                JOIN join_recipes_items USING(id_recipe)
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                            
                        UNION ALL
                        
                            SELECT
                                id_item,
                                sum(join_orders_items.quantity) as quantity_items
                            
                                FROM join_orders_items
                                WHERE id_order = ${order.id_order}
                                group by (id_item)
                        ) as sub_subquery
                        group by (id_item);
        
                `;

                res.json({
                    success: 'Orden cancelada y stock repuesto',
                    data: update_order_status
                })
            }
            
        }else if(!order.is_in_process && !order.is_paid && order.is_active && !order.is_done){ //Order is in 'Nuevas'
            order.is_active = true
            order.is_paid = false
            order.is_in_process = true
            order.is_done = false
            const {rows: update_order_status} = await sql`
    
            UPDATE orders
                SET is_active = ${order.is_active},
                    is_paid = ${order.is_paid},
                    is_in_process = ${order.is_in_process},
                    is_done = ${order.is_done}
                WHERE id_order = ${order.id_order};
                `;

            res.json({
                success: 'Orden comenzada',
                data: update_order_status
            })
        }else if(order.is_in_process && !order.is_paid && order.is_active && !order.is_done){ // Order is 'En preparacion'
            order.is_active = true
            order.is_paid = false
            order.is_in_process = false
            order.is_done = true
            const {rows: update_order_status} = await sql`
    
            UPDATE orders
                SET is_active = ${order.is_active},
                    is_paid = ${order.is_paid},
                    is_in_process = ${order.is_in_process},
                    is_done = ${order.is_done}
                WHERE id_order = ${order.id_order};
            `;

            res.json({
                success: 'Orden preparada',
                data: update_order_status
            })
        }else if(!order.is_in_process && !order.is_paid && order.is_active && order.is_done){ // Order is in 'Listo'
            order.is_active = false
            order.is_paid = true
            order.is_in_process = false
            order.is_done = true

            const {rows: update_order_status} = await sql`

            WITH _t as(
                UPDATE orders
                    SET is_active = ${order.is_active},
                        is_paid = ${order.is_paid},
                        is_in_process = ${order.is_in_process},
                        is_done = ${order.is_done}
                    WHERE id_order = ${order.id_order}
            )
                SELECT alter_balance(id_balance, ${Math.abs(order.price)}, ${order.id_order}, 'orders')
                FROM accounts
                JOIN balances USING(id_account)
                WHERE id_account = ${account.id_account}
                ;
    
            `;

            res.json({
                success: 'Orden entregada',
                data: update_order_status
        })
        }

    }
)