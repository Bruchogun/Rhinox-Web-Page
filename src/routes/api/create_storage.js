import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, description, location} = req.body;
        if (!name && !description && !location) return res.json({error: "Ingrese todos los datos"})

        const {rows: storage} = await sql`

            INSERT INTO storages
            (name, description, location)
            VALUES (${name}:: character varying,
                    ${description}:: character varying,
                    ${location}:: character varying);
                    
            `;

        res.json({
            success: 'Almacén creado exitosamente',
            data: storage
        })
    }
)
