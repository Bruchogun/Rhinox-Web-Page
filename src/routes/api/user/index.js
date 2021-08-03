import argon2 from "argon2";
import { argon as config } from "../../../config";
import { query, sql } from "../../../db";

// Get profile
export async function get (req, res) {
    const {user_id} = req.session.user;
    const {rows: [session]} = await sql`
        SELECT
            user_id,
            users.name,
            users.created_at,
            array_agg(jsonb_build_object(
                'role_id', role_id,
                'name', roles.name)
            ) roles,
            ARRAY_AGG(permission_id) permissions
        FROM users
        JOIN join_users_roles USING (user_id)
        JOIN roles USING (role_id)
        JOIN join_roles_permissions USING (role_id)
        JOIN permissions USING (permission_id)
        WHERE user_id = ${user_id}
        GROUP BY user_id;
    `;

    res.json({
        session
    });
}

// Update user's password
export async function patch (req, res) {
    const {user_id} = req.session.user;
    const {old_password, new_password} = req.body;

    const {rows: [user]} = await query(
        `SELECT
            users.name,
            password_hash
        FROM users
        WHERE user_id = $1;`,
        [user_id]
    );
    if (!new_password) return res.json({error: "Nueva contraseña no puede estar vacía"})

    const isPasswordValid = await argon2.verify(user.password_hash, old_password);
    if (!isPasswordValid) return res.json({error: "Contraseña incorrecta"})

    const hash = await argon2.hash(new_password, config);

    await query(
        `UPDATE users SET password_hash = $2 WHERE user_id = $1;`,
        [user_id, hash]
    );

    res.json({
        success: 'Contraseña actualizada exitosamente',
    })
}

// Log out
export async function del (req, res) {
    req.session.destroy();
    res.json({success: 'Cerrada sesión exitosamente'});
}
