//prodInflacio es necessita en aquest script i en paginadorInflacio.js
//                   [prod, nreUnitats, categoria]
let prodInflacio = [["cogollo", 43, 1], ["pollo", 23, 6], ["bezoya", 12, 4]];   //també s'usa a pagimadorInflacio


//CÀRREGA DE DADES EL PRIMER COP QUE CARREGUEM LA PÀGINA
document.addEventListener("DOMContentLoaded", (esdeveniment) => {


    //OBTENCIO DEL NOM DE L'USUARI (NOMES EN CARREGAR DOM, UN COP)
    const dom_nomUsuari = document.getElementById("nomUsuari");
    dom_nomUsuari.innerHTML = "Nombre de usuario";


    //OBTENCIÓ DE DADES PER AL SUBTITOL QUE HI HA SOTA DE "Hola NOMBRE USUARIO" (NOMES EN CARREGAR DOM, UN COP)
    const dom_nreTicketsTotalUsuari = document.getElementById("nreTicketsTotalUsuari");
    dom_nreTicketsTotalUsuari.innerHTML = "XXX";

    const dom_dataInicialTickets = document.getElementById("dataInicialTickets");
    dom_dataInicialTickets.innerHTML =  "dd/mm/aa";

    const dom_dataFinalTickets = document.getElementById("dataFinalTickets");
    dom_dataFinalTickets.innerHTML =  "DD/MM/AA";


    //OBTENCIÓ DE DADES DE LES CARDS (NOMES EN CARREGAR DOM, UN COP)
    const dom_nreProdDiferents = document.getElementById("nreProductesDiferentsAdquirits");
    dom_nreProdDiferents.innerHTML = "X+Y+Z"; //posar aqui productes BBDD (POT SER STRING O POT SER INTEGER, ES IGUAL)

    const dom_nrePreuIncrementat = document.getElementById("nreProductesPreu_INCREMENTAT");
    dom_nrePreuIncrementat.innerHTML = "X";

    const dom_nrePreuMantingut = document.getElementById("nreProductesPreu_MANTINGUT");
    dom_nrePreuMantingut.innerHTML = "Y"

    const dom_nrePreuDecrementat = document.getElementById("nreProductesPreu_DECREMENTAT");
    dom_nrePreuDecrementat.innerHTML = "Z";

    // -------------------
    // --- INFLALYZER ----
    // -------------------
    //OBTENCIO DADES DE L'INFLALYZER QUAN ES CARREGA LA PÀGINA PER PRIMER COP
    getDadesInflalyzer(esdeveniment, 0, prodInflacio);


    // -------------------
    // --- CATEGORIZER----
    // -------------------


    //TO DO


    // -------------------
    // --- INTERVALIZER----
    // -------------------




    //TO DO



});


function aux_emplenaCardInflacio(i, prodInflacio) {
    const dom_inflalyzerNomProducte = document.getElementById("inflalyzerNomProducte");
    dom_inflalyzerNomProducte.innerHTML = prodInflacio[i][0]; //COGOLLO, per exemple

    const nreProductes_PRODUCTECONCRET_inflalyzer = document.getElementById("nreProductes_PRODUCTECONCRET_inflalyzer");
    nreProductes_PRODUCTECONCRET_inflalyzer.innerHTML = prodInflacio[i][1]; //43 LINIES DE TIKET PER EXEMPLE

    const paginaPaginadorINFL = document.getElementById("paginesPaginadorINFL");
    paginaPaginadorINFL.innerHTML = `${i+1} / ${prodInflacio.length}`; //POSO INFO PAGINADOR DE PRODUCTES

    const imatgeCategoriaINFL = document.getElementById("imatgeCategoriaINFLACIO"); 
    imatgeCategoriaINFL.setAttribute("src", `img/dashboard/iconosCategories/${categoriesIMG[prodInflacio[i][2]]}.png`); //POSO IMATGE PROGRAMÀTICAMENT

    const titolCategoriaINFL = document.getElementById("textCategoriaINFLACIO");
    titolCategoriaINFL.innerHTML = categoriesTEXT[prodInflacio[i][2]];
}



//PRE: esdev ----------> es l'esdeveniment que l'ha creat.
//     i --------------> index de la llista de dins paginadorInflacio.js (index 0 producte comprat més frequentment en el temps)
//     prodInflacio ---> [["cogollo", 43, 1], ["pollo", 23, 6], ["bezoya", 12, 4]];
    //
    // prodInflació és una Array d'arrays, on cada subarray té la forma 
    // [producte, nombreDeMomentsDiferentsDeCompra, categoriaSegonsDiccionari de Categories.js].
    // Per exemple, si el producte "cogollo" s'ha comprat 4 cops aquest matí, 5 cops aquesta tarda,
    // i 2 cops fa un any, el resultat serà que "cogollo" s'ha comprat en 3 moments diferents del temps.
    // Cada un d'aquests moments permeten valorar una fotografia de l'inflació del producte.
function getDadesInflalyzer(esdev, i, prodInflacio) {
    
    // -- primer cop que carreguem les dades al carregar la pàgina (PRENC PRIMER ELEMENT DE LA LLISTA, EL MES FREQUENT)--
    if (esdev.type == "DOMContentLoaded") {     
        aux_emplenaCardInflacio(i, prodInflacio);
    }
    // -- dades accedides a través dels paginadors (PUC ANAR A 2N ELEMENT DE LA LLISTA, 3R RETROCEDIR, ETC.) --
    else if (esdev.type == "click") {     // ------> quan cliquem a botó dret o esquerre de l'inflalyzer
        if (esdev.target.getAttribute("id") == "botoDreta") {
            aux_emplenaCardInflacio(i, prodInflacio);
        } else if (esdev.target.getAttribute("id") == "botoEsquerra") {
            aux_emplenaCardInflacio(i, prodInflacio);
        }
        
    }

}

