/*Quan carrega el dom pillem tots els tickets de api/totsElsTickets. S'usaran per a inflalyzer i després també 
per la pagina de tickets (es un copy paste del codi de /tickets/creaIrellenaCards.js modificat per a l'ocasió). NOTEU que ara 
l'arxiu antic al que fem referencia ja no carregarà de l'endpoint les dades, sino que a la practica nomes ho farà del localStorage.

Això és aixi perque en copiar i pegar el codi aqui, i ser el dashboard el punt d'entrada privat a l'aplicació,
els tickets ja es carreguen aqui de cop directament; no es carreguen d'un fetch dins de tickets.html.*/
document.addEventListener("DOMContentLoaded", () => {

    const tokenAcces = localStorage.getItem("AccessToken");
    const llTicketsLocalStorage = localStorage.getItem("totsElsTickets");

    //ES QUE ELS TICKETS NO S'HAN DESCARREGAT (PRIMER CÀRREGA DE LA PAGINA. ALESHORES PILLES DEL SERVER)
    if (llTicketsLocalStorage == null) {

        console.log("EXTRAIEM TICKETS DEL BACK-END!");
        
        fetch('http://localhost:8000/api/totsElsTickets', {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + tokenAcces,
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status + " || Mensaje de error: " + response.statusText);
            }
            return response.json();
        })
        .then(tickets => {

            //----------------------
            //--- MOLT IMPORTANT ---
            //----------------------
            posaDatesMinimaImaximaTiket(tickets.llTickets);  //TO DO
            creaIrellenaBarresInflalyzer(tickets.llTickets);  //AQUESTA FUNCIÓ ES LA QUE ENS RELLENARÀ LES CARDS!
            localStorage.setItem("totsElsTickets", JSON.stringify(tickets.llTickets)); //GUARDO A LOCAL STORAGE LA LLISTA D'OBJECTS (LLISTA TICKETS) PASSO A STRING AMB STRINGIFY!
            //----------------------
            //--- MOLT IMPORTANT ---
            //----------------------


        })
        .catch(error => {
            console.error('Error en paso3:', error);
        });
    } 
    //CAS EN QUE ELS TICKETS DEL LOCAL STORAGE JA S'HAN CARREGAT DEL SERVIDOR (NO SERA NULL)
    else if (llTicketsLocalStorage != null) {
        console.log("TICKETS REEXTRETS DEL LOCAL STORAGE");
        let ticketsss = JSON.parse(localStorage.getItem("totsElsTickets"));
        posaDatesMinimaImaximaTiket(ticketsss);  //TO DO
        creaIrellenaBarresInflalyzer(ticketsss);  //AQUESTA FUNCIÓ ES LA QUE ENS RELLENARÀ L'INFLALYZER DEL LOCAL STORAGE (SERIALITZO AMB JSON.parse())
    }
});




    //PRE: llTickets és una rray que conté cada ticket en format JSON serialitzat (objecte):
    /*[{
                "_id": "2423-010-287820_OP439076",
                "idUsuari": 2,
                "productesAdquirits": {
                    "SMOOTH MANGO COCO": {
                        "esGranel": false,
                        "preuUnitari": 1.6,
                        "quantitat": 1,
                        "categoria": 13,
                        "import": 1.6
                    },
                    "DENTÍFRICO 3 ACTION": {
                        "esGranel": false,
                        "preuUnitari": 1.1,
                        "quantitat": 1,
                        "categoria": 8,
                        "import": 1.1
                    }
                },
                "totalTicket": 9.93,
                "direccioSuper": "C/ SENYERA, 24 46006 València",
                "data": "2025-09-11",
                "hora": "13:02"
            },
            {
                "_id": "3960-024-966478_OP4067558",
                "idUsuari": 2,
                "productesAdquirits": {
                    "MADUIXA": {
                        "esGranel": false,
                        "preuUnitari": 2.55,
                        "quantitat": 1,
                        "categoria": 2,
                        "import": 2.55
                    },
                    "POLLASTRE SENCER NET": {
                        "esGranel": false,
                        "preuUnitari": 6.17,
                        "quantitat": 1,
                        "categoria": 6,
                        "import": 6.17
                    }
                },
                "totalTicket": 20.47,
                "direccioSuper": "C/ NOGUERA PALLARESA, 12 25600 Balaguer",
                "data": "2025-09-05",
                "hora": "19:58"
            },*/

//POST: Es tindrà afegit un sistema de barres per a la card del front on a la dreta tindrem 
// la barra de la compra mes recent i a l'esquerra la barra de la compra menys recent.
function creaIrellenaBarresInflalyzer(llTickets) {
    const contenidorBarres = document.getElementById("wrapperBarres");
    contenidorBarres.innerHTML = "FUNCIONO"; //buido barres de nesis en les cards, si en queden d'anteriors cerques (potser no cal)
                                                        //               aaaa.mm : 
    let oMesos = computaAgregatPerMes_NONUL(llTickets); //a oMesos --> {"2025-3: 342, 2025-4: 212, etc.}". Mesos sense gasto NO APAREIXEN en CLAU ni en valor (0)-
    console.log(oMesos);
}

//PRE: El mateix pre que funcio creaIrellenaBarresInflalyzer().
//POST: Retorno "2025-04: 342, 2025-03: 212, ... etc.}". Es torna un parell clau : valor on les claus son els mesos en format aaaa-mm i els valors
//      son el gasto total agregat per a cada mes.
//      NOTA: Els mesos en els quals NO HI HA COMPRES son meso sque NO APAREIXEN NI en CLAU ni en valor (0).
function computaAgregatPerMes_NONUL(llTickets) {
    
    //OBTINC EL MES ACTUAL EN  ------------------------------------>  aaaa-mm            
    let anyMesActual = aux_gpt_getCurrentDateString();              //2025-11  pots provar amb dates diferents per fer el filtre
    
    //RECORRO TICKETS I FAIG COMPARACIONS PER VEURE SI EL TICKET PERTANY AL MES ACTUAL O NO. SI HI PERTANY L'AFEGEIXO, SI NO 
    //RESTO anyMesActual UN MES I REPETEIXO. FAIG UNA SLIDING WINDOW EN QUE EM VAIG DESPLAÇANT ENDARRERA PER VEURE QUÈ INTRODUEIXO A L'OBJECTE
    //I QUE NO
    let oMesos = {}; 
    for (let i = 0; i < llTickets.length; ++i) {
        ticket = llTickets[i];                                       //                                              aaaa-mm-dd --> aaaa-mm
        anyMesTicket = ticket.data.split("-").slice(0,2).join("-");  //canvio format data del ticket eiminant dia    2025-03-13 --> 2025-03
        
        //Si data (aaaa-mm) anyMesTicket coincideix amb la data (anyMesActual) 
        // que cercquem amb la sliding window que conforma anyMesActual, aleshores anem agregant.
        if (anyMesTicket == anyMesActual) {
            emplenaTotalPerMes(oMesos, anyMesTicket, anyMesActual);
        } else if (anyMesTicket < anyMesActual) { 

            //Si data no coincideix vaig tirant endarrera amb un while fins que coincideixi (i.e. trobem ticket al mes buscat)
            do {
                anyMesActual = generaAnyMes_mesAnterior(anyMesActual); //ARA MIRO EL MES ANTERIOR FINS QUE TROBI UN MES ACTUAL
            } while (anyMesActual < anyMesTicket);
            emplenaTotalPerMes(oMesos, anyMesTicket, anyMesActual);
            
        }
        treuErrorPuntFlotantDeAgregatMensual(oMesos, anyMesActual);
        //AQUI CALDRAI FER ALGO AIXI COM ---> rellenaBarraMes(contenidorBarres);
    }
    return oMesos;    
}




//PRE: oMesos es objecte que conté parells clau valor estil {"aaaa-mm" : 23.32, "aaaa-mm" : 342.03}
//     anyMesTicket: aaaa-mm del mes al que pertany el ticket sent anaitzat
//     anyMesActyak: aaaa-mm del mes al que pertany el mes actual en la sliding window de present cap endarrera
function emplenaTotalPerMes(oMesos, anyMesTicket, anyMesActual) {
    if (anyMesTicket in oMesos) {
        oMesos[anyMesTicket] = oMesos[anyMesTicket] + ticket.totalTicket;
    } else {
        oMesos[anyMesTicket] = ticket.totalTicket;
    }
}


//PRE: oMesos, el diccionari pareus clau aaaa-mm amb valor (Total mes) on cada total mes pot tenir error de punt flotant (agergats decimals ficticis).
//          exemple: oMesos = {2025-07: 60.480000000000004} 
//POST: oMesos, es passa per referencia sense l'error de floating point
//          exemple: oMesos = {2025-07: 60.48}
function treuErrorPuntFlotantDeAgregatMensual(oMesos, anyMesActual) {
    if (oMesos[anyMesActual] !== undefined) {
        oMesos[anyMesActual] = Number(oMesos[anyMesActual].toFixed(2));  // FET Per evitar l'error de floating point que s'arrastra, que es fa amb toFixed(2).
    }
}

//PRE: res
//POST: el mes actual d'avui amb format aaaa-mm
function aux_gpt_getCurrentDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  //const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}`;
}




//INSTRUCCIÓ DONADA A GPT: 
// Fes-me una funcio que donat un string de format aaaa-mm que entri per paramtere retorni 
// l'string que correspon al mes anetetior. Per exemple, 
// Si entra 2025-03 tornara 2025-04. Si entra 2024-01 Sortira 2023-12.
// RESULTAT:
function generaAnyMes_mesAnterior(dataStr) {
    
    let [any, mes] = dataStr.split('-').map(Number); // Separem l'any i el mes
    mes -= 1;     // Restem un al mes

    // Si el mes queda 0, vol dir que passem a desembre de l'any anterior
    if (mes === 0) {
        mes = 12;
        any -= 1;
    }
    // Afegim un 0 davant si el mes és d'un dígit
    let mesStr = mes.toString().padStart(2, '0');
    return `${any}-${mesStr}`;
}







function posaDatesMinimaImaximaTiket(llTickets) {
    //COM QUE ELS ELEMENTS ESTAN ORDENATS PER MONGO DBPODEM ACOTAR EL MES RECENT A PARTIR DELS EXTREMS
    let dataTicketMesRecent = llTickets[0].data;                    //2025-09-11
    let dataTicketMesAntic = llTickets[llTickets.length-1].data;    //2023-09-25

    console.log(dataTicketMesRecent);
    console.log(dataTicketMesAntic);
    //TO DO POSAR A DOM

}