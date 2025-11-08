document.addEventListener("DOMContentLoaded", (esdev) => {
    const selectProducte = document.getElementById("selectProductes");
    const selectSuper = document.getElementById("selectSupermercat");


    // ---------------------------------------
    // --- FILTRE INDEPENDENT 1: productes ---
    // ---------------------------------------

    //QUAN SEL·LECCIONI UN PRODUCTE FARÉ LA CERCA AL LOCAL STORAGE DELS TICKETS QUE 
    //CONTINGUIN AQUEST PRODUCTE. SENSE SOBRECARREGAR, DONCS, LA BASE DE DADES.
    selectProducte.addEventListener("change", (esdevCanvi) => {
        let producteBuscat = selectProducte.value;
        console.log(selectProducte.value); //TO DO

        if (producteBuscat == "perDefecte") { //es quan clico "sin filtro"
            console.log("Recarrego del localStorage");
            location.reload(); //simplement faig una recarrega i activo el fluxe habitual de DOM contentl loaded definit en creaIrellenaCards
        } else {
            //qualsevol altre producte ha de crear un filtre específic obtingut del local storage
            console.log("faig filtre del localStorage per UN producte buscat");
            let tickets = filtraPerProducte(producteBuscat);
            creaIrellenaCards(tickets);
            //-----------------------------------------------------------------------------
            selectSuper.value = "perDefecte"; //fico a valor per defecte dels altres selects (per coherencia)
            //
            //
            //---- SI POSO MES FILTRES AFEGIR ELS CANVIS PER A TOTS ELS ALTRES AQUI -----
            //---------------------------------------------------------------------------
        }
    });



    // -----------------------------------------
    // --- FILTRE INDEPENDENT 2: SUPERMERCATS --
    // -----------------------------------------

    //QUAN SEL·LECCIONI UNA [[ -- DIRECCIÓ DE SUPERMERCAT -- ]] 
    // FARÉ LA CERCA AL LOCAL STORAGE DELS TICKETS GENERATS EN AQUEST ESTABLIMENT.
    selectSuper.addEventListener("change", (esdevCanvi) => {
        let superBuscat = selectSuper.value;
        console.log(selectSuper.value); //TO DO

        if (superBuscat == "perDefecte") { //es quan clico "sin filtro"
            console.log("Recarrego del localStorage");
            location.reload(); //simplement faig una recarrega i activo el fluxe habitual de DOM contentl loaded definit en creaIrellenaCards
        } else {
            //qualsevol altre super ha de crear un filtre específic obtingut del local storage
            console.log("faig filtre del localStorage per UN super buscat");
            let tickets = filtraPerSupermercat(superBuscat);
            creaIrellenaCards(tickets);
            //-----------------------------------------------------------------------------
            selectProducte.value = "perDefecte"; //fico a valor per defecte dels altres selects (per coherencia)
            //
            //
            //---- SI POSO MES FILTRES AFEGIR ELS CANVIS PER A TOTS ELS ALTRES AQUI -----
            //---------------------------------------------------------------------------
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



    //PRE: un string amb la DIRECCIO DEL SUPER BUSCAT en filtre (prove del formulari de filtres, de l'option del value d'un select).
    //POST: un array d'objectes on cada objecte és un ticket dels que surten dins de variable totsElsTickets del localstorage
    //      que CONTÉ el Super Buscat. És a dir, filtra els tickets de compres en un estalbiment concret de mercadona i els retorna en un array.
    function filtraPerSupermercat(direccioSuperBuscada) {

        let llTicketsFiltrats = [];
        let llTickets = JSON.parse(localStorage.getItem("totsElsTickets"));

        //CERQUEM TOTS ELS TIQUETS EN BUSCA DE direccioSuper
        for (let i = 0; i < llTickets.length; ++i) {
            let ticket = llTickets[i];

            //MIRO SI EL TICKET TE DIRECCIO COINCIDENT AMB EL FILTRE
            if (ticket.direccioSuper == direccioSuperBuscada) {
                llTicketsFiltrats.push(ticket);
            }
        }
        return llTicketsFiltrats;   
    }


});