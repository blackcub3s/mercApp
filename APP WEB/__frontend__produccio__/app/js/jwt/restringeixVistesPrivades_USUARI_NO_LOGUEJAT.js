//NOTA: Carreguem aquest script en totes les pàgines privades (dashboard.html i pas4_concedirAccesGmail.html).
//      L'script busca un token d'accés al local storage: si el troba i NO està expirat -o bé no el troba- 
//      (vol dir que l'usuari no està loguejat) redirigeix a l'usuari a la landing page (pas1 o index) impedint-li 
//      veure les pàgines privades. En cas contrari, si el token existís i no estés expirat (vol dir que l'usuari és loguejat) 
//      mostraria cada segon el temps que li queda per expirar al token, en segons. 
//      Un cop expirat el token, evidentment, l'script redirigiria a l'usuari a la landing page (pas1 o index).


function zeroPadding(segons) {
    if (segons <= 9) {
        return  `0${segons}`;
    }
    return `${segons}`;
}

function redirigeix_a_landing() {
    localStorage.removeItem("AccessToken"); //borrem el token 
    window.location.href = "pas1_landingSignUp.html";
}

function mostra_temps_restant(secFinsExpiracio) {
    console.clear();
    console.log(`Queden ${Math.floor(secFinsExpiracio/60)}:${zeroPadding(Math.round(secFinsExpiracio%60))}s\nfins a l'expiracio del token\nd'accés i la redirecció a la\nlanding page.`);
}

//REQUEREIX CARREGAR PRIMER script decodificaJWT.js!!
//exemple de payload --> {  permisos: 0, idUsuari: 3, sub: 'noacces@gmail.com', iat: 1744214393,  exp: 1744215293}
function redirigeixAlandingPage() {
    try {
        const payload = decodificaPayloadJWT(localStorage.getItem("AccessToken"));
        let secFinsExpiracio = payload.exp - (Date.now()/1000); //comparem els dos temps fins la epoch
        let tokenHaExpirat = secFinsExpiracio < 0;

        if (tokenHaExpirat) {
            redirigeix_a_landing();
        } else {
            mostra_temps_restant(secFinsExpiracio);
        }
    } catch (error) { 
        redirigeix_a_landing(); //si salta excepció és que no hi ha token o s'ha manipulat.
    }
}

redirigeixAlandingPage(); //aixi la primera crida a la funcio no espera 1 segon
setInterval(redirigeixAlandingPage, 1000); //repetim crides subsequents cada segon

