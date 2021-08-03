exports.up = pgm => {
    pgm.createTable('roles', {
        role_id: 'id',
        name: { type: 'varchar(100)', notNull: true, unique: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
}
