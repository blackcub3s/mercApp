
//PRE: pujats --> un nombre enter de tickets que s'han pujat al servidor.
//     refusats -> nre tickets que no s'han pujat (no reuneixen requisits del back de fastAPI per ser pujats)
//     ticketsExistents --> els tickets que hi ha dins el sistema d'arxius de fastAPI amb un usuari amb idUsuari determinat dins (ticket --> idUsuari)
//POST: El section de id bannerMissatgeArxiusPujats del pas4_concedirAccesGmail.html inclou l'alerta amb les dades en el dom.
function posaMissatgesAusuari_PASO2_mandanosTickets(pujats, refusats, ticketsExistents) {
    const bannerMissatgesPas4 = document.getElementById("bannerMissatgeArxiusPujats");
    
    bannerMissatgesPas4.innerHTML = `   <ul>
                                            <li>${pujats} subidos | ${refusats} rechazados</li>
                                            <li>has facilitado <b>${ticketsExistents} tickets</b> al sistema</li>
                                        </ul>
                                    `
}

//PRE: ticketsExistents --> els tickets que hi ha dins el sistema d'arxius de fastAPI amb un usuari amb idUsuari determinat dins (ticket --> idUsuari)
//POST: El section de id bannerMissatgeArxiusPujats del pas4_concedirAccesGmail.html inclou l'alerta amb les dades en el dom.
function posaMissatgesAusuari_PASO2_contaTicketsSistemaArxiusServidor(ticketsExistents) {
    const bannerMissatgesPas4 = document.getElementById("bannerMissatgeArxiusPujats");

    if (ticketsExistents != 0) {
        bannerMissatgesPas4.innerHTML = `   <ul>
                                                <li>has facilitado <b>${ticketsExistents} tickets</b> al sistema</li>
                                            </ul>
                                        `
    }


    //HEM DE TREURE EL BORDER QUE SEPARA ELS PUJATS I REFUSATS dels TICKETSEXISTENTS. PERQUÈ EN AQUESTA VISTA
    //NO NECESSITEM UN BORDER DAMUNT DEL LI DELS TICKETS EXISTENTS
    const liTicketsExistents = document.querySelector('#bannerMissatgeArxiusPujats > ul > li:last-child');
    if (liTicketsExistents) {
        liTicketsExistents.style.borderTop = '0px dashed var(--colorTitolsPas4)';
    }
}



function posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(ticketsExistents) {
        const bannerMissatgesPas3_Parseig = document.getElementById("bannerMissatge_PAS3_PARSEIG");

    if (ticketsExistents == 0) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>No subiste tickets! Vuelve al paso 2</li>
                                                </ul>
                                                `
    } else if (ticketsExistents == 1) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>Vuelve al paso 2. Añade más tickets.</li>
                                                </ul>
                                                `
    } else {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>TO DO --> POSA AQUI MISSATGE D EXIT O D ERROR DE PARSEIG.</li>
                                                </ul>`
                                                                                         
    }
    


    //HEM DE TREURE EL BORDER QUE SEPARA ELS PUJATS I REFUSATS dels TICKETSEXISTENTS. PERQUÈ EN AQUESTA VISTA
    //NO NECESSITEM UN BORDER DAMUNT DEL LI DELS TICKETS EXISTENTS
    const liTicketsExistents = document.querySelector('#bannerMissatge_PAS3_PARSEIG > ul > li:last-child');
    if (liTicketsExistents) {
        liTicketsExistents.style.borderTop = '0px dashed var(--colorTitolsPas4)';
    }
    
}