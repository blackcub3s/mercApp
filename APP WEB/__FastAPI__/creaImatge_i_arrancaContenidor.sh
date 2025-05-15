#!/bin/bash

#genero la IMATGE back-end-fastapi a partir del dockerfile de la carpeta actual.
docker build -t back-end-fastapi .

#per si el contenidor derivat de la IMATGE funcionava, el paro. 
#Si existeix l'he d'esborrar (nomes ho puc fer si esta parat).
docker stop contFastApi
docker rm contFastApi

#creo contenidor contFastApi des de la imatge back-end-fastapi recent creada.
#redirecciono port 8000 (dreta dels dospunts) al port XXXX (esquerra dels dos punts)
docker create -p 8000:8000 --name contFastApi back-end-fastapi 
docker start -a contFastApi #redirigeixo la sortida per veure errors
