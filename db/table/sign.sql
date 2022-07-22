CREATE TABLE sign (
	id SERIAL,
	name STRING NOT NULL,
	phone STRING NOT NULL,
	line STRING NULL,
	birth_year STRING NOT NULL,
	is_self BOOL NOT NULL,
	accompany BOOL NULL,
	can_join BOOL NULL,
	comment STRING NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	trip_id INT8 NOT NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (trip_id) REFERENCES trip (id)
);