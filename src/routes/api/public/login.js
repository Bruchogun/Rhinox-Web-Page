import argon2 from "argon2";
import { query } from "../../../db";

export async function post(req, res){
    const {username, password} = req.body;

    let user;
    {
        const result = await query(
            `SELECT
                    user_id,
                    users.name,
                    password_hash,
                    ARRAY_REMOVE(ARRAY_AGG(role_id), NULL) roles,
                    array_merge_agg(permissions) permissions
                FROM users
                LEFT JOIN join_users_roles USING (user_id)
                LEFT JOIN (
                    SELECT
                        role_id,
                        roles.name,
                        ARRAY_AGG(permission_id) permissions
                    FROM roles
                    JOIN join_roles_permissions USING (role_id)
                    JOIN permissions USING (permission_id)
                    GROUP BY role_id
                ) roles USING (role_id)
                WHERE username=$1
                GROUP BY "user_id"`,
            [username]
        )
        user = result.rows[0];
    }
    if (!user) return res.json({error: `Usuario "${username}" no existe`})

    {
        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) return res.json({error: "Contraseña incorrecta"})
    }

    { // Save user in session, and a cookie will be set in the client
        delete user.password_hash; // Do not include *password_hash* in the session
        req.session.user = user;
    }

    res.json({
        success: "Inicio de sesión exitoso",
        session: req.session.user,
        redirect: "/"
    });
}
