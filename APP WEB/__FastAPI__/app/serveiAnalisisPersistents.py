
# Aquest service serveix per fer anàlisis als preus dels productes d'un usuari (per ara) i de usuaris en conjunt que es PERSISTIRAN en base de dades en
# la colecció analisisVariacionsPreus

import repositoriAnalisisPersistents
import repositoriTickets
import time
from pymongo.errors import PyMongoError
from datetime import datetime
import scipy

#PRE: pendent, pValorB1, xDates, strProducte de la recta de regressio lineal que s'ha calculat per a un producte
#POST: imprimeix per consola el pendent, pValorB1, xDates i strProducte de la recta de regressio lineal que s'ha calculat per a un producte (per a depurar)
def xivatos(pendent, pValorB1, xDates, strProducte):
    if pendent == 0: 
        judici = "es manté"
    elif pendent > 0:
        judici = "puja"     
    elif pendent < 0:
        judici = "baixa"
    else:
        judici = "NOMES UN PRODUCTE: NO JUDICI"
    print("b1 = ", round(pendent,6), " | (p = ", round(pValorB1,4), ") || nItems = "+str(len(xDates))+ " strProducte: "+strProducte + "| JUDICI: "+judici)


#PRE: id de l'usuari l'usuari del que volem fer l'analisis de si productes baixen o pujen de preu. || No existeixen 
#      productes de preu superior als 10 000 euros en mercadona
#POST: calcul dels productes que pujen, que es mantenen o que baixen segons el raonament (cosa que usarem en la primera card del dashboard on surten els productes que pujen, mantenen o baixen de preu)

#NOTA: Amb aquesta funció reescrivim en python el mateix codi JavaScript que genera la regressio lineal per a cada producte, 
#      pero fent servir scipy.stats. En aquest cas, però tambe tenim el grau de significacio de la regressio lineal (p-value) i la pendent de la recta (b1).
#.     el p-valor no l'hem fet servir, però es podria fer servir per a determinar si la regressió lineal és significativa o no. Aquesta funció l'utilitzarem
#.     de manera que si el pendent es positiu, el preu puja, si és negatiu, baixa i si és zero, es manté. La regressio linieal de scipy atina força, de manera que
#.     si el valor de la regressio lineal es 0.0 es justament quan els productes es mantenen de preu sempre. Si el valor de pendetde la regressio lineal es diferent de 0.0 (p ex 0.004) +
#.     voldrà dir que el preu puja; si es -0.004 voldra dir que baixa. I si dona NaN no contarem que puja, baixa o es mante simplement perquè voldrà dir que hi havia un sol producte 
#      i no es pot fer regressio lineal.
def computaProductesPujenMantenenBaixen_perUsuari(idUsuari_enToken):
    pujen = 0    #pujen preu
    mantenen = 0 #el mantenen
    baixen = 0   #baixen

    #INICI CONTADOR
    #t1 =  time.perf_counter()


    TUPLA_productesDiferentsUsuari = tuple(repositoriTickets.frequencia_productes_per_usuari(idUsuari_enToken).keys())  # ('BOLSA PLASTICO', 'BANANA', 'BRONCHALES 1,5L', 'BRONCHALES 6L', [...], 'LECHE SEMI')

    #per cada nom de producte miro els parells clau valor del gràfic 
    for strProducte in TUPLA_productesDiferentsUsuari:
        
        # llDataPreu tindrà forma parell dates i preus per UN PRODUCTE DONAT --> [{ "x": "2022-06-01", "y": 1 },{ "x": "2022-08-01", "y": 3 },{ "x": "2026-06-01", "y": 6 }]
        llDataPreu = repositoriTickets.obtinguesArrayDeParellsDataPreuUnitari(strProducte , idUsuari_enToken)

        #codifiquem aqui la mateixa lògica vista en funció pMinMax() 
        # de "extractorDadesPersistencia_enCarregarPagina.js" (al que ens referim amb NOTA de la capçalera)
        
        xDates = [] #dates
        yPreus = [] #preus
        for i in range(len(llDataPreu)):
            data, preu = llDataPreu[i]["x"], llDataPreu[i]["y"], 
               
            xDates.append(datetime.strptime(data, "%Y-%m-%d").toordinal())  # obtinc objecte de l'string aaaa-mm-dd, el passo a dies
            yPreus.append(preu)   # els valors de Y son facils de tractar (nomes es reubicar)

        resultatRegLineal = scipy.stats.linregress(xDates, yPreus) #ojo que aixo no anira cal importar

        pendent = resultatRegLineal.slope   #pendent es coeficient b1
        pValorB1 = resultatRegLineal.pvalue #pValor

        # xivatos:
        # xivatos(pendent, pValorB1, xDates, strProducte)
        
        
        # a partir del pendent de la regressió lineal diem si el preu puja o baixa.
        if pendent > 0:
            pujen += 1          #preu puja (al llarg del temps)
        elif pendent < 0:
            baixen += 1         #preu baixa (al llarg del temps)
        elif pendent == 0: 
            mantenen += 1       #preu es manté (posem explicitament pendent == 0 perque la regressio afina a 0.0 si hi ha 2 o mes productes perfectament alineats)
        else:
            pass                #Aqui es dona quan es dona A) el pendent es nan perquè només hi ha 1 sol producte (no hi ha mes de 1 punt a la recta i no puc fer regressio). B) Perque hi ha hagut un error de lectura dels punts dels productes que cal subsanar
            #print("NOT A NUMBER")
        
    #INICI SEGON XIVATO DE TEMPS
    #t2 =  time.perf_counter()
    #print(t2 - t1)
    #FI SEGON XIVATO DE TEMPS

    return {"_id" : idUsuari_enToken, "pujen" : pujen, "mantenen" : mantenen, "baixen" : baixen}
    


#PRE: token de l'usuari del que volem fer l'analisis
#POST: Diccionari amb la informació corresponent estil {"_id" : idUsuariEnToken, "pujen" : 256, "mantenen" : 2, "baixen" : 10}
def pujenMantenenBaixen(idUsuari_enToken):
    return persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuari_enToken)


# PRE: - id_usuariEnTOken: conte l'id d'usuari.
# POST: retorno format tipus --> {"_id" : 2, "pujen" : 100, "mantenen" : 2, "baixen" : 14}
#      Per a l'usuari id_usuariEnTOken donat passa una de dues coses: 
#             A) es persistenxien les dades dicVariacionsProductes, i es calculen en el service, en la collection "variacions" (COSTA 9 - 10 SEGONS DE FER EN MSI GS65 stealth 8SE: COMPUTACIONALMENT INTENSIU)
#             B) sobtenen les variacions de preus que tenen els seus tikets cercant a la coleccio variacions en cas que JA S'HAGUESSIN CALCULAT (evitant recalcular-les)
def persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(idUsuariEnToken):
    try: 
        dicVariacions = repositoriAnalisisPersistents.obtenirVariacionsUsuari(idUsuariEnToken)
       
        if dicVariacions:   #Si el diccionari existeix, vol dir que ja s'havia calculat la variacio de preus: la recuperem de la BBDD!
            return dicVariacions  
        else:               #Si el diccionari no existeix (es NoneType), vol dir que NO s'havia calculat la variacio de preus: la CALCULEM!
            #Calculem els productes que pujen, baixen i mantenen (INTENSIU COMPUTACIONALMENT) i guardem a mongoDB per propores consultes (que no requereixin calcul)
            diccVariacions_RECENTCALCULAT = computaProductesPujenMantenenBaixen_perUsuari(idUsuariEnToken) #PROGRAMAR LA SEUA OBTENCIÓ EN EL serveiAnalisisPersistents
            repositoriAnalisisPersistents.inserirVariacionsUsuari(idUsuariEnToken, diccVariacions_RECENTCALCULAT)
            return diccVariacions_RECENTCALCULAT
        
    except PyMongoError as e:
        print(f"Error al guardar a MongoDB: {e}")
        return {} #veure què poso aqui




if __name__ == "__main__":
    #print(computaProductesPujenMantenenBaixen_perUsuari(2))
    d = persisteix_o_obtingues_VariacionsPreusTickets_a_MONGODB(2)
    print(d)