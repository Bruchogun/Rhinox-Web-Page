import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, phone_number1, phone_number2, phone_number3, phone_number4, email, address, description} = req.body;
        if (!name) return res.json({error: "Ingrese al menos un nombre válido"})

        const {rows: supplier} = await sql`

            WITH new_supplier as (
                INSERT INTO suppliers
                (name, phone_number1, phone_number2, phone_number3, phone_number4, email, description)
                VALUES (${name}:: character varying,
                        ${phone_number1}:: character varying,
                        ${phone_number2}:: character varying,
                        ${phone_number3}:: character varying,
                        ${phone_number4}:: character varying,
                        ${email}:: character varying,
                        ${description}:: character varying)
                        RETURNING id_supplier
            )
                INSERT INTO supplier_addresses
                    (id_supplier, address, description)
                    SELECT
                        new_supplier.id_supplier,
                        ${address.address},
                        ${address.description}
                    FROM new_supplier;
                    
            `;

        res.json({
            success: 'Proveedor registrado exitosamente',
            data: supplier
        })
    }
)
