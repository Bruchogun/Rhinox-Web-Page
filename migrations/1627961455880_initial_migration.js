exports.up = pgm => {
    pgm.sql`
        create table clients(
            id_clients serial primary key,
            name varchar(100) not null,
            last_name varchar(100) not null,
            phone_number1 varchar(30),
            phone_number2 varchar(30),
            phone_number3 varchar(30),
            phone_number4 varchar(30),
            email varchar(100),
            address varchar(400),
            description varchar(500),
            created_at timestamp with time zone default current_timestamp
        );
        `
};
exports.down = pgm => {
    pgm.sql`
         
         drop table if exists clients;
        ` 
};