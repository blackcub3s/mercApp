
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
    aux_treuBorde("bannerMissatgeArxiusPujats");
}



function posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(ticketsExistents) {
    const bannerMissatgesPas3_Parseig = document.getElementById("bannerMissatge_PAS3_PARSEIG");

    if (ticketsExistents == 0) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>¡No subiste tickets! ¡Vuelve al paso 2 y <b>adjúntalos</b>!</li>
                                                </ul>
                                                `
    } else if (ticketsExistents == 1) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>Vuelve al <b>Paso 2</b>: añade más tickets</li>
                                                    <li>Consejo: Trata de añadir decenas de ellos en momentos temporales distintos!</li>
                                                </ul>
                                                `
    }
    aux_treuBorde("bannerMissatge_PAS3_PARSEIG");


}

//PRE: processatsCorrectaent (boolea): sera false si com a minim un ticket no s'ha parsejat correctament. 
//     existents (int): nre de tickets existents en carpeta d'usuari en el servidor (lo mateix que lo del pas2). 
//      ticketsBenParsejatsIpersistits (int): nre total de tickets que s'han parsejat i guardat amb èxit en la bbbdd.
//POST: la notificació
function posaMissatgesAusuari_PASO3_estatProcessament(processatsCorrectament, existents, ticketsBenParsejatsIpersistits) {
    const bannerMissatgesPas3_Parseig = document.getElementById("bannerMissatge_PAS3_PARSEIG");

    if(!processatsCorrectament) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>existentes: ${existents} | fallados: ${existents - ticketsBenParsejatsIpersistits}</li>
                                                    <li>Parseados: ${ticketsBenParsejatsIpersistits}</li>
                                                </ul>
                                                `        
    } else {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>Todos los Tickets parseados con éxito!</li>
                                                </ul>
                                                `         
    }
    aux_treuBorde("bannerMissatge_PAS3_PARSEIG");
    
    
}

//HEM DE TREURE EL BORDER QUE SEPARA ELS PUJATS I REFUSATS dels TICKETSEXISTENTS. PERQUÈ EN AQUESTA VISTA
//NO NECESSITEM UN BORDER DAMUNT DEL LI DELS TICKETS EXISTENTS
function aux_treuBorde(idBanner) {
    const liTicketsExistents = document.querySelector(`#${idBanner} > ul > li:last-child`);
    if (liTicketsExistents) {
        liTicketsExistents.style.borderTop = '0px dashed var(--colorTitolsPas4)';
    }
    
}
