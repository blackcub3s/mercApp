


//CÀRREGA DE DADES EL PRIMER COP QUE CARREGUEM LA PÀGINA
document.addEventListener("DOMContentLoaded", (esdeveniment) => {

    //OBTENCIÓ DE DADES DE LES CARDS (NOMES EN CARREGAR DOM, UN COP)

    //NOMBRE PRODUCTES DIFERENTS ADQUIRITS
    fetch('http://localhost:8000/api/frequenciesProductes', {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("AccessToken"),
            'Accept': 'application/json' 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud devolvió código de error en paso3 : ' + response.status + " || Mensaje de error: " + response.statusText);
        }
        return response.json();
    })
    .then(diccDades => {  //estil --> {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}                                                                                                                         
        const dom_nreProdDiferents = document.getElementById("nreProductesDiferentsAdquirits");
        dom_nreProdDiferents.innerHTML = Object.entries(diccDades).length;
        localStorage.setItem("frequenciesProductes", JSON.stringify(diccDades)); //guardem les dades, necesaries per a després a l'inflalyzer (no volem fer crides innecessàries). Cal fer stringify sino es perd l'estructura d'objecte


        //prodInflacio es necessita en aquest script i en paginadorInflacio.js (ES NECESITA EN DOS LLOCS)
        //                   
        prodInflacio = []
        for (let clauProducte in diccDades) {                            
            //LA CATEGORIA DE CADA PRODUCTE NO SURT ENCARA DE BBDD. HEM FET UNA CLASSIFICACIÓ MANUAL EN EL FRONT PER DEMOSTRAR LA WEB. A FUTUR ES FARÀ AMB NLP.                        
            let categoriaManual = productesClassificats[clauProducte]
            if (categoriaManual == undefined)
                categoriaManual = 13;                                                                           //[prod, nreUnitats, categoria]
            prodInflacio.push([clauProducte ,diccDades[clauProducte], categoriaManual])  //let prodInflacio = [["cogollo", 43, 1], ["pollo", 23, 6], ["bezoya", 12, 4]];   //també s'usa a pagimadorInflacio
        }


        






        //OBTENCIO DEL NOM DE L'USUARI (NOMES EN CARREGAR DOM, UN COP)
        const dom_nomUsuari = document.getElementById("nomUsuari");
        dom_nomUsuari.innerHTML = "";


        //OBTENCIÓ DE DADES PER AL SUBTITOL QUE HI HA SOTA DE "Hola NOMBRE USUARIO" (NOMES EN CARREGAR DOM, UN COP)
        const dom_nreTicketsTotalUsuari = document.getElementById("nreTicketsTotalUsuari");
        dom_nreTicketsTotalUsuari.innerHTML = ""; //XXX TICKETS

        const dom_dataInicialTickets = document.getElementById("dataInicialTickets");
        dom_dataInicialTickets.innerHTML =  "";//"dd/mm/aa";

        const dom_dataFinalTickets = document.getElementById("dataFinalTickets");
        dom_dataFinalTickets.innerHTML =  "";//"DD/MM/AA";




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
        paginadorManual(prodInflacio);
        getDadesInflalyzer(esdeveniment, 0, prodInflacio);
        

        // -------------------
        // --- CATEGORIZER----
        // -------------------


        //TO DO


        // -------------------
        // --- INTERVALIZER----
        // -------------------




        //TO DO
































    })
    .catch(error => {
        console.error('Error en paso3:', error);
    });




});


//QUÈ FA AQUESTA FUNCIÓ? --> TIPIC PROBLEMA D'ALGORISMIA <3
//
//AQUESTA FUNCIÓ AGFAFA arrDataPreu QUE LA GUARDEM AL LOCAL STORAGE JUST DESPRES DE FER
//EL GRAFIC DE PRODUCTE obtenint les dades de la crida fetch a fastAPI, al endpoint: /api/graficDataPreuProducte. En guardar-lo
//a local storage no cal fer més crides a endpoints. Des del client fem un esquema de recorregut de cada parell
//de punts del gràfic. I quan l'acabem ja sabem quin és el preu màxim i el preu mínim històric de cada producte,
//podent posar-lo a la taula de l'inflalyzer :D.
//ASSUMPCIONS: No hi ha devolucions als tickets (preus negatius) i no hi ha cap producte de mercadona que costi més de 10000 euros
function pMinMax(preuMinim, preuMaxim, dataPreuMinim, dataPreuMaxim) {
    let arrDataPreuProducte = JSON.parse(localStorage.getItem("arrDataPreu"));    
    let min = 10000;
    let dataMin = "";
    let max = -1;
    let dataMax = "";
    for (let i = 0; i < arrDataPreuProducte.length; ++i) {
        let {"x" : data, "y": preu} = arrDataPreuProducte[i];
        //console.log(data, preu);

        //actualitzo els valors a cada iteracio.
        if (preu < min) {
            min = preu;
            dataMin = data;
        }
        if (preu > max) {
            max = preu;
            dataMax = data;
        }
    }

    //POSO AL DOM ELS VFALORS MINIM I MAX
    preuMinim.innerHTML = min;
    preuMaxim.innerHTML = max;
    const dataMinESPANYOLA = dataANGLO => dataANGLO.split('-').reverse().join('/'); //bygpt
    const dataMaxESPANYOLA = dataANGLO => dataANGLO.split('-').reverse().join('/');
    dataPreuMinim.innerHTML = dataMinESPANYOLA(dataMin);
    dataPreuMaxim.innerHTML = dataMaxESPANYOLA(dataMax);

    //AFEGEIXO COLORACIÓ (dataMax es fata del primer màxim. dataMin primera data del primer mínim.)
    //es tractar d'una primera aproximacio
    const contenidorTort = document.getElementById("contenedorTorcidoTop");
    if (dataMax > dataMin) {
        colorejaContenidorTort(1, contenidorTort) //preu puja
    } else if (dataMax < dataMin){
        colorejaContenidorTort(-1, contenidorTort); //preu es baixa
    } else {
        colorejaContenidorTort(0, contenidorTort); //preu es mante (dataMax == dataMin)
    }

    
}

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

    /*RELLENO LA TAULA*/
    const preuMinim = document.getElementById("preuMinim");
    const preuMaxim = document.getElementById("preuMaxim");
    const dataPreuMinim = document.getElementById("dataPreuMinim");
    const dataPreuMaxim = document.getElementById("dataPreuMaxim");

    //Sense aquest settimeout peta perque llegeix el local storage antic
    //ja que no li ha donat temps a carregar-se amb la nova crida a endpoint api/grafucDataPreuProducte
    
    

    const idInterval = setTimeout(() => {
        pMinMax(preuMinim, preuMaxim, dataPreuMinim, dataPreuMaxim);
        
    }, 100);

    


    /*FI RELLENO DE LA TAULA*/
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

