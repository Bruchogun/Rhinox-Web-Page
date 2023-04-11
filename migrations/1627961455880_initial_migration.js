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
            name varchar(100) unique not null,
            phone_number1 varchar(30),
            phone_number2 varchar(30),
            phone_code1 varchar(10),
            phone_code2 varchar(10),
            email varchar(100),
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );

        create table supplier_addresses(
            id_supplier_address serial primary key,
            address varchar(500) not null,
            description varchar(500),
            created_at timestamp with time zone default current_timestamp,
            UNIQUE (address)
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
            is_vendible boolean default TRUE,
            created_at timestamp with time zone default current_timestamp,
            unique (id_product, id_brand, id_supplier)
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
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
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
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE DEFAULT NULL,
            quantity decimal(30,10) constraint positive_quantity check (quantity >= 0) not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) DEFAULT 0,
            created_at timestamp with time zone default current_timestamp
        );

        create table clients(
            id_client serial primary key,
            name varchar(100) not null,
            last_name varchar(100),
            phone_number1 varchar(30),
            phone_number2 varchar(30),
            phone_code1 varchar(10),
            phone_code2 varchar(10),
            email varchar(100),
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );
        
        create table client_addresses(
            id_client_address serial primary key,
            address varchar(500) NOT NULL,
            description varchar(500),
            created_at timestamp with time zone default current_timestamp,
            UNIQUE(address)
        );

        alter table users
            add special_user boolean default FALSE not null;

        create table general_expenses(
            id_general_expense serial primary key,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) not null,
            amount decimal(30,10) not null,
            description varchar(500) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table balances(
            id_balance serial primary key,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE unique,
            balance decimal(30,10) default 0 constraint positive_balance check (balance >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create type movement_category as ENUM ('inv_expenses', 'inv_incomes', 'general_expenses', 'wire_transfers', 'exchange_currencys', 'orders', 'wastes');
        
        create table balance_movements(
            id_balance_movement serial primary key,
            id_balance int REFERENCES balances (id_balance) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            id_movement_category integer not null,
            type_movement_category movement_category not null,
            amount decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table combos(
            id_combo serial primary key,
            name varchar(100) not null unique,
            description varchar(2000) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_combos_items(
            id_combo int REFERENCES combos (id_combo) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) default 1,
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
            name varchar(100) not null unique,
            description varchar(2000) not null,
            manufacture varchar(2000) not null,
            time decimal(30,10) not null,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            is_vendible boolean default TRUE,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_recipes_items(
            id_recipe int REFERENCES recipes (id_recipe) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) default 1,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_clients_client_addresses(
            id_join_clients_client_address serial primary key,
            id_client int REFERENCES clients (id_client) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_client_address int REFERENCES client_addresses (id_client_address) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            created_at timestamp with time zone default current_timestamp,
            UNIQUE (id_client, id_client_address)
        );
        
        create table orders(
            id_order serial primary key,
            id_join_clients_client_address int REFERENCES join_clients_client_addresses (id_join_clients_client_address) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            price decimal(30,10) not null,
            description varchar(2000) not null,
            is_active boolean default TRUE,
            is_paid boolean default FALSE,
            is_in_process boolean default FALSE,
            is_done boolean default FALSE,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_orders_items(
            id_order int REFERENCES orders (id_order) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_item int REFERENCES items (id_item) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) default 1,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_orders_recipes(
            id_order int REFERENCES orders (id_order) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_recipe int REFERENCES recipes (id_recipe) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) default 1,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_orders_combos(
            id_order int REFERENCES orders (id_order) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_combo int REFERENCES combos (id_combo) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            quantity decimal(30,10) default 1,
            created_at timestamp with time zone default current_timestamp
        );

        create table join_suppliers_supplier_addresses(
            id_join_suppliers_supplier_address serial primary key,
            id_supplier int REFERENCES suppliers (id_supplier) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            id_supplier_address int REFERENCES supplier_addresses (id_supplier_address) ON UPDATE CASCADE  ON DELETE CASCADE NOT NULL,
            created_at timestamp with time zone default current_timestamp,
            UNIQUE(id_supplier, id_supplier_address)
        );
---------------------------------------------------------DATA----------------------------------------------------------------

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES 
                ( 'Unidad'::character varying, 'und'::character varying ),
                ( 'Gramo'::character varying, 'g'::character varying ),
                ( 'Kilogramo'::character varying, 'kg'::character varying ),
                ( 'Centímetro'::character varying, 'cm'::character varying ),
                ( 'Mililitro'::character varying, 'ml'::character varying ),
                ( 'Litro'::character varying, 'l'::character varying ),
                ( 'Centímetro cuadrado'::character varying, 'cm²'::character varying ),
                ( 'Centímetro cúbico'::character varying, 'cm³'::character varying ),
                ( 'Minuto'::character varying, 'min'::character varying ),
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
                ( '1'::integer, 'Rappi'::character varying ),
                ( '1'::integer, 'Nequi'::character varying );

        INSERT INTO public.suppliers 
            ( name, phone_number1, phone_code1, email, description ) 
            VALUES 
                ( 'Rhinox Pizza'::character varying, '3138420031'::character varying, '57'::character varying, 'fastfoodrhinox@gmail.com'::character varying, 'Fabricación propia'::character varying );
        
        INSERT INTO public.supplier_addresses 
            ( address, description ) 
            VALUES 
                ( 'Carrera 76#80B-16'::character varying, 'Bogotá noroccidente, Minuto de Dios'::character varying);

        INSERT INTO public.join_suppliers_supplier_addresses 
            ( id_supplier, id_supplier_address ) 
            VALUES 
                ( 1::integer, 1::integer);

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
        DROP TABLE IF EXISTS join_clients_client_addresses CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        DROP TABLE IF EXISTS join_orders_items CASCADE;
        DROP TABLE IF EXISTS join_orders_recipes CASCADE;
        DROP TABLE IF EXISTS join_orders_combos CASCADE;
        DROP TABLE IF EXISTS join_suppliers_supplier_addresses CASCADE;
        ` 
};