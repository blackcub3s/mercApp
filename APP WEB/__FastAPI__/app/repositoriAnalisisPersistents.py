from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
import os



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
#      - dicVariacionsProductes: té els productes amb info de si pujen mantene o baixen tal que aixi  {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14}
# POST: retorno format tipus --> {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14}
#       Per a l'usuari id_usuariEnTOken donat passa una de dues coses: 
#             A) es persistenxien les dades dicVariacionsProductes, calculades en el service, en la collection "variacions"
#             B) sobtenen les variacions de preus que tenen els seus tikets cercant a la coleccio variacions en cas que JA S'HAGUESSIN CALCULAT (evitant recalcular-les)
def persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuariEnToken, dicVariacionsProductes):

    #TRACTO D'AFEGIR PER PRIMER COP
    try: 
        coleccioVariacions = creaConexioAmongoDB_i_tornaVariacions() #faig la conexio (creant la bbdd i la conexio si no existeixen, automaticament)
        coleccioVariacions.insert_one(dicVariacionsProductes)
        print("Inserció feta a bbdd!")
        return dicVariacionsProductes
    
    #SI JA EXISTEIX LA INFORMACIO DE INCREMENTS I DECREMENTS GUARDADA HO INFORMO
    except DuplicateKeyError:
        print("Ja era a la BBDD! Es retorna el resultat existent :)")
        return obtenirVariacionsUsuari(idUsuariEnToken)
    
    except PyMongoError as e:
        print(f"Error al guardar a MongoDB: {e}")
        return {} #veure què poso aqui


if __name__ == "__main__":
    dictGuardat = persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(2)
    print(dictGuardat)