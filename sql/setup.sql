-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS items cascade;
DROP TABLE IF EXISTS images cascade;


CREATE TABLE users (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username VARCHAR,
first_name VARCHAR,
last_name VARCHAR,
email VARCHAR NOT NULL UNIQUE,
avatar VARCHAR,
password_hash VARCHAR NOT NULL,
zipcode INT
);

CREATE TABLE items (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id BIGINT NOT NULL,
title VARCHAR NOT NULL,
description VARCHAR NOT NULL, 
buy BOOLEAN NOT NULL,
rent BOOLEAN NOT NULL,
borrow BOOLEAN NOT NULL,
zipcode INT,
sold BOOLEAN DEFAULT(false),
listed_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url VARCHAR NOT NULL,
    item_id BIGINT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

INSERT INTO users (
    email,
    password_hash
)
VALUES 
    ('cole@example.com', '$2b$10$fmmjRO8ibktXwC4wEfVSfOlbjmbPBYhDWFZZ58dRy7V2gjKfKfPqm');

INSERT INTO items (
    user_id,
    title,
    description,
    buy,
    rent,
    borrow,
    zipcode,
    sold
)
VALUES
    ('1', 'Cheese', 'For smelling purposes only, must be returned in original condition', false, false, true, 97232, false),
    ('1', 'Crayons', 'Heavily used and missing most colors in packet, strange odor', true, true, false, 97214, false);