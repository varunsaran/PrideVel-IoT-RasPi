/*
Commented because not required. .sql file to be used is sensors.sql not old puppies.sql
DROP DATABASE IF EXISTS sensors;
CREATE DATABASE sensors;

\c sensors;

CREATE TABLE sensors (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  breed VARCHAR,
  age INTEGER,
  sex VARCHAR
);

INSERT INTO sensors (name, breed, age, sex)
  VALUES ('Tyler', 'Retrieved', 3, 'M');
*/
