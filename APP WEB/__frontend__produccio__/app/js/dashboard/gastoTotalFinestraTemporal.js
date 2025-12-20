
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
        if (typeof oMesos !== "undefined") {
            console.log("lectura oMesos correcta");
            afegeixMesosSenseGast(oMesos); //no caldria passar si no volgues perque es variable global




            clearInterval(idIntervalBarres);
        } else {
            console.log("no definida!");
        }
    }, 100)
}

//PRE: oMesos conté el diccionari {2025-09: 79.47, 2025-08: 11.54, 2025-06: 93.48, 2025-04: 167.97, 2025-03: 174.12, …}
function afegeixMesosSenseGast(oMesos) {
    const oMesosNOU = {}; //SERA UNA COPIA DE oMesos no un alias
    Object.assign(oMesosNOU, oMesos); //fem la copia

    let clausMesos = Object.keys(oMesosNOU).sort().reverse(); //me n'asseguro que les claus estan ordenades, pot canviar entre navegadors
    let mesMesRecent = Object.keys(oMesos)[0]; //tallarà la iteracio del while aniuat (per això ho ordeno, per torbar exactament EL MÉS MES RECENT)
    for (let i = 0; i < clausMesos.length - 1; ++i) {

        let mesActual = clausMesos[i];
        let mesAnterior = obtenerMesAnterior(mesActual);
        let mesSeguent = clausMesos[i+1];

        
        //AQUEST while recorre del mes més antic fins al mes més recent.
        //posant els mesos faltant sense gasto a oMesosNOU (ja que a oMesos no hi eren).
        //NOTA: condicio de finalitzacio es arribar al mes més recent i es depenent de l'ordenacio
        //de oMesosNOU.
        while (mesActual != mesMesRecent && mesSeguent !== mesAnterior) {
            oMesosNOU[mesAnterior] = 0;
            mesAnterior = obtenerMesAnterior(mesAnterior);
        }
    }

    console.log("#################");
    console.log(oMesosNOU);
    console.log("#################");
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
function obtenerMesAnterior(aaaamm) {
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
