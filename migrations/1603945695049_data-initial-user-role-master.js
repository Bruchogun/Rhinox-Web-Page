exports.up = pgm => {
    pgm.sql`
        WITH inserted_user as (
            INSERT INTO users (username, name, password_hash, email, lastname) VALUES ('master', 'master', '$argon2i$v=19$m=4096,t=10,p=1$LU4KP3vETVtzvV2Mkrvd+A$9dcyOO3f2ehegvj9gwLYsVKuBsIx5Nu/3YBD4nodDhk','mauroalejandro20@gmail.com', 'master') RETURNING user_id
        ), inserted_role as (
            INSERT INTO roles (name) VALUES ('master') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM inserted_user, inserted_role
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM inserted_role, permissions;`
    
};

exports.down = pgm => {
    pgm.sql(
        `DELETE FROM users WHERE username = 'master';
        DELETE FROM roles WHERE name = 'master';`
    )
};
