from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
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



# PRE: - id_usuariEnTOken: conte l'id d'usuari.
# POST: retorno format tipus --> {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14}
#       Per a l'usuari id_usuariEnTOken donat passa una de dues coses: 
#             A) es persistenxien les dades dicVariacionsProductes, calculades en el service, en la collection "variacions"
#             B) sobtenen les variacions de preus que tenen els seus tikets cercant a la coleccio variacions en cas que JA S'HAGUESSIN CALCULAT (evitant recalcular-les)
def persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuariEnToken):

    #TRACTO D'AFEGIR PER PRIMER COP
    try: 
        coleccioVariacions = creaConexioAmongoDB_i_tornaVariacions() #faig la conexio (creant la bbdd i la conexio si no existeixen, automaticament)
        dicVariacions = obtenirVariacionsUsuari(idUsuariEnToken)
        
        if dicVariacions:
            print("Ja s'havia calculat la variacio de preus: la recuperem de la BBDD!")
            return dicVariacions
        else:
            diccVariacions_RECENTCALCULAT = serveiAnalisisPersistents.computaProductesPujenMantenenBaixen_perUsuari(idUsuariEnToken) #PROGRAMAR LA SEUA OBTENCIÓ EN EL serveiAnalisisPersistents
            coleccioVariacions.insert_one(diccVariacions_RECENTCALCULAT)
            print("Inserció feta a bbdd (hem calculat totes les pujades, baixades i manteniment de preus!")
            return diccVariacions_RECENTCALCULAT
        
    except PyMongoError as e:
        print(f"Error al guardar a MongoDB: {e}")
        return {} #veure què poso aqui


if __name__ == "__main__":
    d = persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(2)
    print(d)