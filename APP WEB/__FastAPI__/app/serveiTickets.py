#!/usr/bin/python3

from datetime import datetime
import os
import PyPDF2
import pytz
from serveiValidacions import ticketValidat

        
        
#PRE: - llJudicis: una llista buida (passada per referència)
#     - idUusari_enToken: un int que conté l'idUsuari obtingut del payload del token entrant.
#     - arxius: una llista (list) que conté dades de tipus UploadFile
#POST: 
#     - llJudicis: passa per referència i s'emplena d'una llista de diccionaris (rollo JSON) que 
#                  conté claus archivo, estado y tamany de cada arxiu
#      - nRefusats: conté el nombre de tickets que no s'han guardat al servidor perquè o bé no compleixen el tamany o bé
#                   no compleixen el títol que requereix la funció de validació ticketValidat() cridada.
# --------------------------------------------------------------
#        EXEMPLE llJudicis --> {"archivo": "20231004 Mercadona 27,40 €.pdf", "estado": "Guardado correctamente", "tamany": 35.7}
async def guardaTicketsAsistemaDarxius(llJudicis, idUsuari_enToken, arxius):
    
    KB_MAXIM_TICKET_DIGITAL = 80 # empiricament el 2023 els tickets de mercadona pesaven 36KB
    KB_MINIM_TICKET_DIGITAL = 15 # empiricament al 2025 els tickets pesaven 33KB (deixem marge)
    
    nRefusats = 0
    for arxiu in arxius:

        #AVALUA EL TIPUS MIME (BUSCO application/pdf)
        if arxiu.content_type != "application/pdf": 
            llJudicis.append({"archivo": arxiu.filename, "estado" : "No guardado! No es un PDF" })
            nRefusats += 1 
        
        else:
            # COMPROVEM EL TAMANY ABANS DE LLEGIR L'ARXIU EN MEMOÒRIA EN EL SERVIDOR
            # l'atribut built-in de l'objecte UploadFile, .size,conté el tamany en bytes sense necessitat de llegir tot l'arxiu en memoria.
            # evitem que algu ens puji un fitxer molt gran i ens peti el servidor.     
            #        
            tamanyFitxerKB = round(arxiu.size/1024, 1) # com que arxiu.size és un enter que torna el nombre de bytes que ocupa l'arxiu i el puc passar a KB.
            nomArxiu = os.path.basename(arxiu.filename)

            # --- SI I NO MÉS SI EL TAMANY DE FITXER ES CORRECTE EL FEM LLEGIR TOT I, ALESHORES SÍ, EL GUARDEM A LA CARPETA DEL SERVIDOR --
            # NOTEU que python admet la sintaxi matemàtica de l'estil A <= B <= C. Ho podriem haver escrit també
            # (A <= B) and (B <= C), que seria el que en altres llenguatges com Java o Javascript és (A <= B) && (B <= C) 
            if KB_MINIM_TICKET_DIGITAL <= tamanyFitxerKB <= KB_MAXIM_TICKET_DIGITAL:
                #Comprovo si el nom de l'arxiu és el que m'espero en un ticket de Mercadona
                if ticketValidat(nomArxiu):
                    #Ara sí que llegeixo en memoria tot l'arxiu dins el servidor-
                    #await arxiu.read() funciona b per a pdfs petits (menys de 80 kb). arxiuBinari es tipus bytes.
                    arxiuBinari = await arxiu.read() #ARA SÍ QUE LLEGEIXO EN MEMORIA TOT L'ARXIU

                    #creo directori tickets si no existeix i trec el path
                    directoriOnGuardar = f"./tickets/{idUsuari_enToken}"
                    os.makedirs(directoriOnGuardar, exist_ok=True)
                    path = os.path.join(directoriOnGuardar, nomArxiu) 

                    #creo l'arxiu en mode d'escriptura (w) amb la b de binari i guardo dins l'arxiu binari
                    with open(path, "wb") as f: 
                        f.write(arxiuBinari)

                    llJudicis.append({"archivo": nomArxiu, "estado": "Guardado correctamente", "tamany" : tamanyFitxerKB})
                else:
                    nRefusats += 1 #si nom no és correcte conto que és ticket refusat
                    llJudicis.append({"archivo": nomArxiu, "estado": "Archivo rechazado y no guardado (NOMBRE incorrecto)!", "tamany" : tamanyFitxerKB})
            else:
                nRefusats += 1 #si tamany no és correcte conto que és ticket refusat
                llJudicis.append({"archivo": nomArxiu, "estado": "Archivo rechazado y no guardado (tamaño incorrecto!)", "tamany" : tamanyFitxerKB})
    return nRefusats









# COMPUTO L'HORA A ESPANYA (EL CONTENIDOR TÉ UNA HORA DIFERENT) i l'imprimeixo per pantalla. IIndispensable usar pytz
def imprimeix_hora_espanyola():
    current_time = str(datetime.now(pytz.timezone("Europe/Madrid")))  #per escollir timezone fas pytz.all_timezones
    dia, hora = current_time.split()
    dia, hora = dia.split("-"), hora.split(":")
    dia.reverse()

    missatge = "execució script --> [ "+dia[0]+"/"+dia[1]+"/"+dia[2]+" || "+hora[0]+":"+hora[1]+"h ]"
    print(missatge)

#PRE: una llista de paths de pdfs
#POST: pdfs esborrats de la carpeta (testejar encara!!)
def esborra_pdfs(ll, carregatPdfs):
    if carregatPdfs:
        for pdf in ll:
            os.remove(pdf)

#FUNCIO FETA PER XAT GPT
def pdf_to_text(file_path):
    try:
        text = ""
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n"
        return text
    except PyPDF2.errors.PdfReadError:
        return "errorPdfAtext"


# PRE: doc es el document (PATH O NOM?)
#      tupla es nom del pdf a cercar. Els pdfs de la tupla han d'existir al directori on s'executa el programa.
# POST: S'imprimeix cada linia que té una ocurrència de qualsevol dels elements
#      (especialitats) de ll_esp (llista especialitats)-
def fesScrapTicketMercadona(doc, ll_judicis, nTicketsBenParsejats):
    textPDF = pdf_to_text(doc) 
    if textPDF == "errorPdfAtext":
        ll_judicis.append({"archivo": doc, "estado": "Parseo función pdf_to_text falló."})
        print(f"\tError parseig: ${doc}")       
    else:
        ll_linies_PDF = textPDF.split("\n")
        for i in range(len(ll_linies_PDF)):
            print(ll_linies_PDF[i]) # BRUTAL FUNCIONA!!!!
            

        jsonTicket = {"to do" : "per a fer posar aqui la estructura mongo"}
        nTicketsBenParsejats += 1
        ll_judicis.append({"archivo": doc, "estado": "Parseo OK."})


    return nTicketsBenParsejats, jsonTicket



#PRE:  idUsuari_enToken (int) --> porta l'usuari que te tickets digitals creats en el sistema d'arxius.
#POST: totTicketOk (booleà) --> Si tots els tickets de la carpeta d'usuari s'han parsejat i guardat b en BBDD
#      llJudicis (llista de dicts) --> llista informativa de l'estat dels tickets [{"archivo": "ticket mercadona.pdf", "estado" : "parseo ok"}, [...] ] 
def parsejaTicketsIguardaEnMONGODB(idUsuari_enToken):
    totTicketOK = True
    nTicketsBenParsejats = 0
    llJudicis = []
    directoriOnLlegir = f"./tickets/{idUsuari_enToken}"
    try:
        llistTickets = os.listdir(directoriOnLlegir)
        for nomArxiu in llistTickets:
            path = os.path.join(directoriOnLlegir, nomArxiu) 
            nTicketsBenParsejats, jsonTicket = fesScrapTicketMercadona(path, llJudicis, nTicketsBenParsejats) #llJudicis passada per refernecia
            #aqui guarda a mongo db el jsonTicket
            
            totTicketOk = False  #aquo posa totTicketOK a false si nalgun ticket no es parseja b o be no es guarda b a mongo
        return totTicketOK, llJudicis, nTicketsBenParsejats
    
    except FileNotFoundError:
        print("Ruta no trobada! Aquest error no es donarà mai si s'activa aquest afunció des de crida a /api/parsea-y-guarda-pdfs-en-bbdd")
    





    # FI TESTEJA

    return totTicketOK, llJudicis, nTicketsBenParsejats #mantenir noms de variables  #NOTA: si vols comensar afegir nTicketsBenGuardats (si s escau i posarho a tot arreu)


if __name__ == "__main__":
    #MOSTRO L'HORA EN QUE S'HA EXECUTAT L'SCRIPT
    imprimeix_hora_espanyola()

    #LLISTA DE TUPLES (nom amb que guardaré el document, url d'on fem scrap del document)
    document = "20240124 Mercadona 5,48 €"


    #fesScrapTicketMercadona(document)
    #esborra_pdfs(llista_documents,True); #per evitar vestigis me'ls carrego un cop llegits (Si es true, si es false no fa res)
    
    parsejaTicketsIguardaEnMONGODB("27")

















def mostraLlistaTickets():
    return ["tiket1","tiket2","tiket3","tiket4"]

