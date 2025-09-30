document.addEventListener("DOMContentLoaded", () => {
    //const campNom = document.getElementById("nombre");  //PER SI MAI EL VOLS POSAR
    const campEmail = document.getElementById("email");
    campEmail.value = decodificaPayloadJWT(localStorage.getItem("AccessToken")).sub;
});