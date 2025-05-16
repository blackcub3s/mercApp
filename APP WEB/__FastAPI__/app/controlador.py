from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi import Header # per poder processar les headers i agafar el token fix
import os
from jwtUtil import verificar_token
import servei




app = FastAPI()

# fes ullada a 
# https://fastapi.tiangolo.com/#run-it

# ENDPOINTS PROVA RESTCLIENT --------------------
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





#Endpoint que en cridar-lo permet pujar PDFs a través del body de la solicitud
#IMPORTANT: requereix token valid, no caducat i amb permisos a 0 (convidat) o 2 (admin). 
#Per ara no deixa al usuario permisos a 1 perque ja tenen tickets pujats a mongoDB.
@app.post("/api/subir-tickets-pdf")                                 
async def pujarPdfsTicketDigital(
    arxius: list[UploadFile] = File(...),           # File(...) diu que ha d'entrar dades de multipart/form-data com els navegadors ho pujen.
    payload_token: dict = Depends(verificar_token)  # Valida el jwt amb la funcio verificar_token de jwtUtil.py (tant integritat secret com expired at) i n'agrafa el seu return.
):  
    
    permisos_enToken = payload_token.get("permisos", "clauDesconeguda")
    idUsuari_enToken = payload_token.get("idUsuari", "clauDesconeguda")

    
    #en aquest controlador permeto usuaris amb [permisos a (0)] --> no tenen tickets a mongoDB (els del pas4).
    #                                          [permisos a (2)] --> son admins i poden fer el que volen.
    #        NO PERMETO USUARIS AMB            [permisos a (1)] --> JA tenen tickets pujats a mongoDB. No els donarem PER ARA possibilitat de pujar més tickets.
    permisosPermesos = [0,2] 
    if permisos_enToken not in permisosPermesos:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Els permisos permesos son només: {permisosPermesos}"
        )


    llJudicis = []
    for arxiu in arxius:

        #AVALUA EL TIPUS MIME (BUSCO application/pdf)
        if arxiu.content_type != "application/pdf": 
            llJudicis.append({"archivo": arxiu.filename, "estado" : "No es un PDF" })
        else:
            #Guardo arxiu dins el servidor de fastAPI
            arxiuBinari = await arxiu.read() #tipus bytes
            nomArxiu = os.path.basename(arxiu.filename)

            #Creo directori tickets si no existeix i trec el path
            directoriOnGuardar = f"./tickets/{idUsuari_enToken}"
            os.makedirs(directoriOnGuardar, exist_ok=True)
            path = os.path.join(directoriOnGuardar, nomArxiu) 
            
            #creo l'arxiu
            with open(path, "wb") as f: #wb de write binary
                f.write(arxiuBinari)

            llJudicis.append({"archivo": nomArxiu, "estado": "Guardado correctamente"})

    return {"estadosArchivos" : llJudicis}
