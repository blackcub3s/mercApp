
//AQUEST DOCUMENT CREARÀ ELS PREUS, LES BARRES I ELS MESOS EN FORMAT
//feb25, gen25, etc... PER A LES BARRES QUE MOSTREN ELS GASTOS TOTALS DE L'USUARI
//PER CADA MES. 

//- CREARÀ PROGRAMÀTCAMENT ARTICLE AL DOM EB dashboard.html 
//  (ELS QUE ESTAN COMENTATS DINS DELS SECTION AMB ID:
//  * wrapperPreus 
//  * wrapperBarres
//  * wrapperMesets

// Els preus seran extret de la variable global

document.addEventListener("DOMContentLoaded", () => {

    const domPreus = document.getElementById("wrapperPreus");
    const domBarres = document.getElementById("wrapperBarres");
    const domMesos = document.getElementById("wrapperMesets");
    
    oMesos_a_graficBarres_DOM(domPreus, domBarres, domMesos);
    
});




// PRE:  passo els tres elements del dom (domPreus, domBarres i domMesests)
//       als quals voldrem introduir la informació de la variable global oMesos. 
//       oMesos recorda que té aspecte: {2025-09: 79.47, 2025-08: 11.54, 2025-06: 93.48 ---
// POST: els elements del dom tenen introduides les dades i la posa a l'element
//       del dom que li pertoca (Donat que la variable mencionada pot tardar un rato a estar disponible  fem servir setInterval).
//       els mesos han passat a format abr25, ene25, etc. I els mesos sense gasto intermitjos entre el primer
//       i ultim mes de oMesos tindran els 0 dins de la variable de funcio (no global) oMesosNOU.
function oMesos_a_graficBarres_DOM(domPreus, domBarres, domMesets) {
    const idIntervalBarres = setInterval(() => {
        //COMPROVO SI LA VARIABLE oMesos ja està definida en memoria per l'altre script. En cas contrari segueixo mirant
        if (typeof oMesos !== "undefined") { //lectura oMesos correcta
            auxiliar(oMesos, domPreus, domBarres, domMesets);
            clearInterval(idIntervalBarres);
        }
    }, 100)
}

//PRE: oMesos, el dict de mesos; domPreus, dom Barres, domMesets: els tres elements del dom corresponents.
//POST: to do (les dades de oMesosNOU al dom)
//NOTA: oMesos es variable global, no caldria passar-la per parametre. pero ho faig per claretat.
function auxiliar(oMesos, domPreus, domBarres, domMesets) {
    const oMesosNOU = afegeixMesosSenseGast(oMesos); //oMesosNOU és com oMesos pero amb els mesos sense gastos afegits en clau i valor.
    const clausMesos = Object.keys(oMesosNOU).sort().reverse(); //m'asseguro que les claus estan ordenades (ojo amb els navegadors)
    
    console.log(oMesosNOU);
    console.log(clausMesos);

    // -----------------------
    // to do aqui
    // CONTINUAR TRACTANT oMesosNou i clusMesos. Recorre clausMesos
    // i passa les claus a oMesosNOU per trobar els valors i ves enxufant
    //al dom
    //-------------------------

    aux_cardIntervalizer__POSAMESOS(clausMesos, domMesets);
    let arrAlturesBarres = aux_cardIntervalizer__POSABARRES(clausMesos, oMesosNOU, domBarres);  //TO DO
    //aux_cardIntervalizer__POSAPREUS(clausMesos, oMesosNOU, domPreus, arrAlturesBarres);  //PER ALTURES domPreus has d'agafar propietat de domBarres

    //-------------------------
    //FINAL to do aqui
    //-------------------------

}

//PRE: oMesos conté el diccionari {2025-09: 79.47, 2025-08: 11.54, 2025-06: 93.48, 2025-04: 167.97, 2025-03: 174.12, …}
//POST: RETORNA oMesosNOU conté el diccionari amb els mesos sense gast entre el primer i ultim mes de oMesos.
function afegeixMesosSenseGast(oMesos) {
    const oMesosNOU = {}; //SERA UNA COPIA DE oMesos no un alias
    Object.assign(oMesosNOU, oMesos); //fem la copia

    let clausMesos = Object.keys(oMesosNOU).sort().reverse(); //me n'asseguro que les claus estan ordenades, pot canviar entre navegadors
    for (let i = 0; i < clausMesos.length - 1; ++i) {

        let mesActual = clausMesos[i];
        let mesAnterior = obtenirMesPrevi(mesActual);
        let mesSeguent = clausMesos[i+1];

        //AQUEST while recorre del mes més antic fins al mes més recent. posant els mesos 
        //faltant sense gasto a oMesosNOU (ja que a oMesos no hi eren).
        //NOTA: condicio de finalitzacio es arribar al mes més recent i es depenent de l'ordenacio de oMesosNOU.
        while (mesSeguent !== mesAnterior) {
            oMesosNOU[mesAnterior] = 0;
            mesAnterior = obtenirMesPrevi(mesAnterior);
        }
    }
    return oMesosNOU;
}


//funcio que posa al DOM els mesos que conté els mesos de la card a partir de un array "clausMesos" que conté les claus
//ordenades per ordre cronològic invers de l'objecte oMesosNou. 
// Ho farà rellenant programàticament <articles> dins el section del dashboard.html amb id wrapperMesets. En context rellenarà això ***
/*
    <section id = "wrapperMesets"> 
        <article class = "mesAA colorBlauSortidaDades">feb25</article>     <---- relleno això ***
        <article class = "mesAA colorBlauSortidaDades">mar25</article>     <---- relleno això ***
        [...]
    </section>
*/
function aux_cardIntervalizer__POSAMESOS(clausMesos, domMesets) {
    for (const clauMes of clausMesos) {
        const articleMes = document.createElement("article"); //CREO UN NODE ARTICLE
        articleMes.setAttribute("class","mesAA colorBlauSortidaDades"); //defineixo les dues classes que vull
        articleMes.textContent = aaaamm__a__mesAA(clauMes); //poso el mes feb25, per exemple:
        domMesets.appendChild(articleMes); //AFEGEIXO DINS EL SECTION "wrapperMesets" DEL DOM:
    }
}

//PRE:  - clausMesos: ùn array extret de les clasus de oMesosNOU --> exemple: ['2025-04', '2025-03', '2025-02', '2025-01', ... ,  '2023-09']
//      - oMesosNOU : un object amb parells clau valor de mes i gastos per mes --> exemple: {2025-04: 167.97, 2025-03: 174.12, 2025-02: 244.35, 2025-01: 140.45, … ,  2023-09: 13.71} 
//      - domBarres : l'element section del dom que té per id "wrapperBarres" i que contindrà les barres representades amb "articles" de més o menys altura segons el preu de cada mes
//POST: 
//     - arrAlturesBarres: 
//          un array CORRELATIU ALS ELEMENTS DE clausMesos. Cada un dels seus elements és un valor de proporció p_i tal que 
//          0 <= p_i <= 1, on p_i denota proporció d'altura assignada a cada valor de gast de oMesosNOU -->
//          --> exemple:  [0.687, 0.712, 1, 0.574, ... , 0.056] 
//          -------------------------------------------------------------------------------------------------------
//          NOTA: el valor màxim de gast mensual té una p_i = 1. I valors de 0 euros gastats en un mes tindràn p_i = 0
//ACCIONS: 
//          AQUESTA FUNCIÓN Es defineixen les barres (articles) amb l'altura variable
//          dins del section de id "wrapperBarres" de dashboard.html.
//          Afegint tants articles amb class barra com a fills com elements hi hagi dins de clausMesos:
//              <article class = "barra"></article>. 
//          TAMBÉ es posen les altrues variables a partir dels càlculs de proporció explicats dins la funció.
//          substituint les línes de CSS que ara funcionaràn de forma programàtica
            /*
                .barra:first-child{height: 100%;}
                .barra:nth-child(2){height: 30%;}
                .barra:nth-child(3){height: 60%;}
                .barra:nth-child(4){height: 90%;}
            */
            
function aux_cardIntervalizer__POSABARRES(clausMesos, oMesosNOU, domBarres) {

    // TROBO EL GASTO DEL MES ES AMB MÉS GASTOS DINS 
    // DE oMesosNOU. Es trobarà dins maxGast acabat el bucle
    let maxGast = 0; 
    for (const clauMes of clausMesos) {
        if (oMesosNOU[clauMes] > maxGast) {
            maxGast = oMesosNOU[clauMes];
        }
    }

    // CREO UN ARRAY CORRELATIU A L'ARRAU clausMesos amb el percentatge d'altura. 
    // Aquest array contindrà les altures de les barres.
    // per definir l'altura de cada barra trobarem la proporció P ièssima P_i 
    // en tant per 1 RESOLENT L'EQUACIÓ DE PRIMER GRAU on l'incògnita serà P_i:
    //
    //      (P_i/gast_i = 1/maxGast) --> P_i = gast_i*(1/maxGast)
    //
    //  on trobem:
    //
    //   - gast_i:  es el cost total del mes ièssim
    //   - P_i:     es la proporció assignada a cada mes amb 0 <= P_i <= 100.
    //   - maxGast: es el mes amb gasto màxim, que tindrà una proporció P_i = 1 (100% de height! La barra més alta)
    arrAlturesBarres = [];
    for (const clauMes of clausMesos) {
        let gast_i = oMesosNOU[clauMes];
        let P_i = gast_i*(1/maxGast);
        arrAlturesBarres.push(P_i);
    }
    console.log(arrAlturesBarres);

    //ARA POSO: A wrapperBarres els 
    // <article class = "barra"></article> 
    // necessaris, tants com claus hi hagi a clausMesos.
    for (const clauMes of clausMesos) {
        const articleBarra = document.createElement("article"); //CREO UN NODE ARTICLE
        articleBarra.setAttribute("class","barra"); //defineixo les dues classes que vull
        domBarres.appendChild(articleBarra); //AFEGEIXO DINS EL SECTION "wrapperMesets" DEL DOM:
    }

    //ACTE SEGUIT: defineixo l'altura dels articles (barres), un per un programàticament
    // en substitució del CSS de estils.css -->  .barra:nth-child(i)
    const articlesBarres = domBarres.children;
    for (let i = 0; i < articlesBarres.length; ++i) {
        articlesBarres[i].style.height = (arrAlturesBarres[i]*100)+"%";
    }

    return arrAlturesBarres;
}



//FUNCIO CREADA AMB XAT GPT. PROMPT:

/*
Crea una funcion en javascript que a partir de un 
string en formato aaaa-mm devuelva la fecha en formato 
tres primeras letras del mes en español seguido del año 
abreviado en dos digitos. 

Es decir: 

Entrada: 2025-05 

devuelve: 

abr25 

Hazlo en castellano function aaaamm__a__mesAA(aaaamm) { 

    return mesAnyoFormateados; 

}
*/
//PRE: un mes en format aaaa-mm.
//POST: el mes en format primersTresDigitsMesCastellaAA.
function aaaamm__a__mesAA(aaaamm) {
    // Array con los meses en español (3 primeras letras)
    const meses = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic"
    ];

    // Separar año y mes
    const [anyo, mes] = aaaamm.split("-");

    // Obtener el mes (restamos 1 porque el array empieza en 0)
    const mesTexto = meses[parseInt(mes, 10) - 1];

    // Obtener los dos últimos dígitos del año
    const anyoAbreviado = anyo.slice(-2);

    // Concatenar resultado
    const mesAnyoFormateados = mesTexto + anyoAbreviado;

    return mesAnyoFormateados;
}







//FUNCIO FETA PER XAT GPT:

//PROMPT:

//Hazme otra funcion que dado un mes con formato aaaa-mm 
//me devuelva el mes con formato aaaa-mm inmediatamente anterior.
function obtenirMesPrevi(aaaamm) {
    // Separar año y mes
    let [anyo, mes] = aaaamm.split("-").map(Number);

    // Si es enero, retrocedemos a diciembre del año anterior
    if (mes === 1) {
        mes = 12;
        anyo -= 1;
    } else {
        mes -= 1;
    }

    // Asegurar formato de dos dígitos para el mes
    const mesFormateado = String(mes).padStart(2, "0");

    return `${anyo}-${mesFormateado}`;
}
