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

//POST: les cards estaràn posades al DOM de tickets.
function creaIrellenaCards(llTickets) {
    const contenidorCards = document.getElementById("contenidorCartes");
    contenidorCards.innerHTML = ""; //buido tickets cards, si en queden d'anteriors cerques.
    for (let i = 0; i < llTickets.length; ++i) {
        ticket = llTickets[i];
        rellenaCard(contenidorCards, ticket, llTickets.length, i+1);
    }
}

//PRE: - contenidorCards:  el contenidor que contindrà les cartes (que es un section) 
//     - ticket: un object amb la forma d'UND DELS ELEMENTS de la llista/arry definida all PRE de la funcio creaIrellenaCards.
//     - nreTicketsTotalsEnBatch: el nombre de tickets (cards) totals a crear.
//     - nreTicketActual: el contandor ièssim del ticket actual (des de 1 fins a nreTicketsToalsEnBatch, ambdós inclosos)
//POST: afegida al dom una card.
function rellenaCard(contenidorCards, ticket, nreTicketsTotalsEnBatch, nreTicketActual) {
    const unaCard = document.createElement("section");
    unaCard.setAttribute("class", "carta");
    
    
    let nreProdTicket = Object.keys(ticket.productesAdquirits).length;
    let descripcioNprod =  nreProdTicket + " producto";
    
    /*Afegeixo la S si hi ha més d'un producte :D*/
    if (nreProdTicket > 1) 
        descripcioNprod = descripcioNprod + "s";
    
    unaCard.innerHTML = `
                    <!-- section que té grid (section: first child)-->
                    <section>
                            <img src="./img/tickets/iconoCalendar.png" alt="calendari no carrega">
                            <p>${formatejaData(ticket.data)} <span class="horaCompra">${ticket.hora}</span></p>
                        
                            <img src="./img/tickets/dollarIcono.png" alt="dollar no carrega">
                            <p>${formatejaPreu(ticket.totalTicket)} €</p>

                            <img src="./img/tickets/supermercatIcono.png" alt="super no carrega">
                            <p>${ticket.direccioSuper}</p>

                            <img src="./img/tickets/bossaDeLaCompra.png" alt="compra no carrega">
                            <p>${descripcioNprod}</p>
                    </section>

                    <!-- section que té posicionament relatiu en comptes de grid (section:2ndchild -TO DO ENCARA-) -->
                    <section>
                        <img src="./img/tickets/lupa.png" alt="lupa no carrega" class="obrirTicketDigitalFisic" title="${ticket.data.replaceAll("-","")} Mercadona ${formatejaPreu(ticket.totalTicket)} €.pdf">
                        <img src="./img/tickets/desplegaAcordeo.png" alt="dropdown acordeo no carrega">
                        <p class = "informadorNreTicket">${nreTicketActual} de ${nreTicketsTotalsEnBatch}</p>
                    </section>
        `
    contenidorCards.appendChild(unaCard);

}

/*Quan carrega el dom pillem tots els tickets de api/totsElsTickets. Si tornem a carregar ho impedim
i els pillem del localStorage per no sobrecarregar el servidor*/
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

            creaIrellenaCards(tickets.llTickets);  //AQUESTA FUNCIÓ ES LA QUE ENS RELLENARÀ LES CARDS!
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
        creaIrellenaCards(JSON.parse(localStorage.getItem("totsElsTickets")));  //AQUESTA FUNCIÓ ES LA QUE ENS RELLENARÀ LES CARDS DEL LOCAL STORAGE (SERIALITZO AMB JSON.parse())
    }

    






});




