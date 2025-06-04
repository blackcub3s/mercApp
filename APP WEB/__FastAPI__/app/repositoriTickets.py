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

def persisteixTicket_a_MONGODB(nTicketsPersistits, jsonTicket):
    if jsonTicket == {}:
        return nTicketsPersistits  # No hi ha ticket a guardar
    
    try:
        # Connexió a MongoDB (creem base de dades i una colecció)
        client = MongoClient("mongodb://localhost:27017")
        bbdd = client["mercApp"] # la base de dades serà mercApp
        coleccioTickets = bbdd["tickets"] # la col·lecció es tickets.

        coleccioTickets.insert_one(jsonTicket) # Intenta inserir el document (assegura que el camp _id no estigui repetit)

        # Si tot ha anat bé, incrementem el comptador
        return nTicketsPersistits + 1

    except DuplicateKeyError:
        print("Ticket ja existeix (_id duplicat). No s’ha guardat.")
        return nTicketsPersistits  # No incrementem

    except PyMongoError as e:
        print(f"Error al guardar a MongoDB: {e}")
        return nTicketsPersistits  # No incrementem


if __name__ == "__main__":




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
