document.addEventListener("DOMContentLoaded", (esdev) => {
    emplenaSelectProductes();
    emplenaSelectSupermercat();
});

//PRE: Existeix l'element select amb id selectProductes i existeix un item al local storage amb frequenciesProductes
//      (es el que es crea en entrar a la part privada, amb el dasboard; en accedir a pàgina tickets ja el tenim).
//POST: S'han poblat d'options el select amb id seleectProductes.
function emplenaSelectProductes() {
    const select = document.getElementById("selectProductes");

    const JSONfrecProd = localStorage.getItem("frequenciesProductes");
    const parellsProducteFrequencia = JSON.parse(JSONfrecProd);
    const productes = Object.keys(parellsProducteFrequencia);
    const frequencies = Object.values(parellsProducteFrequencia);

    for (let i = 0; i < productes.length; ++i) {
        //Per a cada producte crearé un option de l'estil
        //<option value="BOLSA PLASTICO">BOLSA PLASTICO</option>
        const optionProducte = document.createElement("option");
        optionProducte.value = productes[i];         
        optionProducte.textContent = productes[i]+`      (en ${frequencies[i]} ticket/s)`;

        select.appendChild(optionProducte);
    }
}


//PRE: Existeix l'element select amb id [selectSupermercat] i existeix un item al local storage amb nom totsElsTickets
//     que conté tots els tickets o els contindrà en breu.
//POST: S'han poblat d'options amb els diferents supermercats disponibles en el select.

//NOTA: totsElsTickets es carrega al localStorage quan es carreguen les cards. Però inicialment pot ser que encara no estigui
//      carregat. Com que localStorage es sincrone però necessito asincronia fem servir setInterval amb un interval petit per
//      trobar ràpidament les dades.
function emplenaSelectSupermercat() {

    const intervalSelect = setInterval(() => {
        let JSONtickets = localStorage.getItem("totsElsTickets");

        //Si no és dins segueixo buscant, i només paro l'interval amb clearInterval quan trobi
        //contingut dins localStorage.getItem("totsElsTickets") (o sigui, quan no sigui nul)
        if (JSONtickets != null) {
            clearInterval(intervalSelect);              // para l'interval perquè ja ha trobat els tickets
            const arrTickets = JSON.parse(JSONtickets); //objecteTickets te estructura de l'estil veure creaIrellenaCards.js linies 1 a 50
            let matriuSupersTickets = trobaSupermercats(arrTickets); //matriuSupersTickets --> [["carrer valencia", 454], ["carrer barcelona", 42]] array d'arrays
            emplenaSelectSupers("selectSupermercat", matriuSupersTickets); //empleno el select dels supers
        }

    }, 100);


    
}
