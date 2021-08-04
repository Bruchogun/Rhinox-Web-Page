exports.up = pgm => {
    pgm.sql`
       
            CREATE OR REPLACE FUNCTION alter_balance (
                v_id_balance integer,
                amount decimal(30,10),
                id_movement_category integer,
                v_type_movement_category movement_category
            ) RETURNS balance_movements
            LANGUAGE plpgsql
            AS $body$
            DECLARE
                v_balance_movements balance_movements;
            BEGIN
                UPDATE public.balances
                    SET balance = balance + amount
                    WHERE id_balance = v_id_balance;

                INSERT INTO public.balance_movements
                    ( id_balance, amount, id_movement_category, type_movement_category )
                    VALUES (v_id_balance, amount, id_movement_category, v_type_movement_category)
                    RETURNING * INTO v_balance_movements;

                RETURN v_balance_movements;
            END;
            $body$;

        `
    
};

exports.down = pgm => {
    pgm.sql`

        DROP FUNCTION IF EXISTS alter_balance;

        `
    
};