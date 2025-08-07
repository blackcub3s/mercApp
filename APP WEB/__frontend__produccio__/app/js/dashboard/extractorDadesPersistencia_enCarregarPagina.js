


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



        //--- PRIMERA CARD TOP ---
        //obtinguesNreProductesPUJEN_MANTENEN_BAIXEN(); // NOTA: Crides la funcio dins del data en la funcio obtinguesIdCategoriaDeMesGasto_, si no bloqueja el fluxe


        //--- SEGONA CARD TOP ---
        obtinguesIdCategoriaDeMesGasto_deBackEnd_i_carregaImatge_a_html();
        




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

// PRE: rep un array d'objectes amb la forma {"x": data, "y": preu} on x és una data (string o Date) i y és un preu (número).
// POST: retorna un array amb tres valors booleans: [puja, baixa]
function fesRegressioLineal(arrDataPreuProducte) {
    if (!arrDataPreuProducte || arrDataPreuProducte.length < 2) {
        throw new Error("Calen com a mínim dues dades per fer una regressió lineal.");
    }

    const xArray = [];
    const yArray = [];

    // Converteix les dates a timestamps i guarda els preus
    for (let i = 0; i < arrDataPreuProducte.length; ++i) {
        const { x: data, y: preu } = arrDataPreuProducte[i];
        const timestamp = new Date(data).getTime();
        if (isNaN(timestamp) || typeof preu !== "number") {
            throw new Error("Dades invàlides: assegura't que 'x' és una data vàlida i 'y' és un número.");
        }
        xArray.push(timestamp);
        yArray.push(preu);
    }

    const n = xArray.length;
    const sumX = xArray.reduce((a, b) => a + b, 0);
    const sumY = yArray.reduce((a, b) => a + b, 0);
    const sumXY = xArray.reduce((acc, val, i) => acc + val * yArray[i], 0);
    const sumX2 = xArray.reduce((acc, val) => acc + val * val, 0);

    // Fórmula dels mínims quadrats per al pendent (slope)
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = (n * sumX2) - (sumX * sumX);

    const slope = denominator !== 0 ? numerator / denominator : 0;

    // Debug opcional
    console.log(slope.toString());

    return [slope > 0, slope < 0];
}



//QUÈ FA AQUESTA FUNCIÓ? --> TIPIC PROBLEMA D'ALGORISMIA <3
//
//AQUESTA FUNCIÓ AGFAFA arrDataPreu QUE LA GUARDEM AL LOCAL STORAGE JUST DESPRES DE FER
//EL GRAFIC DE PRODUCTE obtenint les dades de la crida fetch a fastAPI, al endpoint: /api/graficDataPreuProducte. En guardar-lo
//a local storage no cal fer més crides a endpoints. Des del client fem un esquema de recorregut de cada parell
//de punts del gràfic. I quan l'acabem ja sabem quin és el preu màxim i el preu mínim històric de cada producte,
//que és el que després va a la taula de l'inflalyzer :D. 
// 
//Si existeixen varis mínims el primer minim i la primera data on es dona (més antiga) 
//és la que sortirà. Passa el mateix amb els màxims, si n'existeixen varis el primer màxim i la primera data on es dona és la que sortirà.
//ASSUMPCIONS: No hi ha devolucions als tickets (preus negatius) i no hi ha cap producte de mercadona que costi més de 10000 euros.

// NOTA: la funció també aplica una regressio lineal per a saber si el preu puja o baixa. Si es manté ja no cal aplicar regressió lineal, 
// ja que el preu mínim i màxim són iguals.
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

    //AFEGEIXO COLORACIÓ a partir de l'slope o pendent de la recta de regressió lineal.
    //Si el preu puja, es posa verd, si baixa vermell i si es manté blau.
    const contenidorTort = document.getElementById("contenedorTorcidoTop");


    if (dataMax == dataMin) {
        colorejaContenidorTort(0, contenidorTort); //preu es mante (dataMax == dataMin) no cal mirar el pendent de regressió lineal en aquest cas (com que es un real mai es < 0)
    } else {
        let [preuPuja, preuBaixa] = fesRegressioLineal(arrDataPreuProducte); //per si volem fer estadístiques de puja, baixa i mantingut
        if (preuPuja) {
            colorejaContenidorTort(1, contenidorTort) //preu puja
        } else if (preuBaixa) {
            colorejaContenidorTort(-1, contenidorTort); //preu baixa
        }   
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


//PRE: existeix el endpoint /api/categoriaAmbMesGasto dins el back-end de fastAPI i en cridar-lo
//     torna un JSON de l'estil {"categoriaMaximoGasto": 1}
//POST: retorna un enter amb el valor de la categoria on s'ha gastat més.   
function obtinguesIdCategoriaDeMesGasto_deBackEnd_i_carregaImatge_a_html() {
    fetch('http://localhost:8000/api/categoriaAmbMesGasto', {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : `Bearer ${localStorage.getItem("AccessToken")}`
        }
    })
    .then(response => {
        if (!response.ok)
            throw new Error('Error en la solicitud: ' + response.status);
        return response.json(); 
    })
    .then(data => {
        //CARREGO LA IMATGE DE LA CATEGORIA EN L'HTML
        carregaImatgeCategoria_segonaCard(data.categoriaMaximoGasto);

        //ARA JA ACONSEGUEIXO QUE CARREGUI EL CONTINGUT DE LA PRIMERA CARD. SI NO, QUEDARIA BLOQUEJANT LA CARREGA DEL CONTENIGUT DE LA SEGONA CARD:
        obtinguesNreProductesPUJEN_MANTENEN_BAIXEN();
    })
    .catch(error => {console.error('Problema amb el fetch:', error);});
}




//PRE: idCategoria (de 1 a 13)
//POST: la imatge es veu carregada sense problemes
function carregaImatgeCategoria_segonaCard(idCategoria) {
    const elementPareImatgeCategoriaCARD = document.getElementById("iconoSegonaCardCATEGORIA");
    const elImg = document.createElement("img");
    elImg.setAttribute("src", `img/dashboard/iconosCategories/${categoriesIMG[idCategoria]}.png`); //verduraIHortalisses sera la mes carrgada
    elImg.setAttribute("alt", "imagen no cargó");
    elImg.setAttribute("title", `Categoría de producto: "${categoriesTEXT[idCategoria]}"`);
    elementPareImatgeCategoriaCARD.appendChild(elImg);
}










function obtinguesNreProductesPUJEN_MANTENEN_BAIXEN() {
    
    //CARREGO DEL DOM ELS PLACEHOLDERS PER POSAR LES TRES DADES:
    const dom_nrePreuIncrementat = document.getElementById("nreProductesPreu_INCREMENTAT");
    const dom_nrePreuMantingut = document.getElementById("nreProductesPreu_MANTINGUT");
    const dom_nrePreuDecrementat = document.getElementById("nreProductesPreu_DECREMENTAT");
    
    //CREO ELS PUNTS SUSPENSIUS:
    let s = ".";
    const intervalId = setInterval(() => {

        dom_nrePreuIncrementat.innerHTML = s;
        dom_nrePreuMantingut.innerHTML = s;
        dom_nrePreuDecrementat.innerHTML = s;
        s += ".";
        
        if (s.length > 3) {
            setTimeout(() => {}, 1200);
            s = ".";
        }
    }, 600);



    fetch('http://localhost:8000/api/calculaPujadesBaixadesEnProductes', {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : `Bearer ${localStorage.getItem("AccessToken")}`
        }
    })
    .then(response => {
        if (!response.ok)
            throw new Error('Error en la solicitud: ' + response.status);
        return response.json(); 
    })
    .then(data => {
        clearInterval(intervalId);
        dom_nrePreuIncrementat.innerHTML = data.pujen;
        dom_nrePreuMantingut.innerHTML = data.mantenen;
        dom_nrePreuDecrementat.innerHTML = data.baixen;
    })
    .catch(error => {console.error('Problema amb el fetch:', error);});


}