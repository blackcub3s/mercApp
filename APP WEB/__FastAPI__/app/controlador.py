from fastapi import FastAPI, UploadFile, File, Depends, Body, HTTPException, status
from fastapi import Header # per poder processar les headers i agafar el token fix
from fastapi.middleware.cors import CORSMiddleware #Cal importar-ho per permetre el CORS des del navegador (que corre en port diferent)
import os
from jwtUtil import verificar_token, permetSolicitudsEntrantsNomesA
import serveiTickets
import serveiValidacions
import serveiClient
import serveiAnalisisPersistents

app = FastAPI()


# CONFIGURO AQUÍ LA POLÍTICA CORS
# (PERMETO ELS ORIGENS DELS QUE FAREM PETICIONS)
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://127.0.0.1:5500", #permetre crides del client DEL FRONTEND (live server o nginx de docker, corrent al 5500)
		"http://localhost:5500", # idem (pero especifico localhost)
		"http://localhost:8080", #permetre crides del BACKEND DE SPRING BOOT (PER SI FEM CRIDES COM UN CLIENT, AMB RESTCLIENT)
        "http://127.0.0.1:8080", # idem (pero epsecifico localhost)
	],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"], #permetre tokens acces per header (ja anava bé però per si de cas)
)



#Endpoint que en cridar-lo permet pujar PDFs a través del body de la solicitud
#IMPORTANT: requereix token valid, no caducat i amb permisos a 0 (convidat) o 2 (admin) i que els PDF tinguin
# un tamany determinat comprès entre KB_MINIM_TICKET_DIGITAL i KB_MAXIM_TICKET_DIGITAL.
#NOTA: no deixem pujar amb usuari a permisos 1 perque ja si té permisos a 1 és que ja té tickets pujats a mongoDB i no cal pujar més pdfs.
@app.post("/api/subir-tickets-pdf")                                 
async def pujarPdfsTicketDigital(
    arxius: list[UploadFile] = File(...),           # File(...) diu que ha d'entrar dades de multipart/form-data com els navegadors ho pujen.
    payload_token: dict = Depends(verificar_token)  # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
):  
    
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([0,2], permisos_enToken)
    
    llJudicis = [] #passem per referència la llista en la crida de la funció del servei (que s'emplenarà)
    nRefusats = await serveiTickets.guardaTicketsAsistemaDarxius(llJudicis, idUsuari_enToken, arxius) #self explanatory
    
    return {
                "subidos" : len(llJudicis) - nRefusats, 
                "rechazados" : nRefusats, 
                "existentes" : serveiValidacions.mostraTicketsExistentsDinsCarpetaUsuari(idUsuari_enToken),
                "estadosArchivos" : llJudicis
            }




#PRE: un token d'accés amb idUsuari i permisos a 0 o 2.
#POST: Si el token d'accés té els permisos a 0 o 2 retornarà el nombre de PDFs que té pujats dins 
#      el sistema d'arxius en la ruta tickets --> idUsuari amb el seguent format JSON:
#
#           {"existentes", n}    on      n és un nombre enter (0, 1, 2...)
@app.get("/api/conta-pdfs-servidor")                                 
async def contaPDFsPujatsAservidor(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([0,2], permisos_enToken)
    
    return { "existentes" : serveiValidacions.mostraTicketsExistentsDinsCarpetaUsuari(idUsuari_enToken)}



#PERMETO usuaris amb [permisos a (0)] --> no tenen tickets a mongoDB (els del pas4), però SÍ poden tenir PDFs pujats al sistema d'arxius
#                    [permisos a (2)] --> son admins i poden fer el que volen.
#NO PERMETO usuaris 
#                    [permisos a (1)] --> JA tenen tickets pujats a mongoDB. No els donarem PER ARA possibilitat de pujar més tickets.
@app.post("/api/parsea-y-guarda-pdfs-en-bbdd")                                 
async def pujarPdfsTicketDigital(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([0,2], permisos_enToken)
    
    totTicketOK, llErrors, nTicketsBenParsejats, nTicketsPersistits = serveiTickets.parsejaTicketsIguardaEnMONGODB(idUsuari_enToken) #hauria de se asincrono? 
    
    #AQUESTES 2 LINIES SERAN NOMES PER AL DEBUGGING MENTRE NO HEM PERSISTIT A MONGO ENCARA
    #nTicketsPersistits = nTicketsBenParsejats  # per a fer tests (borra, testejat)--> CAL QUE SIGUI MINIM 2 PERQUE EN CLICAR A ENGRANATGE MOSTRI TOKEN
    #totTicketOK = False     # per afer tests (borra, testejat)--> si totTicketOK es true el front farà una espera menor al pasar al dashboard (no hi haura errors a mostrar)
    #FI LINIES DEBUGING MENTRE NO HAGUEM PERSISTIT A MONGO ENCARA

    # Hem de posar await perquè espera el resultat de una crida POST a SpringBoot:
    nouTokenAccesPermisosA1 = await serveiClient.expedeixTokenPerAdashboard_SI_SESCAU(nTicketsPersistits, idUsuari_enToken, permisos_enToken)
    
    return {
        "nTicketsExistents" : serveiValidacions.mostraTicketsExistentsDinsCarpetaUsuari(idUsuari_enToken), #enter
        "totsParsejatsIguardatsBe" : totTicketOK,       #booleà
        "nTicketsBenParsejats" : nTicketsBenParsejats,  #enter
        "nTicketsPersistits" : nTicketsPersistits,      #enter
        "nouTokenAccesPermisosA1" : nouTokenAccesPermisosA1,
        "llErrors" : llErrors                           #llista de dicccionaris
        }




#PRE: un token d'accés amb idUsuari i permisos a 1 (els que tenen acces al dashboard)
#POST: Si el token d'accés té els permisos a 1 retornarà les dades en format diccionari
#     ex --> {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}
@app.get("/api/frequenciesProductes")                                 
async def obtinguesProductesOrdenatsPerOcurrencia(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([1], permisos_enToken)
    
    return serveiTickets.frequenciesProductes(idUsuari_enToken)



#PRECONDICIÓ: un token d'accés amb idUsuari i permisos a 1 (els que tenen acces al dashboard). i un diccionari amb el nom d'un producte entrant pel body:
#      {"nomProducte": "POLLO ENTERO LIMPIO"}
#-----------------------------------------------------------------------
#POSTCONDICIÓ: Si el token d'accés té els permisos a 1 retornarà les dades en format diccionari, ideal per fer gràfic d'inflació.
#       [{"x": "2024-05-30","y": 5.81},{"x": "2024-07-17","y": 5.97},{"x": "2024-09-09","y": 5.72}, ..., {"x": "2025-05-27","y": 6.35}]  
@app.post("/api/graficDataPreuProducte")                                 
async def obtinguesPuntsGraficXY(payload_token: dict = Depends(verificar_token), dictNomProducte: dict = Body(...)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([1], permisos_enToken)
    
    nomProducte = dictNomProducte["nomProducte"]
    return serveiTickets.parellDataPreuUnitari(nomProducte, idUsuari_enToken)




#PRECONDICIÓ: un token d'accés amb idUsuari i permisos a 1 (els que tenen acces al dashboard).
#POSTCONDICIÓ: obtindrem un diccionari on les claus son les categories d'alimentacio i el preu es el total gastat des del principi
#       {"1": 598.31, "2": 399.44, "3": 460.55, "4": 240.0, ... , "13" : 32.3}
@app.get("/api/gastosPerCategoria")                                 
async def mostraGastosPerCategoria(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([1], permisos_enToken)
    
    return serveiTickets.obtenirGastPerCategoria_GLOBAL(idUsuari_enToken)



@app.get("/api/categoriaAmbMesGasto")                                 
async def trobaCategoriaOnMesShaGastat(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([1], permisos_enToken)

    return {"categoriaMaximoGasto" : serveiTickets.obtenirIndexCategoria_ONMESSHAGASTAT(idUsuari_enToken)} #retorno index de la categoria on l'usuari ha gastat més calers

    
    
@app.get("/api/calculaPujadesBaixadesEnProductes")                                 
async def calculaPorductesPujatsBaixatsPerUsuari(payload_token: dict = Depends(verificar_token)):   # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")
    permetSolicitudsEntrantsNomesA([1], permisos_enToken)
    
    return serveiAnalisisPersistents.pujenMantenenBaixen(idUsuari_enToken) #pujen, mantenen, baixen

    



"""

#ENDPOINTS PROVA RESTCLIENT
@app.get("/api/usuari/{id}")
def mostraUsuari(id):        # id es enter (pots tipar-lo si vols)
    return {"dadesUsuari" : "les dades de l'usuari "+str(id)+" ASD."}



@app.get("/api/usuariSegur/{id}")
def mostraUsuariSegur(id, Authorization: str = Header(...)): #FORÇO A LLEGIR UN TOKEN D'ACCES.
    
    return {
        "dadesUsuari" : "les dades de l'usuari "+str(id),
        "authToken": Authorization
    }
#FI ENDPOINTS PROVAR RESTCLIENT --------------------



@app.get("/api/usuari/{id}/tickets")
def mostraUsuariSegur(id, Authorization: str = Header(...)): #FORÇO A LLEGIR UN TOKEN D'ACCES.
    llTickets = servei.mostraLlistaTickets()
    d = {
        "authToken": Authorization,
        "llTickets" : llTickets
    }
    return d


"""