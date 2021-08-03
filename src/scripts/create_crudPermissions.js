import fs from 'fs';

const crudPermissions = process.argv.slice(2);
if (!crudPermissions) {
    console.error('Error: expected as argument the base name of the permission');
    process.exit();
}


crudPermissions.forEach(crudPermission_raw => {
    let migration_name, upSqlQuery, downSqlQuery;
    {
        const crudPermission = crudPermission_raw.toLowerCase();
        const permissions = [
            `${crudPermission}_create`,
            `${crudPermission}_read`,
            `${crudPermission}_update`,
            `${crudPermission}_delete`
        ];
        if (permissions.length === 0)
            return console.error('Error: expected as argument the name of the permission');

        migration_name = "data_crudPermission_" + crudPermission;
        const permissions_normalized = permissions.map(permission=>`'${permission}'`);
        const sqlFormatValues = permissions_normalized.map(permission=>`(${permission})`).join(',');
        upSqlQuery = `
        WITH new_permissions as(
            INSERT INTO permissions (name) VALUES ${sqlFormatValues}
            RETURNING permission_id
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
            SELECT role_id, permission_id
            FROM roles, new_permissions
            WHERE roles.name = 'master'
        ;
        `;
        downSqlQuery = `DELETE FROM permissions WHERE name IN (${permissions_normalized.join(',')})`;
    }

    const filepath = `./migrations/${Date.now()}_${migration_name}.js`
    const file_content =
`exports.up = pgm => pgm.sql\`${upSqlQuery}\`;
exports.down = pgm => pgm.sql\`${downSqlQuery}\`;`

    fs.writeFile(filepath, file_content, (err) => {
        process.exit();
    });
})

