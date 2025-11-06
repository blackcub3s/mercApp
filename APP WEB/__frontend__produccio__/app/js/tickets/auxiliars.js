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
