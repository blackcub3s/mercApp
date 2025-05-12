#!/bin/bash

#genero la IMATGE front-end-nginx a partir del Dockerfile de la carpeta actual.
docker build -t front-end-nginx .

#per si el contenidor derivat de la IMATGE funcionava, el paro. 
#Si existeix l'he d'esborrar (nomes ho puc fer si esta parat).
docker stop contNginx
docker rm contNginx

#creo contenidor contNginx des de la imatge front-end-nginx recent creada.
#redirecciono port 80 de nginx (dreta dels dospunts) al port 5500 (esquerra dels dos punts)
#ja que vull el mateix numero de port que feiem servir a vscode amb liveserver.
docker create -p 5500:80 --name contNginx front-end-nginx 
docker start contNginx
