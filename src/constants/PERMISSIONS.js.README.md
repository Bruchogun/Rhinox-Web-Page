## Where is file `PERMISSIONS.js`?

`PERMISSIONS.js` is generated at build time extracting information from the DB.

It contains all permissions in the DB exported as constants with their name uppercased

If there are no permissions in the DB, then you need to run the migrations `npm run migrate up`, because permissions will be inserted with DB migrations during development

### To create / update this file

    npm run build:permissions.js

---

I know this process seems very hacky, because the source code is importing a file that doesn't exist yet. But I'm confident the system as whole is very consistent, and it's enough for our needs.

The reason `PERMISSIONS.js` is not included in the source code, is because `permission_id` can easily have different values across different environments, for example, if for some reason, in the development database, a migration that creates a permission is redone (reverted and reapplied, a very common thing in development), its `permission_id` will be incremented from its previous value, because it's an autoincrement field, and that number will not match anymore with production's database.

So with this approach the `permission_id` becomes irrelevant, and what matter is that all environments have the same permissions with the same name.

And as long as all permissions are inserted through a migration, and not manually, then all permissions are replicable, and all environments should have the same permission's names.