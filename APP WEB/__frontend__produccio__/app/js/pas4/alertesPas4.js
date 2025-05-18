
//PRE: pujats --> un nombre enter de tickets que s'han pujat al servidor.
//     refusat -> nre tickets que no s'han pujat (no reuneixen requisits del back de fastAPI per ser pujats)
function posaMissatgesAusuari_PASO2_mandanosTickets(pujats, refusats, ticketsExistents) {
    const bannerMissatgesPas4 = document.getElementById("bannerMissatgeArxiusPujats");
    
    bannerMissatgesPas4.innerHTML = `   <ul>
                                            <li>${pujats} subidos | ${refusats} rechazados</li>
                                            <li>total: <b>${ticketsExistents} tickets</b> facilitados</li>
                                        </ul>
                                    `
    
    

}
