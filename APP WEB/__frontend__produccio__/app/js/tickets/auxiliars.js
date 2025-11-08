//PRE: Entrarà un float (e.g. 33.1 o bé 33.11) o un Integer (e.g 33).
//POST: Sortirà un string formatejant punt a coma i assegurant sortida amb dos decimals SEMPRE.
//         es dir, formats  --> ["d,dd"  "dd,dd"  "ddd,dd"] 
// 
// (exemple 33 --> "33,00" | 33.1 --> "33,10" | "33.11 --> 33,11")
function formatejaPreu(nreEntrada) {
    strNre = nreEntrada.toString().replace(".",",");

    // DINS strNre aqui PODEM TROBAR TRES CASOS POSSIBLES. NOMÉS DOS D'ELLS REQUEREIX UN TRACTAMENT ESPECIAL.

    // -- [CAS1] -- 
    // si strNre només es enter (e.g. "33") aleshores str.Nre.split(",") retorna array amb un sol element.
    // En auqest cas afegirem una coma amb dos "00" al final, perquè strNre valgui "33,00". 

    // -- [CAS2] -- 
    //si strNre té un sol decimal (e.g "33,1") aleshores  str.Nre.split(",") retorna un array amb dos elements: ["33","1"]
    //i a més a és el segon element tindrà longitud 1.

    // -- [CAS 3] -- NO CAL TRACTAR

    //si strNre té dos decimals (e.g "33,11") aleshores  str.Nre.split(",") retorna un array amb dos elements: ["33","11"]
    //i a més a és el segon element tindrà longitud 2. NO CAL TRACTAR strNre aqui
    let arr = strNre.split(",")

    if (arr.length == 1) { // -- [CAS1] --
        strNre = strNre + ",00";
    } else if (arr.length == 2 && arr[1].length == 1) { // -- [CAS2] --
        strNre = strNre + "0";
    }

    return strNre;
}

//PRE: string amb data en format (aaaa-mm-dd).
//POST: retorna string amb data en format espanyol (dd/mm/aaaa)
function formatejaData(data) {
    arr = data.split("-");
    return arr[2]+"/"+arr[1]+"/"+arr[0];
}

function fesUnShake() {
    
    const iconoCarpeta = document.getElementById("escollirCarpetaTicketsFisics");

    //TRANSICIO PER SORTIR L'ICONO durant 0.2 segons
    iconoCarpeta.style.transition = "all 0.2s ease-in-out";
    iconoCarpeta.style.transform = "scale(1.5)";
    iconoCarpeta.style.filter = "drop-shadow(3px 6px 1px rgba(0, 0, 0, 0.4))";

    //REESTABLEIXO L'ICONO AL CAP DE 0.2 SEGONS I FAIG DURAR LA TRANSICIÓ DE RETORN 0.2s    
    setTimeout(() => {
        iconoCarpeta.style.transition = "all 0.2s ease-in-out";
        iconoCarpeta.style.transform = "scale(1)";
        iconoCarpeta.style.filter = "drop-shadow(0px 3px 1px rgba(0, 0, 0, 0.4))"; //reestableixo a valor original
    }, 200);
}


//PRE: Una llista de tickets (llista amb objectes de tipus ticket).
//POST: els supermercats diferents que hi ha com a claus i el nombre 
//      d'ocurrències (tickets) de cada supermercat ordenats de més a menys ocurrència tal que així
//          {['C/ Metropolis 24 46001 VALENCIA', 219], ['C/ BLA BLA 6 46680 LLEIDA', 24], ... }
function trobaSupermercats(arrTickets) {
    dSupers = {};
    for (let i = 0; i < arrTickets.length; ++i) {
        let superEnTicket = arrTickets[i].direccioSuper;
        if (!(superEnTicket in dSupers)) {
            dSupers[superEnTicket] = 1;
        } else {
            dSupers[superEnTicket] = dSupers[superEnTicket] + 1;
        }
    }
    return Object.entries(dSupers).sort((a, b) => b[1] - a[1]); //ordeno de més a menys ocurrència
}




function emplenaSelectSupers(idSelect, matriuSupersTickets) {
    const selectSupers = document.getElementById(idSelect);
 
    for (let i = 0; i < matriuSupersTickets.length; ++i) {
        //Per a cada super crearé un option de l'estil
        //<option value="SUPER CARRER COVADONGA">SUPER CARRER COVADONGA</option>

        let supermercat = matriuSupersTickets[i][0];       //  c/valencia
        let freqSuper = matriuSupersTickets[i][1];        // 454   

        const optionSuper = document.createElement("option");
        optionSuper.value = supermercat;       
        
        //al 'usuari li mostro la ciutat al final, completa; i part de l'inici de la direcció perquè ho reconegui juntament amb la frequencia
        optionSuper.textContent = supermercat.slice(0,11) + "  [...]  " + supermercat.slice(supermercat.lastIndexOf(" "), supermercat.length)+` (${freqSuper} tickets)`;

        selectSupers.appendChild(optionSuper);
    }
}