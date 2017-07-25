
-- to make a table in CLI, look at https://stackoverflow.com/questions/20775490/how-to-create-or-manage-heroku-postgres-database-instance and
-- https://www.sitepoint.com/hosted-postgresql-with-heroku/ for info. Type commands from line 11-20 to create new table, 22-23 to insert values
-- into the table.

DROP DATABASE IF EXISTS sensors;
CREATE DATABASE sensors;

\c sensors;

CREATE TABLE sensors (
  ID SERIAL PRIMARY KEY,
  --name VARCHAR,
  type VARCHAR,
  --breed VARCHAR,
  timer INTEGER,
  value INTEGER
  --age INTEGER,
  --sex VARCHAR
);

INSERT INTO sensors (type, timer, value)
  VALUES ('ldr', 1122, 0);
