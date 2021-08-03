import { compose } from "compose-middleware";
import { ROLES_CREATE, ROLES_READ } from "../../constants/PERMISSIONS";
import { query } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

// Create role
export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, permissions} = req.body;
        if (!name) return res.json({error: "Debe enviar un nombre válido"})

        const {rows: [{role_id}]} = await query(
            `WITH inserted_roles AS (INSERT INTO roles (name) VALUES ($1) RETURNING role_id)
            INSERT INTO join_roles_permissions (role_id, permission_id)
            SELECT role_id, permission_id
            FROM inserted_roles
            CROSS JOIN unnest($2::int[]) permission_id
            RETURNING role_id;`,
            [name, permissions]
        );

        res.json({
            success: 'Rol creado exitosamente',
            data: {role_id}
        })
    }
)

// List roles
export const get = compose(
    checkPermissionsMW(ROLES_READ),
    async (req, res) => {

        const {rows: roles} = await query(
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
            GROUP BY role_id;`
        );

        res.json({
            data: {roles}
        });
    }
)
