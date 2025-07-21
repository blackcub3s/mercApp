
# Aquest service serveix per fer anàlisis als preus dels productes d'un usuari (per ara) i de usuaris en conjunt que es PERSISTIRAN en base de dades en
# la colecció analisisVariacionsPreus

import repositoriAnalisisPersistents



#PRE: token de l'usuari del que volem fer l'analisis
#POST: calcul dels productes que pujen, que es mantenen o que baixen segons el raonament:
# TO DO EL POST
def computaProductesPujenMantenenBaixen_perUsuari(idUsuari_enToken):
    pujen = 300
    mantenen = 33
    baixen = 69

    return {"_id" : idUsuari_enToken, "pujen" : pujen, "mantenen" : mantenen, "baixen" : baixen}
    


#PRE: token de l'usuari del que volem fer l'analisis
#POST: Diccionari amb la informació corresponent estil {"_id" : idUsuariEnToken, "pujen" : 256, "mantenen" : 2, "baixen" : 10}
def pujenMantenenBaixen(idUsuari_enToken):
    diccVariacionsProductes = computaProductesPujenMantenenBaixen_perUsuari(idUsuari_enToken) #PROGRAMAR LA SEUA OBTENCIÓ EN EL serveiAnalisisPersistents
    return repositoriAnalisisPersistents.persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuari_enToken, diccVariacionsProductes)


