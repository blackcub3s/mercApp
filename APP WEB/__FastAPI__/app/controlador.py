from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi import Header # per poder processar les headers i agafar el token fix
from fastapi.middleware.cors import CORSMiddleware #Cal importar-ho per permetre el CORS des del navegador (que corre en port diferent)
import os
from jwtUtil import verificar_token, permetSolicitudsEntrantsNomesA
import serveiTickets
import serveiValidacions



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
    totTicketOK, llJudicis, nTicketsBenParsejats = serveiTickets.parsejaTicketsIguardaEnMONGODB() #hauria de se asincrono?
    return {
        "existentes" : serveiValidacions.mostraTicketsExistentsDinsCarpetaUsuari(idUsuari_enToken),
        "processatsCorrectament" : totTicketOK,
        "ticketsBenParsejatsIpersistits" : nTicketsBenParsejats,
        "llJudicis" : llJudicis
        }












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