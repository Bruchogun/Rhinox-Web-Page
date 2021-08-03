exports.up = pgm => {
    pgm.createTable('join_roles_permissions', {
        role_id: {
            type: 'integer',
            notNull: true,
            references: 'roles',
            onDelete: 'cascade',
        },
        permission_id: {
            type: 'integer',
            notNull: true,
            references: 'permissions',
            onDelete: 'cascade',
        },
    });
    pgm.addConstraint( 'join_roles_permissions', 'join_roles_permissions_pk', { primaryKey: ['role_id', 'permission_id']} )
}
