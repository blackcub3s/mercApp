from fastapi import FastAPI
from fastapi import Header # per poder processar les headers i agafar el token fix

app = FastAPI()

# fes ullada a 
# https://fastapi.tiangolo.com/#run-it

@app.get("/api/usuari/{id}")
def mostraUsuari(id):        # id es enter (pots tipar-lo si vols)
    return {"dadesUsuari" : "les dades de l'usuari "+str(id)+" ASD."}



@app.get("/api/usuariSegur/{id}")
def mostraUsuariSegur(id, Authorization: str = Header(...)): #FORÇO A LLEGIR UN TOKEN D'ACCES.
    
    return {
        "dadesUsuari" : "les dades de l'usuari "+str(id),
        "authToken": Authorization
    }