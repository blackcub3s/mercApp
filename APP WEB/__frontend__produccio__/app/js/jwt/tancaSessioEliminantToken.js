//SCRIPT QUE ELIMINA EL TOKEN D'ACCÉS TANCANT LA SESSIÓ (A USAR EN PÀGINES PRIVADES)
//CONJUNTAMENT AMB EL BOTÓ D'ID "botoEliminarToken". També elimina dades sensibles que 
// no han de quedar al navegador ()
document.addEventListener("DOMContentLoaded", () => {
    const botoTancarSessio = document.getElementById("botoEliminarToken");
    botoTancarSessio.addEventListener("click", () => {
        localStorage.clear(); //**** 
    });
});


//****

    //FENT localStroage.clear() faig això realment:

    //localStorage.removeItem("AccessToken");
    //localStorage.removeItem("frequenciesProductes"); //eliminem el diccionari que porta les frequencies de cada producte (clauProducte : frequenciaProducte)
    //localStorage.removeItem("arrDataPreu");
    // [...]