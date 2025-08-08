from pymongo import MongoClient
import os
import serveiAnalisisPersistents


# Connexió a MongoDB
def creaConexioAmongoDB_i_tornaVariacions():
    if os.path.exists("/.dockerenv"):
        client = MongoClient("mongodb://host.docker.internal:27017") #si es un contenidor doocker accedim a la bbdd aixi (en un entorn windows)
    else:
        client = MongoClient("mongodb://localhost:27017")  # si no corre en contenidor ho fem així
    bbdd = client["mercApp"] # la base de dades serà mercApp
    coleccioVariacions = bbdd["variacions"] # la col·lecció es tickets.
    return coleccioVariacions


# PRE: id_usuari del que vull cercar els productes que pujen, baixen o es mantenten.
# POST: Una diccionari de l'estil  # format tipus --> {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14} tal qual es a la collection.
def obtenirVariacionsUsuari(id_usuari):
    colVariacions = creaConexioAmongoDB_i_tornaVariacions()
    variacioUsuari = colVariacions.find_one({"_id": id_usuari}) #brutal! ja treu el diccionari directe
    return variacioUsuari

#PRE: id_usuari del que vull GUARDAR els productes que pujen, baixen o es mantenten
#     diccVariacions_RECENTCALCULAT: el diccionari que acabo de calcular i que vull guardar format tipo --> {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14}
def inserirVariacionsUsuari(id_usuari, diccVariacions_RECENTCALCULAT):
    coleccioVariacions = creaConexioAmongoDB_i_tornaVariacions()
    coleccioVariacions.insert_one(diccVariacions_RECENTCALCULAT)
