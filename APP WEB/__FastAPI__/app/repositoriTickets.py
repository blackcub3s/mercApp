#PRE: - nTicketsPersistits: variable que emmagatzema quants tiquets s'han guardat en iteracions anteriors.
#     - jsonTicket (dict): un diccionari buit, sense info; o ple amb info del ticket JUST ANTERIOR parsejat.
#POST: 
#     - nTicketsPersistits: - valdrà igual que le paràmetre d'entrada si i només si:
#                                   A) jsonTicket és buit (cas, que es donarà solsament quan no s'hagi pogut extreure 
#                                      prèviament el ticket en la crida previa a la funció fesScrapTicketMercadona(). També 
#                                      valdrà igual que el paràmetre d'entrada.
#                                   B) Ha fallat la persistència a mongoDB per algun altre motiu.
#
#                            - valdrà nTicketsPersistits + 1: si aconseguim guardar el ticket a mongoDB.
#                            - El ticket si tot va bé es persistirà a mongoDB.
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError




# Connexió a MongoDB 
# (creem base de dades, si no existeix; i una colecció, si no existeix)
def creaConexioAmongoDB_i_tornaTickets():
    client = MongoClient("mongodb://localhost:27017")
    bbdd = client["mercApp"] # la base de dades serà mercApp
    coleccioTickets = bbdd["tickets"] # la col·lecció es tickets.
    return coleccioTickets



def persisteixTicket_a_MONGODB(nTicketsPersistits, jsonTicket):
    if jsonTicket == {}:
        return nTicketsPersistits  # No hi ha ticket a guardar
    try:

        coleccioTickets = creaConexioAmongoDB_i_tornaTickets() #faig la conexio (creant la bbdd i la conexio si no existeixen, automaticament)
        coleccioTickets.insert_one(jsonTicket) # Intenta inserir el document (assegura que el camp _id no estigui repetit)
        
        return nTicketsPersistits + 1 # Si tot ha anat bé, incrementem el comptador
    except DuplicateKeyError:
        print("Ticket ja existeix (_id duplicat). No s’ha guardat.")
        return nTicketsPersistits  # No incrementem
    except PyMongoError as e:
        print(f"Error al guardar a MongoDB: {e}")
        return nTicketsPersistits  # No incrementem




def obtenir_tickets_per_usuari(id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()
    tickets_usuari = list(colTickets.find({"idUsuari": id_usuari}))
    return tickets_usuari





#PRE: idUsuari d'un usuari a la base de dades
#POST: obtindrem per a aquest usuari un diccionari amb 
#      els noms dels productes de més a menys aparicions en els tickets (recompte)  
#     {}'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1]
def frequencia_productes_per_usuari(id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()

    pipeline = [
        {"$match": {"idUsuari": id_usuari}},  # Filtra només els tiquets d'aquest usuari

        {"$project": {
            "productes": {"$objectToArray": "$productesAdquirits"}
        }},
        
        {"$unwind": "$productes"},  # Separa cada producte en un document nou

        {"$group": {
            "_id": "$productes.k",  # El nom del producte
            "recompte": {"$sum": 1}
        }},

        {"$sort": {"recompte": -1}}  # Ordena de més a menys freqüència
    ]

    resultats = list(colTickets.aggregate(pipeline)) #passem a llista l'objecte
    
    # passem la llista a diccionari
    d = {}
    for doc in resultats:
        d[doc["_id"]] = doc["recompte"]
    return d 


if __name__ == "__main__":
    #print(obtenir_tickets_per_usuari(3))
    #print(frequencia_productes_per_usuari(2)[0])

    import json
    dictTickets = frequencia_productes_per_usuari(2)
    print(dictTickets)
    #print(json.dumps(dictTickets, indent=4, ensure_ascii=False))
    



















    """
    jsonTicket_exemple = {
        "_id": "2423-015-327168_OP3084620",
        "idUsuari": 3,
        "productesAdquirits": {
            "BEZOYA 1,5L": {
                "esGranel": False,
                "preuUnitari": 0.74,
                "quantitat": 1,
                "categoria": 13,
                "import": 0.74
            },
            "FILETE PECHUGA": {
                "esGranel": False,
                "preuUnitari": 4.99,
                "quantitat": 1,
                "categoria": 13,
                "import": 4.99
            },
            "VINAGRE DE VINO BLAN": {
                "esGranel": False,
                "preuUnitari": 0.65,
                "quantitat": 1,
                "categoria": 13,
                "import": 0.65
            },
            "BOLSA PLASTICO": {
                "esGranel": False,
                "preuUnitari": 0.15,
                "quantitat": 1,
                "categoria": 13,
                "import": 0.15
            }
        },
        "totalTicket": 6.53,
        "direccioSuper": "C/ SENYERA 24 46006 VALENCIA",
        "data": "2025-05-17",
        "hora": "13:38"
    }

    n = 0
    n = persisteixTicket_a_MONGODB(n, jsonTicket_exemple)
    print("Tickets persistits:", n)
    """
