DROP DATABASE app-jwt;
CREATE DATABASE IF NOT EXISTS app-jwt;
USE app-jwt;

CREATE TABLE key_registration(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    datetime DATETIME NOT NULL,
    key_registration VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL
); 

CREATE TABLE type_user(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE _user(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(32) NOT NULL,
    id_type INT NOT NULL,
    FOREIGN KEY (id_type) REFERENCES type_user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE asignature(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE teacher(
    id_user INT NOT NULL PRIMARY KEY,
    names VARCHAR(50) NOT NULL,
    lastnames VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES _user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE teacher_career(
    id_teacher INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_teacher, name),
    FOREIGN KEY (id_teacher) REFERENCES teacher(id_user) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE _group(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    id_teacher INT NOT NULL,
    id_asignature INT NOT NULL,
    FOREIGN KEY (id_teacher) REFERENCES teacher(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_asignature) REFERENCES asignature(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE student(
    id_user INT NOT NULL PRIMARY KEY,
    names VARCHAR(50) NOT NULL,
    lastnames VARCHAR(50) NOT NULL,
    phone_number VARCHAR(10) NULL,
    semester INT NULL,
    FOREIGN KEY (id_user) REFERENCES _user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE group_student(
    id_student INT NOT NULL,
    id_group INT NOT NULL,
    PRIMARY KEY (id_student, id_group),
    FOREIGN KEY (id_student) REFERENCES student(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_group) REFERENCES _group(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE grade(
    id INT AUTO_INCREMENT NOT NULL,
    id_student INT NOT NULL,
    id_group INT NOT NULL,
    _number INT NOT NULL, 
    PRIMARY KEY (id, id_student, id_group),
    FOREIGN KEY (id_student) REFERENCES group_student(id_student) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_group) REFERENCES group_student(id_group) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO type_user(name) VALUES ("Teacher");
INSERT INTO type_user(name) VALUES ("Admin");
INSERT INTO type_user(name) VALUES ("Student");

INSERT INTO asignature(name) VALUES ("Programación Avanzada");
INSERT INTO asignature(name) VALUES ("Calculo Diferencial");
INSERT INTO asignature(name) VALUES ("Bases de datos");
INSERT INTO asignature(name) VALUES ("Estructura de datos");
INSERT INTO asignature(name) VALUES ("Desarrollo web");

INSERT INTO _user(email, password, id_type) VALUES ("admin@gmail.com", MD5("1234"), 2);
INSERT INTO _user(email, password, id_type) VALUES ("teacher@gmail.com", MD5("1234"), 1);
INSERT INTO _user(email, password, id_type) VALUES ("teacher2@gmail.com", MD5("1234"), 1);
INSERT INTO _user(email, password, id_type) VALUES ("student@gmail.com", MD5("1234"), 3);
INSERT INTO _user(email, password, id_type) VALUES ("student2@gmail.com", MD5("1234"), 3);
INSERT INTO _user(email, password, id_type) VALUES ("student3@gmail.com", MD5("1234"), 3);
INSERT INTO _user(email, password, id_type) VALUES ("student4@gmail.com", MD5("1234"), 3);

INSERT INTO teacher(id_user, names, lastnames) VALUES (2, "Juan", "Zalazar");
INSERT INTO teacher(id_user, names, lastnames) VALUES (3, "Andres", "Rogriguez");

INSERT INTO student(id_user, names, lastnames) VALUES (4, "Pedro", "Martinez");
INSERT INTO student(id_user, names, lastnames) VALUES (5, "Pepito", "Gomez");
INSERT INTO student(id_user, names, lastnames) VALUES (6, "Jose", "Garcia");

INSERT INTO _group(name, id_teacher, id_asignature) VALUES ("573-202", 2, 1);
INSERT INTO _group(name, id_teacher, id_asignature) VALUES ("573-501", 2, 5);
INSERT INTO _group(name, id_teacher, id_asignature) VALUES ("401-101", 2, 4);

INSERT INTO _group(name, id_teacher, id_asignature) VALUES ("02-245", 3, 2);

INSERT INTO _group(name, id_teacher, id_asignature) VALUES ("302-114", 3, 2);
