#!/bin/bash

#genero la IMATGE back-end-springboot a partir del Dockerfile de la carpeta actual.
docker build -t back-end-springboot .

#per si el contenidor derivat de la IMATGE funcionava, el paro. 
#Si existeix l'he d'esborrar (nomes ho puc fer si esta parat).
docker stop contSpringBoot
docker rm contSpringBoot

#creo contenidor contSpringBoot des de la imatge back-end-springboot recent creada.
#redirecciono port 8080 de springboot intern (dreta dels dospunts) al port 8080 (esquerra dels dos punts)
#ja que vull el mateix numero de port que feiem servir amb intelliJ.
# amb -e SPRING_PROFILES_ACTIVE=prod passo una variable d'entorn que faria el mateix que haver escrit en application.properties
# la propietat spring.profiles.active = prod. Aquesta propietat no la passem a application.properties perquè volem correr la base de dades
# local a intelliJ en el cas que no es passa el profile prod. Aqui passem el perfil prod ja que carreguem application-prod.properties que 
# fara un override de 
docker create -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod --name contSpringBoot back-end-springboot 
docker start -a contSpringBoot