import { compose } from "compose-middleware";
import { USERS_READ, USERS_UPDATE } from "../../../constants/PERMISSIONS";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";
import { query } from "../../../db";

// Get user
export const get = compose(
    checkPermissionsMW(USERS_READ),
    async (req, res) => {
        const {user_id} = req.params;
        const {rows: [user]} = await query(
            `SELECT
                user_id,
                users.name,
                users.created_at,
                CASE WHEN count(role_id) = 0
                    THEN '{}'
                    ELSE array_agg(jsonb_build_object(
                        'role_id', role_id,
                        'name', roles.name)
                    )
                END roles
            FROM users
            LEFT JOIN (
                join_users_roles
                JOIN roles USING (role_id)
            ) USING (user_id)
            WHERE user_id = $1
            GROUP BY user_id;`,
            [user_id]
        );
        if (!user) return res.json({error: `Usuario con id "${user_id}" no existe`})

        res.json({
            data: {user}
        });
    }
)

// Update user's roles
export const patch = compose(
    checkPermissionsMW(USERS_UPDATE),
    async (req, res) => {
        const {user_id} = req.params;
        const {add, remove} = req.body;
        if (!user_id) return res.json({error: "No se recibió el id del usuario que se desea actualizar"})

        const promises = [];
        if (add) {
            promises.push(query(
                `INSERT INTO join_users_roles (user_id, role_id) VALUES ($1, unnest($2::int[]));`,
                [user_id, add]
            ))
        }
        if (remove) {
            promises.push(query(
                `DELETE FROM join_users_roles WHERE user_id = $1 and role_id = ANY($2);`,
                [user_id, remove]
            ))
        }

        await Promise.all(promises);

        res.json({
            success: 'Usuario actualizado exitosamente',
        })
    }
)

