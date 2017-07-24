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
