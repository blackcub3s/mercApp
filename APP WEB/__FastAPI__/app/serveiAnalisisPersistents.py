
# Aquest service serveix per fer anàlisis als preus dels productes d'un usuari (per ara) i de usuaris en conjunt que es PERSISTIRAN en base de dades en
# la colecció analisisVariacionsPreus

import repositoriAnalisisPersistents
import repositoriTickets
import time

#PRE: id de l'usuari l'usuari del que volem fer l'analisis de si productes baixen o pujen de preu. || No existeixen 
#      productes de preu superior als 10 000 euros en mercadona
#POST: calcul dels productes que pujen, que es mantenen o que baixen segons el raonament:

#NOTA: Amb aquesta funció reescrivim en python el mateix codi JavaScript amb el que podiem rellenar la card de la inflació de 
#      cada producte (min, max, veure si producte pujava, baixava o es mantenia -pintant color contenidor tort-). 
#      En aquesta funcio, en canvi, apliquem iterativament la lògica a TOTS ELS productes de cop:
#      per rellenar la card de productes que pujen, mantenen i baixen preus res més carreguem la pàgina.
def computaProductesPujenMantenenBaixen_perUsuari(idUsuari_enToken):
    pujen = 0    #pujen preu
    mantenen = 0 #el mantenen
    baixen = 0   #baixen

    #INICI CONTADOR
    t1 =  time.perf_counter()


    TUPLA_productesDiferentsUsuari = tuple(repositoriTickets.frequencia_productes_per_usuari(idUsuari_enToken).keys())  # ('BOLSA PLASTICO', 'BANANA', 'BRONCHALES 1,5L', 'BRONCHALES 6L', [...], 'LECHE SEMI')

    #per cada nom de producte miro els parells clau valor del gràfic 
    for strProducte in TUPLA_productesDiferentsUsuari:
        
        # llDataPreu tindrà forma parell dates i preus per UN PRODUCTE DONAT --> [{ "x": "2022-06-01", "y": 1 },{ "x": "2022-08-01", "y": 3 },{ "x": "2026-06-01", "y": 6 }]
        llDataPreu = repositoriTickets.obtinguesArrayDeParellsDataPreuUnitari(strProducte , idUsuari_enToken)

        #codifiquem aqui la mateixa lògica vista en funció pMinMax() 
        # de "extractorDadesPersistencia_enCarregarPagina.js" (al que ens referim amb NOTA de la capçalera)
        min = 10000
        dataMin = ""
        max = -1
        dataMax = ""

        for i in range(len(llDataPreu)):
            data, preu = llDataPreu[i]["x"], llDataPreu[i]["y"], 
            

            #actualitzo els valors a cada iteracio.
            if preu < min:
                min = preu
                dataMin = data

            if preu > max:
                max = preu
                dataMax = data
    
        #Un cop ja trobats els màxims i minims per a un producte donat i obtenides les preimeres dates on es donaren aquests màxims i minims emetem
        #el judici per cada producte i el resultat del judici l'acumulem a les variables de nombre de productes que pujen baixen o es mantenen.
        if dataMax > dataMin:
            pujen += 1          #preu puja (al llarg del temps)
        elif dataMax < dataMin:
            baixen += 1         #preu baixa (al llarg del temps)
        else:
            mantenen += 1       #preu es manté (dataMax == dataMin)
        
    #INICI SEGON XIVATO DE TEMPS
    t2 =  time.perf_counter()
    print(t2 - t1)
    #FI SEGON XIVATO DE TEMPS

    return {"_id" : idUsuari_enToken, "pujen" : pujen, "mantenen" : mantenen, "baixen" : baixen}
    


#PRE: token de l'usuari del que volem fer l'analisis
#POST: Diccionari amb la informació corresponent estil {"_id" : idUsuariEnToken, "pujen" : 256, "mantenen" : 2, "baixen" : 10}
def pujenMantenenBaixen(idUsuari_enToken):
    
    return repositoriAnalisisPersistents.persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuari_enToken)


if __name__ == "__main__":
    print(computaProductesPujenMantenenBaixen_perUsuari(2))