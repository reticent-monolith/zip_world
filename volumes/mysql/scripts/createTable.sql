CREATE TABLE `windsData` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `datetime` DATETIME,
	`weight4` INT(3),
	`front4` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`middle4` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`rear4` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`added4` INT(3),
	`speed4` INT(3),
	`trolley4` INT(3),
    `weight3` INT(3),
	`front3` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`middle3` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`rear3` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`added3` INT(3),
	`speed3` INT(3),
	`trolley3` INT(3),
    `weight2` INT(3),
	`front2` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`middle2` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`rear2` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`added2` INT(3),
	`speed2` INT(3),
	`trolley2` INT(3),
    `weight1` INT(3),
	`front1` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`middle1` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`rear1` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`added1` INT(3),
	`speed1` INT(3),
	`trolley1` INT(3),
	`windSpeed` FLOAT(4),
	`windDirection` INT(3),
	`windsInstructor` VARCHAR(30),
	`bigTopInstructor` VARCHAR(30),
	`comment` VARCHAR(200),
	PRIMARY KEY (`id`)
);

INSERT INTO windsData VALUES (
	null,
	"2021-08-15 13:56:09",
	78, null, "OLD_RED", null, 0, 34, 187,
	112, "NEW_RED", null, "YELLOW", 0, 37, 238,
	null, null, null, null, null, null, null,
	null, null, null, null, null, null, null,
	12.3, 289,
	"Ben", "Sam",
	"This is a comment"
);

INSERT INTO windsData VALUES (
	null,
	"2021-08-15 13:59:13",
	73, null, "OLD_RED", null, 0, 34, 127,
	34, null, null, null, 40, 31, 148,
	null, null, null, null, null, null, null,
	null, null, null, null, null, null, null,
	12.3, 289,
	"Ben", "Sam",
	"This is another comment"
);