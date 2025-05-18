#!/usr/bin/python3

from datetime import datetime
import os
import PyPDF2
import pytz



s = '' #on posaré l'string de la notificació

# COMPUTO L'HORA A ESPANYA (EL CONTENIDOR TÉ UNA HORA DIFERENT) i l'imprimeixo per pantalla. IIndispensable usar pytz
def imprimeix_hora_espanyola():
    global s 

    current_time = str(datetime.now(pytz.timezone("Europe/Madrid")))  #per escollir timezone fas pytz.all_timezones
    dia, hora = current_time.split()
    dia, hora = dia.split("-"), hora.split(":")
    dia.reverse()

    missatge = "execució script --> [ "+dia[0]+"/"+dia[1]+"/"+dia[2]+" || "+hora[0]+":"+hora[1]+"h ]"
    s = s + missatge + "\n"
    print(missatge)


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




# PRE: una llista de tuples on primer element
#      tupla es nom del pdf a cercar. Els pdfs de la tupla han d'existir al directori on s'executa el programa.
# POST: S'imprimeix cada linia que té una ocurrència de qualsevol dels elements
#      (especialitats) de ll_esp (llista especialitats)-
def fesScrapDocuments(ll_docs):
    global s 

    for doc in ll_docs:
        print("------------------------------\n")

        s = s + " -- cerca en --> ["+doc[0]+"]"+"\n"
        print(" -- cerca en --> ["+doc[0]+"]")
        
        textPDF = pdf_to_text(doc[0]) 
        if textPDF == "errorPdfAtext":
            s = s + "\t----- ################################################# ------\n\t----- ### ERROR DE TRANSCRIPCIÓ EN AQUEST DOCUMENT! ### ------\n\t----- ################################################# ------\n"
            print("\t----- ################################################# ------\n\t----- ### ERROR DE TRANSCRIPCIÓ EN AQUEST DOCUMENT! ### ------\n\t----- ################################################# ------\n")            
        else:
            ll_linies_PDF = textPDF.split("\n")
            for i in range(len(ll_linies_PDF)):
                print("AQUI EXTREU LA INFO DEL TICKET DIGITAL")
    
#PRE: una llista d'especialitats de la qual prendras els noms dels pdfs de la primera columna
#POST: pdfs esborrats de la carpeta
def esborra_pdfs(ll_esp, carregatPdfs):
    if carregatPdfs:
        for pdf, url in ll_esp:
            os.remove(pdf)
        
        



    


if __name__ == "__main__":
    #MOSTRO L'HORA EN QUE S'HA EXECUTAT L'SCRIPT
    imprimeix_hora_espanyola()

    #LLISTA DE TUPLES (nom amb que guardaré el document, url d'on fem scrap del document)
    llista_documents = [("tiket1.pdf","UBICACIO TICKET 1 EN ORDINADOR DEL USUARI"),
                        ("tiket2.pdf", "UBICACIO TIKET 2 EN ORDINADOR DE L'USUARI")]


    fesScrapDocuments(llista_documents)
    esborra_pdfs(llista_documents,True); #per evitar vestigis me'ls carrego un cop llegits (Si es true, si es false no fa res)
    

















def mostraLlistaTickets():
    return ["tiket1","tiket2","tiket3","tiket4"]

