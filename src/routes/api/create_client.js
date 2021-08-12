import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, last_name, number1, number2, number3, number4, email, description, address} = req.body;
        if (!name) return res.json({error: "Ingrese al menos un nombre válido"})

        const {rows: client} = await sql`
        
        WITH new_client as (
            INSERT INTO clients
                (name, last_name, phone_number1, phone_number2, phone_number3, phone_number4, email, description)
                VALUES (${name}:: character varying,
                        ${last_name}:: character varying,
                        ${number1}:: character varying,
                        ${number2}:: character varying,
                        ${number3}:: character varying,
                        ${number4}:: character varying,
                        ${email}:: character varying,
                        ${description}:: character varying)
                RETURNING id_client
        )
            INSERT INTO client_addresses
                (id_client, address, description)
                SELECT
                    new_client.id_client,
                    ${address.address},
                    ${address.description}
                FROM new_client;
                    
            `;

        res.json({
            success: 'Cliente creado exitosamente',
            data: client
        })
    }
)
