import { compose } from "compose-middleware";
import { ROLES_DELETE, ROLES_READ, ROLES_UPDATE } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// Get role
export const get = compose(
    checkPermissionsMW(ROLES_READ),
    async (req, res) => {
        const {role_id} = req.params;

        const {rows: [role]} = await query(
            `SELECT
                role_id,
                roles.name,
                roles.created_at,
                array_agg(jsonb_build_object(
                    'permission_id', permission_id,
                    'name', permissions.name)
                ) permissions
            FROM roles
            JOIN join_roles_permissions USING (role_id)
            JOIN permissions USING (permission_id)
            WHERE role_id = $1
            GROUP BY role_id
            LIMIT 1;`,
            [role_id]
        );

        res.json({
            data: {role}
        });
    }
)

// Update role
export const patch = compose(
    checkPermissionsMW(ROLES_UPDATE),
    async (req, res) => {
        const {role_id} = req.params;
        if (!role_id) return res.json({error: "No se recibió el id del rol a actualizar"})

        const {name, permissions: {add, remove}} = req.body;

        const promises = [];
        if (name) {
            promises.push(query(
                `UPDATE roles SET name = $2 WHERE role_id = $1;`,
                [role_id, name]
            ))
        }
        if (add) {
            promises.push(query(
                `INSERT INTO join_roles_permissions (role_id, permission_id) VALUES ($1, unnest($2::int[]));`,
                [role_id, add]
            ))
        }
        if (remove) {
            promises.push(query(
                `DELETE FROM join_roles_permissions WHERE role_id = $1 and permission_id = ANY($2);`,
                [role_id, remove]
            ))
        }

        await Promise.all(promises);

        res.json({
            success: 'Rol actualizado exitosamente',
        })
    }
)

// Delete role
export const del = compose(
    checkPermissionsMW(ROLES_DELETE),
    async (req, res) => {
        const {role_id} = req.params;

        await query(
            `DELETE FROM roles WHERE role_id = $1;`,
            [role_id]
        );

        res.json({
            success: 'Rol eliminado exitosamente',
        });
    }
)
