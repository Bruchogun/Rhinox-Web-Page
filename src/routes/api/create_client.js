import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {selected_client, last_name, number1, number2, extension1, extension2, email, description, address} = req.body;


        if(selected_client.value === selected_client.label){
            const {rows: client} = await sql`
            
            WITH new_client as (
                INSERT INTO clients
                    (name, last_name, phone_number1, phone_number2, phone_code1, phone_code2, email, description)
                    VALUES (${selected_client.value}:: character varying,
                            ${last_name}:: character varying,
                            ${number1}:: character varying,
                            ${number2}:: character varying,
                            ${extension1}:: character varying,
                            ${extension2}:: character varying,
                            ${email}:: character varying,
                            ${description}:: character varying)
                    RETURNING id_client
            ), new_client_address as(
                INSERT INTO client_addresses
                    (address, description)
                    VALUES(${address.address}:: character varying, ${address.description}:: character varying)
                    ON CONFLICT(address) DO 
                    UPDATE
                    SET address = EXCLUDED.address
                    RETURNING id_client_address
            )   INSERT INTO join_clients_client_addresses
                    (id_client, id_client_address)
                    SELECT 
                        new_client.id_client,
                        new_client_address.id_client_address
                    FROM new_client, new_client_address
                    ON CONFLICT(id_client, id_client_address) DO NOTHING
                    ;
                        
                `;
    
            res.json({
                success: 'Cliente creado exitosamente',
                data: client
            })
        }else{
            const {rows: client} = await sql`
            
            WITH new_client_address as(
                INSERT INTO client_addresses
                    (address, description)
                    VALUES(${address.address}:: character varying, ${address.description}:: character varying)
                    ON CONFLICT(address) DO 
                    UPDATE
                    SET address = EXCLUDED.address
                    RETURNING id_client_address
            )   INSERT INTO join_clients_client_addresses
                    (id_client, id_client_address)
                    SELECT 
                        ${selected_client.id_client}::integer,
                        new_client_address.id_client_address
                    FROM new_client_address
                    ON CONFLICT(id_client, id_client_address) DO NOTHING
                    ;
                        
                `;
    
            res.json({
                success: 'Cliente creado exitosamente',
                data: client
            })
        }
    }
)
