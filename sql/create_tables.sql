DROP TABLE IF EXISTS schedules; -- added DROP TABLE so we can make changes each time
DROP TABLE IF EXISTS users; -- same

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, -- conventionally, all primary keys are called just 'id'
  surname VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  password VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY, -- conventionally, all primary keys are called just 'id'
  user_id INTEGER NOT NULL, -- this should not be serial! corrected to integer
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- changed names
);

-- test cases to seed into database:

-- INSERT INTO users (surname, first_name, email, password)
-- VALUES ('surname1', 'name1', 'email1@email', 'password1');

-- INSERT INTO users (surname, first_name, email, password)
-- VALUES ('surname2', 'name2', 'email2@email', 'password2');

-- INSERT INTO schedules (user_id, day_of_week, start_time, end_time)

-- values (1, 1, '10:00', '12:00');
-- values (2, 2, '14:00', '16:00');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO project4admin;
