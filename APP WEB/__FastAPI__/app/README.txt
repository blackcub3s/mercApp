Punt d'entrada a l'aplicació es controlador.py.

Per correr el back-end de fastAPI i accedir als tickets dels usuaris:

Córrer:

    fastapi dev controlador.py         PER DESENVOLUPAR
    uvicorn controlador:app --reload   PER PRODUCCIO

Caldrà passar Authentication tokens per a totes les crides!

NOTA: Alternativament es pot correr l'aplicacio en un contenidor docker
pujant un nivell en l'arbre de directoris cap a la carpeta __FastAPI__ i
correr l'script en bash creaImatge_i_arrancaContenidor.bh per fer que
corri al port 8000 des del contenidor docker.