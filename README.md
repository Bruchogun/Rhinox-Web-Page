# Rhinox

## Quick setup

*This assumes you already have a PostgreSQL server running, with an empty database created*

1. Install **git** and **node v12**
2. Clone this repository
3. Open terminal in repo's folder
4. Run `npm install`
5. Set the environment variable `DATABASE_URL` in your shell. Example: `export DATABASE_URL=postgres://user:password@domain:5432/db_name`
6. Run `npm run build:db` to migrate db, and build `PERMISSIONS.js`
7. Run development server `npm run dev`

### To deploy to vercel

1. Fork this repo and configure it in vercel as a Sapper app
2. Set the environment variables
   - `DATABASE_URL`
   - `SECRET_SESSION` ─ *you can get one with `openssl rand -base64 30`*

---

## DB

### Config connection

Set the environment variable `DATABASE_URL` in your shell. Example:

    postgres://user:password@domain:5432/db_name

- In Linux, run `export DATABASE_URL=postgres://user:password@domain:5432/db_name`
- In Windows, powershell run `$env:DATABASE_URL="postgres://user:password@domain:5432/db_name"`

Now you can run the server, or any migration-command, in this same shell / terminal session

Any DB-related-command you run in another terminal window, will not work, you'll have to re-declare `DATABASE_URL` there

### Migrations


- To migrate all pending migrations: `npm run migrate up`
- To undo **one** migration `npm run migrate down`
- To undo `n` migrations `npm run migrate down {n}`
- To redo `n` migrations `npm run migrate redo {n}`

#### Create migrations

```bash
npm run migrate create 'name of migration'
```

*DO NOT USE THIS TO CREATE PERMISSIONS*, see [Permissions](#Permissions) section

That will create an empty migration like `/migrations/1603225902395_name-of-migration.js`, see [existing migrations](/migrations) to see how this works, or check [node-pg-migrate's docs](https://salsita.github.io/node-pg-migrate/#/?id=quick-example)

### More Information
[node-pg-migrate's docs](https://salsita.github.io/node-pg-migrate/#/?id=quick-example)

## Permissions

Permissions must be created using a migration, to automate the deployment.\
I made some scripts to automate this process, *see [CRUD permissions](#create-crud-permissions) or [single permissions](#create-single-permissions)*

`PERMISSIONS.js` is a file that is not included in the repo, because it's builded after each DB-migration. *See [PERMISSIONS.js.README](src/constants/PERMISSIONS.js.README.md)* for more details\
It allows you to easily import permission's ids and names when developing API endpoints, to validate permissions.

To build that file, run `npm run build:permissions.js`, but most likely you will be running `npm run build:db` which migrates any pending changes and then builds the file.

### Create CRUD permissions

To create CRUD permissions (Create, Read, Update, Delete)

```bash
npm run create:crudPermissions accounts
```

That will create a migration to insert the following permissions:
- accounts_create
- accounts_read
- accounts_update
- accounts_delete

To migrate them and build `PERMISSIONS.js`

```bash
npm run build:db
```

### Create single permissions

```bash
npm run create:permissions approve_loans ask_for_approval
```

That will create a migration to insert the following permissions:
- approve_loans
- ask_for_approval

To migrate them and build `PERMISSIONS.js`

```
npm run build:db
```
