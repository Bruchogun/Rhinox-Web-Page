exports.up = pgm => {
    pgm.createTable('join_users_roles', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        role_id: {
            type: 'integer',
            notNull: true,
            references: 'roles',
            onDelete: 'cascade',
        },
    });
    pgm.addConstraint( 'join_users_roles', 'join_users_roles_pk', { primaryKey: ['user_id', 'role_id']} )
}
