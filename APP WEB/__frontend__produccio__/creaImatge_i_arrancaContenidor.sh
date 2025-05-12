#!/bin/bash

#genero la IMATGE back-end-nginx a partir del Dockerfile de la carpeta actual.
docker build -t front-end-nginx .

#per si el contenidor derivat de la IMATGE funcionava, el paro. 
#Si existeix l'he d'esborrar (nomes ho puc fer si esta parat).
docker stop contNginx
docker rm contNginx

#creo contenidor contNginx des de la imatge back-end-nginx recent creada.
#redirecciono port 8000 (dreta dels dospunts) al port XXXX (esquerra dels dos punts)
docker create -p 8000:8000 --name contNginx back-end-nginx 
docker start contNginx
