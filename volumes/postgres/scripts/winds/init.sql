CREATE TABLE data (
	id SERIAL PRIMARY KEY,
    datetime TIMESTAMP,
	weight4 INT,
	front4 VARCHAR(10),
	middle4 VARCHAR(10),
	rear4 VARCHAR(10),
	added4 INT,
	speed4 INT,
	trolley4 INT,
    weight3 INT,
	front3 VARCHAR(10),
	middle3 VARCHAR(10),
	rear3 VARCHAR(10),
	added3 INT,
	speed3 INT,
	trolley3 INT,
    weight2 INT,
	front2 VARCHAR(10),
	middle2 VARCHAR(10),
	rear2 VARCHAR(10),
	added2 INT,
	speed2 INT,
	trolley2 INT,
    weight1 INT,
	front1 VARCHAR(10),
	middle1 VARCHAR(10),
	rear1 VARCHAR(10),
	added1 INT,
	speed1 INT,
	trolley1 INT,
	windSpeed FLOAT,
	windDirection INT,
	windsInstructor VARCHAR(30),
	bigTopInstructor VARCHAR(30),
	comment VARCHAR(200)
);

CREATE USER zw_admin WITH PASSWORD 'zw_pass';
GRANT ALL ON DATABASE winds TO zw_admin;
GRANT ALL ON TABLE data TO zw_admin;
GRANT USAGE ON SCHEMA public TO zw_admin;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA PUBLIC TO zw_admin;

INSERT INTO data VALUES (
	DEFAULT,
	'2021-08-16 13:56:09',
	78, null, 'OLD_RED', null, 0, 34, 187,
	112, 'NEW_RED', null, 'YELLOW', 0, 37, 238,
	null, null, null, null, null, null, null,
	null, null, null, null, null, null, null,
	12.3, 289,
	'Ben', 'Sam',
	'This is a comment'
);

INSERT INTO data VALUES (
	DEFAULT,
	'2021-08-16 13:59:13',
	73, null, 'OLD_RED', null, 0, 34, 127,
	34, null, null, null, 40, 31, 148,
	null, null, null, null, null, null, null,
	null, null, null, null, null, null, null,
	12.3, 289,
	'Ben', 'Sam',
	'This is another comment'
);



