exports.up = pgm => pgm.sql(`INSERT INTO permissions (name) VALUES ('roles_create'),('roles_read'),('roles_update'),('roles_delete');`);
exports.down = pgm => pgm.sql`
    ALTER SEQUENCE permissions_permission_id_seq RESTART WITH 1;
    DELETE FROM permissions WHERE name IN ('roles_create','roles_read','roles_update','roles_delete')`;