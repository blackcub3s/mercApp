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
        creaIrellenaBarresInflalyzer(JSON.parse(localStorage.getItem("totsElsTickets")));  //AQUESTA FUNCIÓ ES LA QUE ENS RELLENARÀ L'INFLALYZER DEL LOCAL STORAGE (SERIALITZO AMB JSON.parse())
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

//POST: Es tindrà afegit un sistema de barres per a la card del front.
function creaIrellenaBarresInflalyzer(llTickets) {
    const contenidorBarres = document.getElementById("wrapperBarres");
    contenidorBarres.innerHTML = "FUNCIONO"; //buido barres de nesis en les cards, si en queden d'anteriors cerques (potser no cal)
    
    /*
    for (let i = 0; i < llTickets.length; ++i) {
        ticket = llTickets[i];
        rellenaBarraMes(contenidorBarres, ticket, llTickets.length, i+1);
    }
    */
}