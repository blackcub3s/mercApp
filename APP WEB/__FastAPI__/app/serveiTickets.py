#!/usr/bin/python3

from datetime import datetime
import os
import PyPDF2
import pytz
from serveiValidacions import ticketValidat
import repositoriTickets
import json
        
#PRE: - llJudicis: una llista buida (passada per referència)
#     - idUsuari_enToken: un int que conté l'idUsuari obtingut del payload del token entrant.
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


# PRE: -doc:                  es un string amb el path al nom del ticket en pdf que vull processar 
#                             aspecte com aquest --> ./tickets/{idUsuari_enToken}/{nom arxiu}
#      -ll_judicis:           lista buida o amb els judicis d'anteriors iteracions de tickets parsejats (errors o exits)
#      -nTicketsBenParsejats: variable d'entrada amb del nombre actual de nombre de
#                             tickets parsejats anteriorment abans que el ticket actual
# POST: 
#      -nTicketsBenParsejats: mateixa variable que l'entrada + 1 si s'ha parsejat correctament 
#                             el ticket de l'iteració actual. O variable inalterada, altrament.
#      -jsonTicket:           el ticket amb PDF parsejat a format JSON llest per guardar a MongoDB si ha corregut bé.
#                             en cas contrari, si s'arriba a llençar una excepcií, tornarà un diccionari {} BUIT!!!
#      format de jsonTicket serà de l'estil:
def fesScrapTicketMercadona(doc, ll_judicis, nTicketsBenParsejats):
    textPDF = pdf_to_text(doc) 
    if textPDF == "errorPdfAtext":
        ll_judicis.append({"archivo": doc, "estado": "Parseo del ticket con pdf_to_text() falló."})
        return {}    
    else:
        
        # AQUESTES LINIES COMENTADES FOREN LA PRIMERA APROXIMACIÓ DEL PROBLEMA
        """
        ll_linies_PDF = textPDF.split("TOTAL (€)")
        for i in range(len(ll_linies_PDF)):
            print(ll_linies_PDF[i])
        """
        # POSAR INICI TRY --- AQUI EXTRAUREM LES DADES
        # LES LÍNIES COMENTADES SÓN LA PRIMERA APROXIMACIÓ AL PROBLEMA D'EXTRACCIÓ
        try:
            
            # SEPAREM el ticket en DUES MEITATS (superior i inferior). Això ho fem gràcies
            # a un DELIMITADOR que sempre trobem just a SOTA del llistat de productes del ticket.
            separacioTicketPerTOTAL = textPDF.split("TOTAL (€)") 
        
            # La meitat superior del ticket (separacioTicketPerTOTAL[0]) la guardem tota, trocejada 
            # per salts de línia en una llista (ll_liniesTicket). De la meitat inferior (separacioTicketPerTOTAL[1])
            # només n'extraurem l'import total de la factura -ticket- mitjançant "slicing" i el guardarem en('preuTotalTicket') 
            # canviant , per . i passant a float.
            ll_liniesTicket = separacioTicketPerTOTAL[0].split("\n")
            preuTotalTicket = float(separacioTicketPerTOTAL[1][:separacioTicketPerTOTAL[1].index("\n")].strip().replace(",","."))

            # 2A I 3A LINIES DEL TICKET BÀSICAMENT SÓN CARRER I CODI POSTAL
            carrer, CP_ciutat = ll_liniesTicket[1], ll_liniesTicket[2]
            direccioSuper = carrer + " " + CP_ciutat
            
            #SEGONA APROXIMACIÓ AL PROBLEMA
            for i in range(len(ll_liniesTicket)):
                print(ll_liniesTicket[i])
            print("\n")
            # FI SEGONA APROXIMACIÓ AL PROBLEMA
            diccProductes = {}
            """
            for producte in liniesProductes:
                diccProductes["BRONCHALES 6L"] = {
                    "esGranel": 999,  # exemple --> 0 (no granel) o 1 (sí és granel)
                    "preu": 1.28,     # exemple --> Si no granel indica €/unitat. Si sí granel, indica €/kg --> 1.28, 0.76...
                    "quantitat": 1,   # exemple --> 1, 2, 3... n (unitats comprades)
                    "categoria": 2    # exemple --> 1 fins a 13 (diccionari de categories mapejat aqui)
                } 
            """
            jsonTicket = {
                "_id": "2424-022-580814_OP3844401",  # exemple --> "2424-022-580814_OP3844401" concatenant el amb numero d'operacio
                "idUsuari": 10,                      # exemple --> 10
                "productesAdquirits": diccProductes, # exemple --> un diccionari de rpoductes, on cada item es un diccionari de l'estil que es veu a abans.
                "totalTicket": preuTotalTicket,
                "direccioSuper": direccioSuper,      #exemple --> "C/ VALENCIA, 46006 VALENCIA"
                "data": "2089-12-07"                 #exemple
            }
            

            #print(jsonTicket) 
            #print(json.dumps(jsonTicket, indent=4, ensure_ascii=False))




            nTicketsBenParsejats += 1 #sumo un tiket ben parsejat!
        except IndexError as e:
            ll_judicis.append({
                "archivo": doc, "estado": f"Error 'IndexError: {str(e)}' encontrado durante el parseo: | Pista: Probablemente no se encontró el grupo Total(€) en el lugar correcto en este ticket."
            })
        """
        except ValueError as e:
            ll_judicis.append({
                "archivo": doc, "estado": f"Error 'ValueError: {str(e)}' encontrado durante el parseo: | Pista: ??."
            })    
        """        
            
        
        
        # POSAR FI TRY

        # POSAR EXCEPT --> RETORNAR AQUI UN DICCIONARI BUIT quan hi hagi EXCEPT, MOLT IMPORTANT!
    jsonTicket = {}
    return nTicketsBenParsejats, jsonTicket



#PRE: - idUsuari_enToken (int) -> id d'usuari que té JA tickets digitals en PDF creats dins 
#                                 el sistema d'arxius en ruta tickets/{idUsuari_enToken}
#POST: - totTicketOk (booleà) --> Si tots els tickets de la carpeta d'usuari s'han parsejat i guardat b en BBDD
#      - llJudicis (llista) ----> llista informativa de diccionaris ambde l'estat dels tickets 
#                                 [{"archivo": "ticket mercadona.pdf", "estado" : "parseo ok"}, [...] ] 
#      - totTicketOK -----------> si coincideix el nre de tickets trobats en el sistema d'arxius 
#                                 en ruta tickets/{idUsuari_enToken} amb nTicketsBenParsejats i amb nTicketsPersistits 
#                                 és que tots els tickets s'han analitzat bé.
#      - nTicketsBenParsejats --> nombre de tickets correctament extrets (nombre de vegades en que la 
#                                 funcio fesScrapTicketMercadona() ha corregut correctament)
#      - nTicketsPersistits ----> nombre de tickets que s'han guardat (nombre de vegades que funcio de 
#                               repositori persisteixTicket_a_MONGODB() s'executa correctament)
def parsejaTicketsIguardaEnMONGODB(idUsuari_enToken):
    nTicketsBenParsejats = 0
    nTicketsPersistits = 0
    llJudicis = []
    directoriOnLlegir = f"./tickets/{idUsuari_enToken}"
    try:
        llistTickets = os.listdir(directoriOnLlegir)
        
        for nomArxiu in llistTickets:
            path = os.path.join(directoriOnLlegir, nomArxiu) 

            # -- TO DO interiors de les dues funcions --
            

            #PRIMER EXTREC TICKET (A) && DESPRÉS EL PERSISTEIXO (B) --> INFORMO D'ERRORS DURANT TOT EL PROCÉS 
            # NOTA: funció fesScrapTicketMercadona s'hauria d'haver anomenat 
            # fesParseigTicketMercadona. No canviem el nom per consistència amb la memòria.
            nTicketsBenParsejats, jsonTicket = fesScrapTicketMercadona(path, llJudicis, nTicketsBenParsejats) #(A) llJudicis passada per referència
            nTicketsPersistits = repositoriTickets.persisteixTicket_a_MONGODB(nTicketsPersistits, jsonTicket) #(B)
            

            # -- FI TO DO interiors de les dues funcions --

        # tot s'ha processat b si el nombre de tickets dins el sistema d arxius de l'usuari en el servidor
        # coincideix amb el nombre de tickets correctament parsejats i tambe amb el de persistits. Aleshores tot el que 
        # ha enviat l'usuari dins el servidor en el PASO 2 s'ha aconsegit processar i persistir íntegrament en el PASO 3
        totTicketOK = len(llistTickets) == nTicketsBenParsejats == nTicketsPersistits 
        return totTicketOK, llJudicis, nTicketsBenParsejats, nTicketsPersistits
    
    except FileNotFoundError:
        print("Ruta no trobada! Aquest error no es donarà mai si s'activa aquest afunció des de crida a /api/parsea-y-guarda-pdfs-en-bbdd")
    

    


if __name__ == "__main__":
    #MOSTRO L'HORA EN QUE S'HA EXECUTAT L'SCRIPT
    imprimeix_hora_espanyola()

    #LLISTA DE TUPLES (nom amb que guardaré el document, url d'on fem scrap del document)
    document = "20250430 Mercadona 33,36 €"


    fesScrapTicketMercadona(f"./tickets/3/{document}.pdf", [], 0)
    #esborra_pdfs(llista_documents,True); #per evitar vestigis me'ls carrego un cop llegits (Si es true, si es false no fa res)
    
    #parsejaTicketsIguardaEnMONGODB("20250507 Mercadona 7,05 €")

















def mostraLlistaTickets():
    return ["tiket1","tiket2","tiket3","tiket4"]

