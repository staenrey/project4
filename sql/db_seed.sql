INSERT INTO users (surname, first_name, email, password)
VALUES ('Aringay', 'Jake', 'jakearingay@email.com', '695D6CC588C73738C7B30D21954AF72431EEB703AE6AE1B0135ACEA7F98E2FDB'); -- password in plain text is "Testpassword1!". SHA256 hash sample created thru https://passwordsgenerator.net/sha256-hash-generator/

INSERT INTO users (surname, first_name, email, password)
VALUES ('Besman', 'Stan', 'stanbesman@email.com', '4CD1AE19CF2313F249E9740CB0EE99A58903D207BB7DBC66CDAC7697D2E524D2'); -- password in plain text is "Testpassword2!". SHA256 hash sample created thru https://passwordsgenerator.net/sha256-hash-generator/

INSERT INTO users (surname, first_name, email, password)
VALUES ('Bakour', 'Ahmad', 'ahmadbakour@email.com', '4CD1AE19CF2313F249E9740CB0EE99A58903D207BB7DBC66CDAC7697D2E524D2'); -- password in plain text is "Testpassword2!". SHA256 hash sample created thru https://passwordsgenerator.net/sha256-hash-generator/

INSERT INTO schedules (user_id, day_of_week, start_time, end_time)
VALUES (1, 1, '10:00', '12:00');

INSERT INTO schedules (user_id, day_of_week, start_time, end_time)
VALUES (1, 2, '10:00', '12:00');

INSERT INTO schedules (user_id, day_of_week, start_time, end_time)
VALUES (1, 3, '10:00', '12:00');

INSERT INTO schedules (user_id, day_of_week, start_time, end_time)
VALUES (2, 2, '14:00', '16:00');