import os 

#PRE: data format AAAAMMDD
#POST: llista strings [DD, MM, AAAA] -format espanyol-
def dataAllista(dataAnglo):
    return [dataAnglo[6:], dataAnglo[4:6], dataAnglo[0:4]]


# PRE: string de un pdf de l'estil "20240117 Mercadona 2,00 €.pdf"
# POST: torna true si es de l'estil "2DDDDDDD Mercadona" al començar el ticket
#        on D es un digit.
def ticketValidat(strTicket):
    try:
        strTicket = strTicket[:-4] #Trec el .pdf del final
        
        # En python puc "desempaquetar", com en javascript. 
        data, supermercat, preu, euro = strTicket.split()  # strTicket.split() ara ha de ser ha de ser de l'estil: ['20240117', 'Mercadona', '2,00', '€']
        if len(data) != 8 or euro != "€":
            return False
        dia, mes, any = dataAllista(data)
        diaOK = "01" <= dia <= "31"
        mesOK = "01" <= mes <= "12"
        anyOK = any[0] == "2" and len(any) == 4 #any te quatre digits i el primer es un dos
        if supermercat == "Mercadona" and diaOK and mesOK and anyOK:
            return True
        return False
    except Exception:
        return False

#PRE: Un idUsuari (enter)
#POST: El nombre de fitxers (s'esperen tickets digitals) que existeixen dins 
#      la carpeta de l'usuari
def mostraTicketsExistentsDinsCarpetaUsuari(idUsuari):
    try:
       return len(os.listdir(f"./tickets/{idUsuari}"))
    except FileNotFoundError: #No existeix la carpeta o la ruta recollim l'excepció (n'hi hauria 0!)
        return 0
      

#TESTS (NO S'EXECUTEN AL IMPORTAR L'ARXIU, NOMÉS EN EXECTUAR DIRECTAMET AQUEST ARXIU
if __name__ == "__main__":
    print(ticketValidat("20240131 Mercadona 2,00 €.pdf"))   # True
    print(ticketValidat("20240131 Mercadona 2,00 €.pdf"))   # True
    print(ticketValidat("20240117 Carrefour 2,00 €.pdf"))   # False
    print(ticketValidat("20240117Mercadona 2,00 €.pdf"))    # False (split incorrecte)
    print(ticketValidat("20240117 Mercadona 2,00.pdf"))     # False (falta euro)
    print(ticketValidat("2024 Mercadona 2,00 €.pdf"))       # False (data massa curta)
    print(ticketValidat(""))                                # False (string buit)
    print(ticketValidat("asqowpee-´`+`'')(-)<>.pdf"))       # Fakse (Caracters raros)
    print(ticketValidat("20240117 Carrefour 2,00 €.pdf"))   # False (fiquem un super que no és)
