document.addEventListener("DOMContentLoaded", (esdev) => {
    const select = document.getElementById("selectProductes");

    //QUAN SEL·LECCIONI UN PRODUCTE FARÉ LA CERCA AL LOCAL STORAGE DELS TICKETS QUE 
    //CONTINGUIN AQUEST PRODUCTE. SENSE SOBRECARREGAR, DONCS, LA BASE DE DADES.
    select.addEventListener("change", (esdevCanvi) => {
        let producteBuscat = select.value;
        console.log(select.value); //TO DO

        if (producteBuscat == "perDefecte") { //es quan clico "sin filtro"
            console.log("Recarrego del localStorage");
            location.reload(); //simplement faig una recarrega i activo el fluxe habitual de DOM contentl loaded definit en creaIrellenaCards
        } else {
            //qualsevol altre producte ha de crear un filtre específic obtingut del local storage
            console.log("faig filtre del localStorage");
            let tickets = filtraPerProducte(producteBuscat);
            creaIrellenaCards(tickets);
        }
    });


    //PRE: un string amb el producte buscat (prove del formular ide filtres).
    //POST: un array d'objectes on cada objecte és un ticket dels que surten dins de variable totsElsTickets del localstorage
    //      que CONTÉ el producte Buscat. És a dir, filtra els tickets que contenen el producteBuscat i els retorna en un array.
    function filtraPerProducte(producteBuscat) {

        let llTicketsFiltrats = [];
        let llTickets = JSON.parse(localStorage.getItem("totsElsTickets"));

        //CERQUEM TOTS ELS TIQUETS EN BUSCA DE producteBuscat
        for (let i = 0; i < llTickets.length; ++i) {
            let ticket = llTickets[i];
            let llproductesEnTicket = Object.keys(ticket.productesAdquirits);

            //AMB EL METODE INCLUDES MIREM SI EL PRODUCTE BUSCAT ESTÀ DINS LA LLISTA DE PRODUCTES
            //SI I NOMÉS SI HI ÉS, LAFEGIM A llTicketsFiltrats. 
            if (llproductesEnTicket.includes(producteBuscat)) {
                llTicketsFiltrats.push(ticket);
            }
        }
        return llTicketsFiltrats;   
    }
});