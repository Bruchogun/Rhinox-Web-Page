exports.up = pgm => {
    pgm.createTable('users', {
        user_id: 'id',
        username: { type: 'varchar(30)', notNull: true, unique: true },
        password_hash: { type: 'varchar(200)', notNull: true },
        name: { type: 'varchar(100)', notNull: true },
        email: { type: 'varchar(100)', notNull: true, unique: true },
        lastname: { type: 'varchar(100)', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createIndex('users', 'username');
};
