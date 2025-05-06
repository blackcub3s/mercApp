//SCRIPT QUE ELIMINA EL TOKEN D'ACCÉS TANCANT LA SESSIÓ (A USAR EN PÀGINES PRIVADES)
//CONJUNTAMENT AMB EL BOTÓ D'ID "botoEliminarToken"
document.addEventListener("DOMContentLoaded", () => {
    const botoTancarSessio = document.getElementById("botoEliminarToken");
    botoTancarSessio.addEventListener("click", () => {
        localStorage.removeItem("AccessToken");
    });
});