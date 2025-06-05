#!/usr/bin/python3

from datetime import datetime
import os
import PyPDF2
import pytz
from serveiValidacions import ticketValidat
import repositoriTickets
import json
import shutil
        
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

#PRE: string de forma "dd/mm/aaaa"
#POST: string de forma "AAAA-MM-DD", en la ISO 8601
def dataEspanyola_a_ISO8601(dataEspanyola):
    dia, mes, any = dataEspanyola.split("/")
    return f"{any}-{mes}-{dia}"

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


import re

#PRE: un string
#POST: true si i nomes si fa matx amb format d,dd (2,44 o 4,06).
def esUnPreu(s):
    return bool(re.fullmatch(r'\d,\d{2}', s))




# PRE: -doc:                  es un string amb el path al nom del ticket en pdf que vull processar 
#                             aspecte com aquest --> ./tickets/{idUsuari_enToken}/{nom arxiu}
#      -llErrors:             lista buida, si no hi ha errors; o amb els judicis d'anteriors iteracions de tickets parsejats (amb errors)
#      -nTicketsBenParsejats: variable d'entrada amb del nombre actual de nombre de
#                             tickets parsejats anteriorment abans que el ticket actual
#      -idUsuariEnToken:      l'identificador de l'usuari al que pertany el ticket.
# POST: 
#      -nTicketsBenParsejats: mateixa variable que l'entrada + 1 si s'ha parsejat correctament 
#                             el ticket de l'iteració actual. O variable inalterada, altrament.
#      -jsonTicket:           el ticket amb PDF parsejat a format JSON llest per guardar a MongoDB si ha corregut bé.
#                             en cas contrari, si s'arriba a llençar una excepcií, tornarà un diccionari {} BUIT!!!
#      format de jsonTicket serà de l'estil:
def fesScrapTicketMercadona(doc, llErrors, nTicketsBenParsejats, idUsuari_enToken):
    textPDF = pdf_to_text(doc) 
    if textPDF == "errorPdfAtext":
        llErrors.append({"archivo": doc, "estado": "Parseo del ticket con pdf_to_text() falló."})
        return {}    
    else:
        
        # PRIMERA APROXIMACIÓ DEL PROBLEMA. PODEU DESCOMENTAR-LES PER VEURE TOT EL QUE SURT DEL TICKET PER DAMUN DE "TOTAL (€)"
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
            ll_liniesTicket = separacioTicketPerTOTAL[0].split("\n")[:-1] #trec una linia buida vestigial al final
            preuTotalTicket = float(separacioTicketPerTOTAL[1][:separacioTicketPerTOTAL[1].index("\n")].strip().replace(",","."))

            # 2A I 3A LINIES DEL TICKET BÀSICAMENT SÓN CARRER I CODI POSTAL
            carrer, CP_ciutat = ll_liniesTicket[1], ll_liniesTicket[2]
            direccioSuper = carrer + " " + CP_ciutat
            
            # 4A I 5A LINES DEL TICKET --> ens permeten crear la clau primaria de cada ticket 
            #       combinant NRE factura amb OP. De la 4a extraiem data i hora també
            dataOperacio = ll_liniesTicket[4]   #string ------> "30/04/2025 21:14  OP: 4083409"
            liniaFactura = ll_liniesTicket[5]   #string ------> "FACTURA SIMPLIFICADA: 2423-026-567893"
            dataHora, nreOP = dataOperacio.split("OP:") # COMPTE --> A tickets de 2023 surt "OP:" i tickets de 2024 i 2025 "OP: " (amb un espai a la dreta)
            data, hora = dataHora.split() #dataHORA.split() --> ['30/04/2025', '21:14']  #LA HORA NO ES NECESSARIA PERÒ ENS LA GUARDEM :D
            data_ISO8601 = dataEspanyola_a_ISO8601(data) #faig conversió següent:  "30/04/2025" --> "2025-04-30"

            # CREEM UNA CLAU PRIMÀRIA PER TICKET QUE NO S'HAURIA DE REPETIR MAI
            nreFactura = liniaFactura.split("FACTURA SIMPLIFICADA:")[1].strip()     # 2423-026-567893
            nreOP = nreOP.strip()                                                   # 4083409
            clauPrimaria = nreFactura + "_OP" + nreOP                               # 2423-026-567893_OP4083409

            
            
            capsalTaulaProductes = ll_liniesTicket[6] #"Descripción P. Unit Importe"  o bé  "Descripció P. Unit Import" els dos FARAN MATCH :)
            if not "Descripció" in capsalTaulaProductes:
                raise ValueError("No se encontró la cabezera Descripció o Descripción en la séptima línea del ticket")
            
            taulaProductes = ll_liniesTicket[7:] # des de la línia 7 fins a l'últim producte
            
            #SEGONA APROXIMACIÓ AL PROBLEMA IMPRIMIM NOMÉS PRODUCTES DE CADA TICKET (AMB LA DATA PER IDENTIFICAR-LO)
            """
            print("\n"+data)
            for i in range(len(taulaProductes)):
                print(taulaProductes[i])
            print("\n")
            """
            #FI SEGONA APROXIMACIÓ AL PROBLEMA
            print("-------------\n"+data+"\n------------")
            i = 0
            diccProductes = {}
            while i < len(taulaProductes):
                liniaP = taulaProductes[i] #liniaProducte (una de les linies de la taula de productes que pots visualitzar descomentant les linies anteriors)
                
                #Si trobem el descompte del PÀRKING vuerem a la seguent linia "ENTRADA 12:37 SORTIDA 12:58" de una informació d'un pàrking
                # que es confondria amb la informació a granel donant indexerror (veure ticket 20241218 Mercadona 29,42 €). Per això ho saltem.
                
                if "PÀRQUING" in liniaP or "PARKING" in liniaP or "APARCAMIENTO" in liniaP:
                    i = i + 1
                elif esUnPreu(liniaP[-4:]):#Si els últims quatre caràcters de la linia son un preu (d,dd), aleshoes NO ES GRANEL.
                    #CAS PRODUCTES QUE NO SON A GRANEL AQUÍ
                    esGranel = False 

                    #la liniaP després de l'split    _______________________________________________
                    #és de   [2 tipus]  | -----------|-------------SPLIT DE LA LINIA ---------------|
                    #                   | (MULTIPLE) | ['212', 'OUS', 'GRANS', 'L', '2,28', '4,56']-|     compra de dos o més productes
                    #                   | (UNIC)     | ['1TOMÀQ.', 'PERA', 'TERRINA', '2,20'] ------|     compra d'un sol producte
                    #                     ----------------------------------------------------------|
                    #ll_liniaP es una llista de línia que inclou SEMPRE un producte que NO és a granel.
                    ll_liniaP = liniaP.split()
                    importProducte = float(ll_liniaP[-1].replace(",",".")) #import de producte sempre s'obte de l'últim element de la llista
                    
                    #miro si es tracta del cas (MULTIPLE) -compra de 2 o més productes o compra (UNICA) -una sola unitat de producte-
                    casCompra_MULTIPLE = esUnPreu(ll_liniaP[-2][-4:]) #
                    if casCompra_MULTIPLE:
                        #print("        ES MULTIPLE")
                        preuUnitari = float(ll_liniaP[-2].replace(",","."))
                        quantitat = round(importProducte/preuUnitari) #redondeig a enter mes proxim (per si tinguessim problemes de precissió amb coma flotant)
                        nreDigits_PerLesquerra_Aesborrar = len(str(quantitat))
                        nomProducte = " ".join(ll_liniaP[:-2])[nreDigits_PerLesquerra_Aesborrar:] #treieme els digits vestigials a partir del calcul de la longitud de nombre d'unitats
                        

                    else:
                        #print("        UNIC")
                        quantitat = 1
                        preuUnitari = importProducte
                        nomProducte =  " ".join(ll_liniaP[:-1])[1:]   #elimino últim element de la llista (import) ajunto els restants i trec el 1 vestigial del principi
                        

                    
                    diccProductes[nomProducte] = {
                        "esGranel": esGranel,        # exemple --> False (no granel) o True (sí és granel)
                        "preuUnitari": preuUnitari,  # exemple --> Si no ésgranel --> €/unitat | Si sí es granel --> €/kg --> 1.28, 0.76...
                        "quantitat": quantitat,      # exemple --> 1, 2, 3... n (unitats comprades si no es granel) o 0.33 kg (nombre de kilos, si SÍ es granel)
                        "categoria": 13,             # exemple --> 1 fins a 13 (diccionari de categories mapejat aqui)
                        "import" : importProducte    # NOVETAT! --> S'HA AFEGIT FINALMENT ---> Idem a preuUnitari * quantitat redondejat a 2 (s'ha guardat per comoditat en cerques posteriors)
                    } 
                    
                    #print("        ",diccProductes)
                    
                    #FI TO DO

                else:
                    #CAS PRODUCTES QUE SÍ SON A GRANEL AQUÍ!
                    esGranel = True

                    nomProducte = liniaP[1:].strip() #si és un producte granel, SEMPRE té una sola unitat. De l'estil "1PEBROT FREGIR" o "1CALABACIN BLANCO"
                    #print("prodGranel--> "+nomProducte)
                    i += 1 #vaig a la següent línia on hi ha dades del producte a granel
                    ll_Granel = taulaProductes[i].split() # 0,184 kg 2,39 €/kg 0,44 --> ['0,184', 'kg', '2,39', '€/kg', '0,44']
    
                    quantitat, preuUnitari, importProducte  = float(ll_Granel[0].replace(",",".")), float(ll_Granel[2].replace(",",".")), float(ll_Granel[4].replace(",","."))
                  
                       
                    #print("     "+str(ll_Granel))
                    diccProductes[nomProducte] = {
                        "esGranel": esGranel,        # exemple --> 0 (no granel) o 1 (sí és granel)
                        "preuUnitari": preuUnitari,  # exemple --> Si no ésgranel --> €/unitat | Si sí es granel --> €/kg --> 1.28, 0.76...
                        "quantitat": quantitat,      # exemple --> 1, 2, 3... n (unitats comprades si no es granel) o 0.33 kg (nombre de kilos, si SÍ es granel)
                        "categoria": 13,             # exemple --> 1 fins a 13 (diccionari de categories mapejat aqui)
                        "import" : importProducte    # NOVETAT! --> S'HA AFEGIT FINALMENT ---> Idem a preuUnitari * quantitat redondejat a 2 (s'ha guardat per comoditat en cerques posteriors)
                    } 
                    

                


                i = i + 1
            print("\n")
            
        
            jsonTicket = {
                "_id": clauPrimaria,  # exemple --> #2423-026-567893_OP4083409 concatenant el amb numero d'operacio
                "idUsuari": idUsuari_enToken,        # exemple --> 10
                "productesAdquirits": diccProductes, # exemple --> UN DICCIONARI DE DICCIONARIS DE PRODUCTES, RELLENAT EN EL FOR ANTERIOR.
                "totalTicket": preuTotalTicket,
                "direccioSuper": direccioSuper,      #exemple --> "C/ VALENCIA, 46006 VALENCIA"
                "data": data_ISO8601,                #exemple --> "YYYY-MM-DD" es la ISO 8601 (aixi chart.js ho llegeix directe)
                "hora" : hora                        #exemple --> "21:03"
            }
            

            #print(jsonTicket)
            #print(json.dumps(jsonTicket, indent=4, ensure_ascii=False))




            nTicketsBenParsejats += 1 #sumo un tiket ben parsejat!
        except ValueError as e:  #un split que no es pot fer, per exemple!
            llErrors.append({
                "archivo": doc, "estado": f"Error 'ValueError: {str(e)}' encontrado durante el parseo."
            })    
            jsonTicket = {}
        except IndexError as e:
            llErrors.append({
                "archivo": doc, "estado": f"Error 'IndexError: {str(e)}' encontrado durante el parseo.."
            })
            jsonTicket = {}
       
        
    #jsonTicket sempre sera un diccionari buit SI HI HA HAGUT ALGUN ERROR RECOLLIT EN EXCEPCIO O L'ERROR INICIAL DE NO LLEGIR PDF
    return nTicketsBenParsejats, jsonTicket



#PRE: - idUsuari_enToken (int) -> id d'usuari que té JA tickets digitals en PDF creats dins 
#                                 el sistema d'arxius en ruta tickets/{idUsuari_enToken}
#POST: - totTicketOk (booleà) --> Si tots els tickets de la carpeta d'usuari s'han parsejat i guardat b en BBDD
#      - llErrors (llista) ----> llista informativa de diccionaris ambde l'estat dels tickets que han fallat
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
    llErrors = []
    directoriOnLlegir = f"./tickets/{idUsuari_enToken}"
    try:
        llistTickets = os.listdir(directoriOnLlegir)
        
        for nomArxiu in llistTickets:
            path = os.path.join(directoriOnLlegir, nomArxiu) 

            # -- TO DO interiors de les dues funcions --
            

            #PRIMER EXTREC TICKET (A) && DESPRÉS EL PERSISTEIXO (B) --> INFORMO D'ERRORS DURANT TOT EL PROCÉS 
            # NOTA: funció fesScrapTicketMercadona s'hauria d'haver anomenat 
            # fesParseigTicketMercadona. No canviem el nom per consistència amb la memòria.
            nTicketsBenParsejats, jsonTicket = fesScrapTicketMercadona(path, llErrors, nTicketsBenParsejats, idUsuari_enToken) #(A) llErrors passada per referència
            nTicketsPersistits = repositoriTickets.persisteixTicket_a_MONGODB(nTicketsPersistits, jsonTicket) #(B) no es persistirà si jsonTicket no és buit {} (voldria dir no s'ha parsejat b)
            

            # -- FI TO DO interiors de les dues funcions --

        # tot s'ha processat b si el nombre de tickets dins el sistema d arxius de l'usuari en el servidor
        # coincideix amb el nombre de tickets correctament parsejats i tambe amb el de persistits. Aleshores tot el que 
        # ha enviat l'usuari dins el servidor en el PASO 2 s'ha aconsegit processar i persistir íntegrament en el PASO 3
        totTicketOK = len(llistTickets) == nTicketsBenParsejats == nTicketsPersistits 
        moureTicketsConflictiusPerRevisarlos(llErrors, idUsuari_enToken)
        return totTicketOK, llErrors, nTicketsBenParsejats, nTicketsPersistits
    
    except FileNotFoundError:
        print("Ruta no trobada! Aquest error no es donarà mai si s'activa aquest afunció des de crida a /api/parsea-y-guarda-pdfs-en-bbdd")
    

#PRE: una llista d'error que conté els tickets que han fallat i un id d'usuari.
#POST: els tickets es guarden DINS una carpeta al sistema d'arxius
#      del servidor perquè puguem revisar-los i millorar el codi un cop ja en producció.
#      la carpeta es /ticketsQueDonenError/{idUsuari_enToken__nomArxiu}
def moureTicketsConflictiusPerRevisarlos(llErrors,idUsuari_enToken):
    for error in llErrors:
        nomTicket = os.path.basename(error["archivo"])
        pathArxiu_CarpetaUsuari = f"./tickets/{idUsuari_enToken}/{nomTicket}" #ubicacio actual (dins carpeta de l'usuari que s'ha trobat l'error)
        pathArxiu_carpetaLogsNostra = f"./logTicketsConflictius/{str(idUsuari_enToken)}--{nomTicket}"  #ubicacio de la copia per a nosaltres (FUTURA)
        
        # Si no existeix, es crea la carpeta de destí
        os.makedirs("./logTicketsConflictius", exist_ok=True)
        try:
            shutil.copy2(pathArxiu_CarpetaUsuari, pathArxiu_carpetaLogsNostra) #copiem l'arxiu
        except Exception as e:
            print(f"Error copiant {nomTicket}: {e}")

        


if __name__ == "__main__":
    #MOSTRO L'HORA EN QUE S'HA EXECUTAT L'SCRIPT
    imprimeix_hora_espanyola()



    #PRENC EL TICKET MES CONFLICTIU DE MERCADONA (AL MENYS QUE HAGI TROBAT I EXECUTO EL PARSEJADOR)
    document = "20250430 Mercadona 33,36 €" #EL TICKET ULTRA CONFLICTIU.
    #fesScrapTicketMercadona(f"./tickets/3/{document}.pdf", [], 0, 3)

    proves = True
    idUsuari = 2
    if proves:
        #document = "20241218 Mercadona 29,42 €" #EL TICKET ULTRA CONFLICTIU.
        #print("---- EL DEL PARKING (solucionat)----")
        #fesScrapTicketMercadona(f"./tickets/{idUsuari}/{document}.pdf", [], 0, idUsuari)


        #document = "20240625 Mercadona 19,24 €" #EL TICKET DE LA DORADA (3 LINIES PER UN PRODUCTE A GRANEL)
        #print("---- UN DE LA DORADA (si hi ha error no sortira res) ----")
        #fesScrapTicketMercadona(f"./tickets/{idUsuari}/{document}.pdf", [], 0, idUsuari)

        document = "20250107 Mercadona 7,35 €" #EL TICKET ULTRA CONFLICTIU.
        print("---- EL DE 2 OUS DE 12 UNITATS ----")
        fesScrapTicketMercadona(f"./tickets/{idUsuari}/{document}.pdf", [], 0, idUsuari)
        

        document = "20250507 Mercadona 7,05 €"
        print("---- EL DE LA DEMO DE LA MEMORIA ----")
        fesScrapTicketMercadona(f"./tickets/{idUsuari}/{document}.pdf", [], 0, idUsuari)   
        
        
        #PARSEJO TOTS ELS TICKETS DE L'USUARI DE ID PASSAT PER PARAMETRE
        #parsejaTicketsIguardaEnMONGODB(3)
        document = "20250207 Mercadona 23,01 €"
        print("---- EL DE LA DEMO DEL BEAMER ----")
        fesScrapTicketMercadona(f"./tickets/{idUsuari}/{document}.pdf", [], 0, idUsuari)  


    #A FUTUR, ESBORAR PDFS (NO USAT)
    #esborra_pdfs(llista_documents,True); #per evitar vestigis me'ls carrego un cop llegits (Si es true, si es false no fa res)
    
    #parsejo i guardo tickets de dins la carpeta tickets/3:
    #parsejaTicketsIguardaEnMONGODB(3)
















def mostraLlistaTickets():
    return ["tiket1","tiket2","tiket3","tiket4"]

