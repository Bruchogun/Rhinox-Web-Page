exports.up = pgm => {
    pgm.sql`

        create table measures(
            id_measure serial primary key,
            name varchar(50) unique not null,
            unit varchar(20) unique not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table brands(
            id_brand serial primary key,
            name varchar(100) unique not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table suppliers(
            id_supplier serial primary key,
            name varchar(100) not null,
            phone_number1 varchar(30),
            phone_number2 varchar(30),
            phone_number3 varchar(30),
            phone_number4 varchar(30),
            email varchar(100),
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );

        create table supplier_addresses(
            id_supplier_address serial primary key,
            id_supplier int REFERENCES suppliers (id_supplier) ON UPDATE CASCADE ON DELETE CASCADE,
            address varchar(100) not null,
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );

        create table products(
            id_product serial primary key,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            code varchar(100) unique not null,
            min_stock decimal(30,10) not null,
            max_stock decimal(30,10) not null,
            description varchar(2000) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table items(
            id_item serial primary key,
            id_product int REFERENCES products (id_product) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_brand int REFERENCES brands (id_brand) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_supplier int REFERENCES suppliers (id_supplier) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            quantity decimal(30,10) default 0 constraint positive_quantity check (quantity >= 0) NOT NULL,
            manufacture varchar(2000) not null,
            created_at timestamp with time zone default current_timestamp,
            unique (id_product, id_brand)
        );

        create table currencys(
            id_currency serial primary key,
            name_singular varchar(50) not null,
            name_plural varchar(50),
            symbol varchar(10),
            code varchar(10),
            created_at timestamp with time zone default current_timestamp
        );

        create table accounts(
            id_account serial primary key,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE,
            name varchar(50) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table inv_expenses(
            id_inv_expense serial primary key,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) constraint positive_quantity check (quantity >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table inv_incomes(
            id_inv_income serial primary key,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE ON DELETE CASCADE,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            quantity decimal(30,10) constraint positive_quantity check (quantity >= 0) not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            -- rate decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table clients(
            id_client serial primary key,
            name varchar(100) not null,
            last_name varchar(100),
            phone_number1 varchar(30),
            phone_number2 varchar(30),
            phone_number3 varchar(30),
            phone_number4 varchar(30),
            email varchar(100),
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );
        
        create table client_addresses(
            id_client_address serial primary key,
            id_client int REFERENCES clients (id_client) ON UPDATE CASCADE ON DELETE CASCADE,
            address varchar(100) not null,
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );

        alter table users
            add special_user boolean default FALSE not null;

        create table general_expenses(
            id_general_expense serial primary key,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            quantity decimal(30,10) not null,
            amount decimal(30,10) not null,
            -- rate decimal(30,10) not null,
            description varchar(500) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table balances(
            id_balance serial primary key,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE unique,
            balance decimal(30,10) default 0 constraint positive_balance check (balance >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create type movement_category as ENUM ('inv_expenses', 'inv_incomes', 'general_expenses', 'wire_transfers', 'exchange_currencys');
        
        create table balance_movements(
            id_balance_movement serial primary key,
            id_balance int REFERENCES balances (id_balance) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_movement_category integer not null,
            type_movement_category movement_category not null,
            amount decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table combos(
            id_combo serial primary key,
            name varchar(100) not null,
            description varchar(2000) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_combos_items(
            id_combo int REFERENCES combos (id_combo) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            created_at timestamp with time zone default current_timestamp
        );

        create table wire_transfers(
            id_wire_transfer serial primary key,
            description varchar(500) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table exchange_currencys(
            id_exchange_currency serial primary key,
            description varchar(500) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table recipes(
            id_recipe serial primary key,
            name varchar(100) not null,
            description varchar(1000) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_recipes_items(
            id_join_recipes_item serial primary key,
            id_recipe int REFERENCES recipes (id_recipe) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE  ON DELETE CASCADE,
            created_at timestamp with time zone default current_timestamp
        );
---------------------------------------------------------DATA----------------------------------------------------------------

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES 
                ( 'Unidad'::character varying, 'und'::character varying ),
                ( 'Gramo'::character varying, 'g'::character varying ),  
                ( 'Centímetro'::character varying, 'cm'::character varying ),
                ( 'Mililitro'::character varying, 'ml'::character varying ),
                ( 'Centímetro cuadrado'::character varying, 'cm²'::character varying ),
                ( 'Centímetro cúbico'::character varying, 'cm³'::character varying ),
                ( 'Hora'::character varying, 'h'::character varying );

        INSERT INTO public.currencys 
            ( name_singular, name_plural, symbol, code ) 
            VALUES ( 'peso'::character varying, 'pesos'::character varying, 'COP'::character varying, 'cop'::character varying ),
                   ( 'dólar'::character varying, 'dólares'::character varying, '$'::character varying, 'usd'::character varying ),
                   ( 'euro'::character varying, 'euros'::character varying, '€'::character varying, 'eur'::character varying ),
                   ( 'bitcoin'::character varying, 'bitcoins'::character varying, '₿'::character varying, 'btc'::character varying );

        INSERT INTO public.accounts 
            ( id_currency, name ) 
            VALUES 
                ( '1'::integer, 'Caja Chica'::character varying ),
                ( '1'::integer, 'Davivienda'::character varying ),
                ( '1'::integer, 'DaviPlata'::character varying ),
                ( '1'::integer, 'Nequi'::character varying );

        INSERT INTO balances 
            (id_account)
            SELECT id_account FROM accounts;
        
        UPDATE users
        SET special_user = TRUE
        WHERE username = 'master';

        `
};
exports.down = pgm => {
    pgm.sql`

        ALTER SEQUENCE IF EXISTS measures_id_measure_seq RESTART WITH 1;
        ALTER SEQUENCE IF EXISTS currencys_id_currency_seq RESTART WITH 1;
        ALTER SEQUENCE IF EXISTS accounts_id_account_seq RESTART WITH 1;
        ALTER SEQUENCE IF EXISTS balances_id_balance_seq RESTART WITH 1;
        ALTER TABLE IF EXISTS users DROP special_user;
         
        DROP TABLE IF EXISTS exchange_currencys CASCADE;
        DROP TABLE IF EXISTS wire_transfers CASCADE;
        DROP TABLE IF EXISTS join_combos_items CASCADE;
        DROP TABLE IF EXISTS combos CASCADE;
        DROP TABLE IF EXISTS balance_movements CASCADE;
        DROP TABLE IF EXISTS balances CASCADE;
        DROP TYPE IF EXISTS movement_category CASCADE;
        DROP TABLE IF EXISTS general_expenses CASCADE;
        DROP TABLE IF EXISTS client_addresses CASCADE;
        DROP TABLE IF EXISTS clients CASCADE;
        DROP TABLE IF EXISTS inv_incomes CASCADE;
        DROP TABLE IF EXISTS inv_expenses CASCADE;
        DROP TABLE IF EXISTS accounts CASCADE;
        DROP TABLE IF EXISTS currencys CASCADE;
        DROP TABLE IF EXISTS items CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
        DROP TABLE IF EXISTS supplier_addresses CASCADE;
        DROP TABLE IF EXISTS suppliers CASCADE;
        DROP TABLE IF EXISTS brands CASCADE;
        DROP TABLE IF EXISTS measures CASCADE;
        DROP TABLE IF EXISTS recipes CASCADE;
        DROP TABLE IF EXISTS join_recipes_items CASCADE;
        ` 
};