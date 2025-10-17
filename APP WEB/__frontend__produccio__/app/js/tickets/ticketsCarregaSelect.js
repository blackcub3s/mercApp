document.addEventListener("DOMContentLoaded", (esdev) => {
    const select = document.getElementById("selectProductes");

    const JSONfrecProd = localStorage.getItem("frequenciesProductes");
    const parellsProducteFrequencia = JSON.parse(JSONfrecProd);
    const productes = Object.keys(parellsProducteFrequencia);

    for (let i = 0; i < productes.length; ++i) {
        //Per a cada producte crearé un option de l'estil
        //<option value="BOLSA PLASTICO">BOLSA PLASTICO</option>
        const optionProducte = document.createElement("option");
        optionProducte.value = productes[i];         
        optionProducte.textContent = productes[i];

        select.appendChild(optionProducte);
    }


});