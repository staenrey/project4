-- to make database:

CREATE DATABASE project4db;

CREATE USER project4admin WITH ENCRYPTED PASSWORD 'Project4';
GRANT ALL PRIVILEGES ON DATABASE project4db TO project4admin;

-- then quit
-- psql -U project4admin project4db
-- enter password