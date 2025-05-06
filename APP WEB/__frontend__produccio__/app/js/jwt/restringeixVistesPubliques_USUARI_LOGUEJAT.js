//NOTA: Carreguem aquest script en totes les pàgines públiques (pas1, pas2A, pas2B, pas2C, pas3).
//      L'script busca un token d'accés: si el troba i NO està expirat redirigeix a l'usuari
//      a les pàgines privades segons convingui (dashboard.html o pas4) en funció dels seus permisos.
//      En cas contrari no fa cap redirecció (només anirà mostrant amb console.log l'error de no haver trobat
//      el token).

//REQUEREIX CARREGAR PRIMER script decodificaJWT.js!!
//exemple de payload --> {  permisos: 0, idUsuari: 3, sub: 'noacces@gmail.com', iat: 1744214393,  exp: 1744215293}
function redirigeixApaginaProtegida() {
    try {
        const payload = decodificaPayloadJWT(localStorage.getItem("AccessToken"));
        let secFinsExpiracio = payload.exp - (Date.now()/1000); //comparem els dos temps fins la epoch
        let tokenHaExpirat = secFinsExpiracio < 0;

        if (!tokenHaExpirat) {
            if (payload.permisos >=1)
                window.location.href = "dashboard.html";
            else if (payload.permisos == 0)
                window.location.href = "pas4_concedirAccesGmail.html";
        }
    } catch (error) { 
        console.clear();
        console.log("NO HI HA TOKEN :). Per tant, no cal fer redirecció\ni deixem l'usuari en aquesta pàgina pública :)");
    }
}

redirigeixApaginaProtegida(); //aixi la primera crida a la funcio no espera 1 segon
setInterval(redirigeixApaginaProtegida, 1000); //repetim crides subsequents cada segon (si queda oberta una pàgina en una altra pestanya ens redirigirà també a la pagina correcta després d'un segon de l'expedicio del token!)