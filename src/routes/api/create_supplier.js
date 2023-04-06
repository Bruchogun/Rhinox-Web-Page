import { compose } from "compose-middleware";
import { ROLES_CREATE } from "../../constants/PERMISSIONS";
import { sql } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {selected_supplier, phone_number1, phone_number2, phone_code1, phone_code2, email, address, description} = req.body;

        if(selected_supplier.value === selected_supplier.label){
            const {rows: supplier} = await sql`
                WITH new_supplier as (
                    INSERT INTO suppliers
                        (name, phone_number1, phone_number2, phone_code1, phone_code2, email, description)
                        VALUES (${selected_supplier.value}:: character varying,
                                ${phone_number1}:: character varying,
                                ${phone_number2}:: character varying,
                                ${phone_code1}:: character varying,
                                ${phone_code2}:: character varying,
                                ${email}:: character varying,
                                ${description}:: character varying)
                        RETURNING id_supplier
                ), new_supplier_address as(
                    INSERT INTO supplier_addresses
                        (address, description)
                        VALUES (${address.address}, ${address.description})
                        ON CONFLICT (address) DO
                        UPDATE
                        SET address = EXCLUDED.address
                        RETURNING id_supplier_address
                )
                    INSERT INTO join_suppliers_supplier_addresses
                        (id_supplier, id_supplier_address)
                        SELECT 
                            new_supplier.id_supplier,
                            new_supplier_address.id_supplier_address
                        FROM new_supplier, new_supplier_address
                        ON CONFLICT(id_supplier, id_supplier_address) DO NOTHING
                    ;
                        
                `;
    
            res.json({
                success: 'Proveedor registrado exitosamente',
                data: supplier
            })
        }else{
            const {rows: supplier} = await sql`
            
                WITH new_supplier_address as(
                    INSERT INTO supplier_addresses
                        (address, description)
                        VALUES(${address.address}:: character varying, ${address.description}:: character varying)
                        ON CONFLICT(address) DO 
                        UPDATE
                        SET address = EXCLUDED.address
                        RETURNING id_supplier_address
                )   INSERT INTO join_suppliers_supplier_addresses
                        (id_supplier, id_supplier_address)
                        SELECT 
                            ${selected_supplier.id_supplier}::integer,
                            new_supplier_address.id_supplier_address
                        FROM new_supplier_address
                        ON CONFLICT(id_supplier, id_supplier_address) DO NOTHING
                        ;    
                `;
    
            res.json({
                success: 'Proveedor registrado exitosamente',
                data: supplier
            })
        }
    }
)
