
CREATE TABLE IF NOT EXISTS `StubGroup` (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR NOT NULL,
	`description` TEXT,
	`order` INT NOT NULL DEFAULT(0),
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS`Stub` (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR NOT NULL,
	`description` TEXT,
	`stub` CLOB,
	`order` INT NOT NULL DEFAULT(0),
	`stub_group_id` INT,
	PRIMARY KEY (`id`)
);
