CREATE TABLE IF NOT EXISTS trip (
	id SERIAL,
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	topic STRING NOT NULL,
	ad STRING NOT NULL,
	content STRING NOT NULL,
	region STRING NOT NULL,
	meet_date TIMESTAMP NOT NULL,
	meet_place STRING NOT NULL,
	dismiss_date TIMESTAMP NOT NULL,
	dismiss_place STRING NOT NULL,
	fee INT8 NOT NULL,
	other STRING NULL,
	owner_name STRING NOT NULL,
	owner_phone STRING NOT NULL,
	owner_line STRING NULL,
	code STRING NOT NULL,
	status STRING NOT NULL,
	expired_date STRING NULL,
	notify_date STRING NULL,
	reason STRING NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC)
);