DROP DATABASE IF EXISTS mercApp;
CREATE DATABASE mercApp;
USE mercApp;

CREATE TABLE usuari (  -- aquesta es la info que es guarda quan un usuari posa la seva contrassenya encara que no pagui (igual a netflix)
	id_usuari INTEGER AUTO_INCREMENT,
    correu_electronic VARCHAR(70) NOT NULL UNIQUE,
    hash_contrasenya VARCHAR(255) NOT NULL,  -- Amb el Bcrypt algorithm es suficient un VARCHAR 60 PERo POSEM UN VARCHAR(255) per acomodar canvis futurs.
	alies VARCHAR(30), -- el generarem aleatoriament potser
	permisos TINYINT NOT NULL, -- 0 es que no te acces a recursos pero ja tenim les seves dades al sistema (ens ha donat correu i contrasenya). superior a 0 sera algun permis que permet accedir a l'aplicatiu (2 superusuari en aquest cas)
    data_registre DATETIME NOT NULL DEFAULT NOW(), -- AQUESTA COLUMNA NO L'HE ACONSEGUIT MAPEJAR AMB JAVA JPA ORM
    PRIMARY KEY (id_usuari)
);


CREATE TABLE usuari_ampliat ( -- nomes usuaris quan JA HAN PAGAT o han pagat alguna vegada (dades potencialment importants per a hisenda)! veure si es pot obtenir de la info de pagament
	id_usuari INTEGER,
    nom VARCHAR(25),
    primer_cognom VARCHAR(25),
    segon_cognom VARCHAR(25),
    
    PRIMARY KEY(id_usuari),
    FOREIGN KEY(id_usuari) REFERENCES usuari(id_usuari)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- INSERT INTO usuari(correu_electronic, hash_contrasenya, alies, permisos) 
-- VALUES ('acces1@gmail.com', "12345678Mm_","blackcub3s",1);

/*INSERT INTO usuari(correu_electronic, hash_contrasenya, alies, permisos) 
VALUES ('noacces@gmail.com', "123","whitecub3s",0);*/
-- INSERT INTO usuari(correu_electronic, hash_contrasenya, alies, permisos) VALUES ('sant.44@gmail.com', "asd","copernic",0);
-- INSERT INTO usuari_ampliat (id_usuari, nom, primer_cognom, segon_cognom) VALUES (4, "santi", "sanchez","sans");

SELECT * FROM usuari;
SELECT * FROM usuari_ampliat;

UPDATE usuari
SET permisos = 0
WHERE correu_electronic = "noacces@gmail.com";

