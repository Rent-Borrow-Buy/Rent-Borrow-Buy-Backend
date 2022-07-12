-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users cascade;


CREATE TABLE users (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username VARCHAR,
email VARCHAR NOT NULL UNIQUE,
avatar VARCHAR,
password_hash VARCHAR NOT NULL,
zipcode INT
);