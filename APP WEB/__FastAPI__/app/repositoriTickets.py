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
        return nTicketsPersistits #retorno sense incrementar.
    
    #persisteix aqui. Si fall apersistència NO INCREMENTIS EL VALOR I RETORNA EL nTicketPersistits tal qual
    nTicketsPersistits += 0 #POSARAS UN +1 PER CADA TICKET GUARDAT AQUI (PLACEHOLDER) 
    return nTicketsPersistits #TO DO