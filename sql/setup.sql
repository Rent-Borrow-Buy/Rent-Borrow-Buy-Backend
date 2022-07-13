-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS items cascade;


CREATE TABLE users (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username VARCHAR,
email VARCHAR NOT NULL UNIQUE,
avatar VARCHAR,
password_hash VARCHAR NOT NULL,
zipcode INT
);

CREATE TABLE items (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id BIGINT NOT NULL,
description VARCHAR NOT NULL, 
buy BOOLEAN NOT NULL DEFAULT(false),
rent BOOLEAN NOT NULL DEFAULT(false),
borrow BOOLEAN NOT NULL DEFAULT(false),
zipcode INT,
sold BOOLEAN NOT NULL DEFAULT(false),
listed_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (
    email,
    password_hash
)
VALUES 
    ('cole@example.com', '$2b$10$fmmjRO8ibktXwC4wEfVSfOlbjmbPBYhDWFZZ58dRy7V2gjKfKfPqm');
