
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



function posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(nTicketsExistents) {
    const bannerMissatgesPas3_Parseig = document.getElementById("bannerMissatge_PAS3_PARSEIG");

    if (nTicketsExistents == 0) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>¡No subiste tickets! ¡Vuelve al paso 2 y <b>adjúntalos</b>!</li>
                                                </ul>
                                                `
    } else if (nTicketsExistents == 1) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>Vuelve al <b>Paso 2</b>: añade más tickets</li>
                                                    <li>Consejo: Trata de añadir decenas de ellos en momentos temporales distintos!</li>
                                                </ul>
                                                `
    }
    aux_treuBorde("bannerMissatge_PAS3_PARSEIG");


}

//PRE: totsParsejatsIguardatsBe (boolea): sera false si com a minim un ticket no s'ha parsejat correctament. 
//     nTicketsExistents (int): nre de tickets existents en carpeta d'usuari en el servidor (lo mateix que lo del pas2). 
//     nTicketsBenParsejats (int): nre total de tickets que s'han parsejat correctament, sense errors.
//     nTicketsPersistits (int): nre total de ticlets guardats a la base de dades (seran com a maxim igual al nombre de tickets parsejats correctament)
//POST: la notificació
function posaMissatgesAusuari_PASO3_estatProcessament(totsParsejatsIguardatsBe, nTicketsExistents, nTicketsBenParsejats, nTicketsPersistits) {
    const bannerMissatgesPas3_Parseig = document.getElementById("bannerMissatge_PAS3_PARSEIG");

    if(!totsParsejatsIguardatsBe) {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li><b>${nTicketsPersistits}</b> extraídos de <b>${nTicketsExistents}</b> tickets facilitados!</li>
                                                    <li>(<span style="color: red"><b>${Math.round(100*nTicketsPersistits/nTicketsExistents)}</b>%</span> de éxito)</li>
                                                </ul>
                                                `        
    } else {
        bannerMissatgesPas3_Parseig.innerHTML = `<ul>
                                                    <li>Todos los Tickets parseados y guardados con éxito!</li>
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
