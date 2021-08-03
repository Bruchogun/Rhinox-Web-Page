import argon2 from "argon2";
import { argon as config } from "../../config";
import { compose } from "compose-middleware";
import { USERS_READ } from "../../constants/PERMISSIONS";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";
import { query } from "../../db";

// List users
export const get = compose(
    checkPermissionsMW(USERS_READ),
    async (req, res) => {

        const {rows: users} = await res.sql`
            SELECT
                user_id,
                users.name,
                users.created_at,
                CASE WHEN COUNT(role_id) > 0
                    THEN
                        array_agg(jsonb_build_object(
                            'role_id', role_id,
                            'name', roles.name)
                        )
                    ELSE 
                        '{}'
                END AS roles
            FROM users
            LEFT JOIN join_users_roles USING (user_id)
            LEFT JOIN roles USING (role_id)
            WHERE special_user = FALSE
            GROUP BY user_id;
        `;

        res.json({
            users,
        });
    }
)

// Signup
export async function post(req, res){
    const {username, password, name, email, lastname} = req.body;

    if (!username) return res.json({error: "Usuario no puede estar vacío"});
    if (!password) return res.json({error: "Contraseña no puede estar vacía"});
    if (!name)     return res.json({error: "Nombre no puede estar vacío"});
    if (!email)    return res.json({error: "Correo no puede estar vacío"});
    if (!lastname) return res.json({error: "Apellido no puede estar vacío"});

    const hash = await argon2.hash(password, config);

    await query(
        `
        WITH new_entity AS (
            INSERT INTO public.entitys (name)
                VALUES ($1::character varying)
                RETURNING id_entity
        ), t_ as(
            INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, new_entity
        )
        INSERT INTO users (username, password_hash, name, email, lastname, id_entity)
            SELECT $1,$2,$3,$4,$5,id_entity
            FROM new_entity
        ;
            `,
        [username, hash, name, email, lastname]
    );
    res.json({success: 'Usuario creado exitosamente'});
}