from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
import os



# Connexió a MongoDB 
# (creem base de dades, si no existeix; i una colecció, si no existeix)
def creaConexioAmongoDB_i_tornaTickets():
    if os.path.exists("/.dockerenv"):
        client = MongoClient("mongodb://host.docker.internal:27017") #si es un contenidor doocker accedim a la bbdd aixi (en un entorn windows)
    else:
        client = MongoClient("mongodb://localhost:27017")  # si no corre en contenidor ho fem així
    bbdd = client["mercApp"] # la base de dades serà mercApp
    coleccioTickets = bbdd["tickets"] # la col·lecció es tickets.
    return coleccioTickets


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



#FUNCIO NO UTILITZADA YET
def obtenir_tickets_per_usuari(id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()
    tickets_usuari = list(colTickets.find({"idUsuari": id_usuari}))
    return tickets_usuari





#PRE: idUsuari d'un usuari a la base de dades
#POST: obtindrem per a aquest usuari un diccionari amb 
#      els noms dels productes de més a menys aparicions en els tickets (recompte)  
#     {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}
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



"""
#PRE: nomProducte: un string identificatiu d'un producte en la base de dades per a un id_usuari particular.
#POST: una llista de diccionaris de python tal que així on es mostren la data d'adquisició del producte "nomProducte" 
#      i el seu preuUnitari. arrDataPreu és un array per a un Sol usuari, el de id_usuari que passa per parametre.

    arrDataPreu = [
      { "x": "2022-06-01", "y": 1 },
      { "x": "2022-08-01", "y": 3 },
      { "x": "2026-06-01", "y": 6 }
    ];
"""
def obtinguesArrayDeParellsDataPreuUnitari(nomProducte, id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()

    # Busquem tots els tiquets per a l'usuari on apareix el producte (cal fer una consulta amb $in per a cercar dins de productesAdquirits)
    # sense la qual no podriem cercar productes que continguin punts en el seu nom.
    cursor = colTickets.aggregate([
        {"$match": {"idUsuari": id_usuari}},
        {
            "$match": {
                "$expr": {
                    "$in": [nomProducte, {
                        "$map": {
                            "input": {"$objectToArray": "$productesAdquirits"},
                            "as": "item",
                            "in": "$$item.k"
                        }
                    }]
                }
            }
        }
    ])

    arrDataPreu = []

    for doc in cursor:
        data = doc.get("data")  # ja en format "YYYY-MM-DD"
        infoProducte = doc["productesAdquirits"].get(nomProducte)

        if infoProducte:
            preu_unitari = infoProducte.get("preuUnitari")
            if data and preu_unitari is not None:
                arrDataPreu.append({
                    "x": data,
                    "y": preu_unitari
                })

    return arrDataPreu



#PRE: un id_usuari (enter)
#POST: obtindrem un diccionari on les claus son les categories d'alimentacio i el preu es el total gastat desde sempre
#   {"1": 598.31, "2": 399.44, "3": 460.55, "4": 240.0, ... , "13" : 32.3}
def obtenirGastPerCategoria_GLOBAL(id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()

    pipeline = [
        {"$match": {"idUsuari": id_usuari}},
        {"$project": {
            "productes": {"$objectToArray": "$productesAdquirits"}
        }},
        {"$unwind": "$productes"},
        {"$group": {
            "_id": "$productes.v.categoria",
            "totalGastat": {"$sum": "$productes.v.import"}
        }},
        {"$sort": {"_id": 1}}  # Ordena per categoria ascendent (opcional)
    ]

    resultats = colTickets.aggregate(pipeline)

    # Convertim a dict {categoria: total}
    gast_per_categoria = {doc["_id"]: doc["totalGastat"] for doc in resultats}

    # Assegurar que hi ha totes les categories de l'1 al 13 (amb 0 si no hi ha dades)
    for cat in range(1, 14):
        if cat not in gast_per_categoria:
            gast_per_categoria[cat] = 0.0

    return gast_per_categoria




def producteEsGranel(nomProducte, idUsuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()
    pipeline = [
        # Filtrar por usuario
        {"$match": {"idUsuari": idUsuari}},
        
        # Pasar productesAdquirits a array clave-valor
        {
            "$project": {
                "productes": {"$objectToArray": "$productesAdquirits"}
            }
        },
        
        # Filtrar el producto exacto con esGranel = True
        {
            "$match": {
                "productes": {
                    "$elemMatch": {
                        "k": nomProducte
                    }
                }
            }
        },
        
        # Nos quedamos solo con el primer resultado
        {"$limit": 1}
    ]

    resultat = list(colTickets.aggregate(pipeline))
    
    if not resultat:
        return None  # No encontrado
    
    # Buscar dentro del primer ticket si esGranel es True
    for prod in resultat[0]["productes"]:
        if prod["k"] == nomProducte:
            return prod["v"].get("esGranel", False)
    
    return None


#PRE: un id_usuari (enter)
#POST: obtindrem una llista de diccionaris on cada diccionari és un ticket
#  de mongoDB amb tota la seva informació interna i els tickets estan ordenats de més 
# recent a mes antic. Estil:

"""
[
        {
            "_id": "3960-024-550481_OP341937",
            "idUsuari": 2,
            "productesAdquirits": {
                "RODANXA DE SALMÓ": {
                    "esGranel": false,
                    "preuUnitari": 7.28,
                    "quantitat": 1,
                    "categoria": 7,
                    "import": 7.28
                },
                "PORROS": {
                    "esGranel": false,
                    "preuUnitari": 3.04,
                    "quantitat": 1,
                    "categoria": 1,
                    "import": 3.04
                },
            "totalTicket": 13.71,
            "direccioSuper": "C/ NOGUERA PALLARESA 12 25600 BALAGUER",
            "data": "2025-09-25",
            "hora": "15:23"
        },
        {
            "_id": "3960-011-284751_OP364104",
            "idUsuari": 2,
            "productesAdquirits": {
                "BOSSA PLÀSTIC": {
                    "esGranel": false,
                    "preuUnitari": 0.15,
                    "quantitat": 1,
                    "categoria": 13,
                    "import": 0.15
                },
                "BRONCHALES 6X1,5L": {
                    "esGranel": false,
                    "preuUnitari": 2.22,
                    "quantitat": 1,
                    "categoria": 4,
                    "import": 2.22
                },
            },
            "totalTicket": 27.4,
            "direccioSuper": "C/ NOGUERA PALLARESA 12 25600 BALAGUER",
            "data": "2025-09-24",
            "hora": "20:07"
        }
    ]


"""
def obtinguesTickets(id_usuari):
    colTickets = creaConexioAmongoDB_i_tornaTickets()
    pipeline = [
        {"$match": {"idUsuari": id_usuari}},
        {"$sort": {"data": -1, "hora": -1}}  # -1 = descendent, 1 = ascendent ORDENEM DE MÉS NOU A MÉS ANTIC
    ]
    return list(colTickets.aggregate(pipeline))
    
if __name__ == "__main__":


    print(obtinguesTickets(2))

    #print(obtenir_tickets_per_usuari(2))
    #print(frequencia_productes_per_usuari(2)[0])


    import json

    """
    dictTickets = frequencia_productes_per_usuari(2)
    print(json.dumps(dictTickets, indent=4, ensure_ascii=False))
    """

    """
    dictGraficPerUnProducte = obtinguesArrayDeParellsDataPreuUnitari("POLLO ENTERO LIMPIO",2)
    print(json.dumps(dictGraficPerUnProducte, indent=4, ensure_ascii=False))
    """


    #diccCategoriaGasto = obtenirGastPerCategoria_GLOBAL(2)
    #print(json.dumps(diccCategoriaGasto, indent=4, ensure_ascii=False))



    



















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
