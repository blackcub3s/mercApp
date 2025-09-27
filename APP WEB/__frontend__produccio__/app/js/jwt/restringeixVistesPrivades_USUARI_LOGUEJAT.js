//NOTA: Carreguem aquest script en totes les pàgines privades (dashboard o pas4).
//      L'script busca un token d'accés: si el troba i NO està expirat verifica aleshores
//      els permisos i fa el següent:
// 
//          Si permisos es 0 i es dins pas4 --------------> NO FA RES
//          Si permisos es 0 i s'executa dins dashboard --> REDIRIGEIX A pas4
//          Si permisos es 1 o 2 i es dins pas4 ----------> REDIRIGEIX A DASHBOARD
//          Si permisos es 0 i s'executa dins pas4 -------> NO FA RES
//      
//      En cas que no trobi token o no sigui expirat (només anirà mostrant amb console.log l'error de no haver trobat
//      el token).

//REQUEREIX CARREGAR PRIMER script decodificaJWT.js!!
//exemple de payload --> {  permisos: 0, idUsuari: 3, sub: 'noacces@gmail.com', iat: 1744214393,  exp: 1744215293}
function redirigeix_a_dashboard_o_pas4() {
    try {
        const payload = decodificaPayloadJWT(localStorage.getItem("AccessToken"));
        let secFinsExpiracio = payload.exp - (Date.now()/1000); //comparem els dos temps fins la epoch
        let tokenHaExpirat = secFinsExpiracio < 0;

        if (!tokenHaExpirat) {
            let paginaActual = window.location.pathname.split("/")[1]; 
            if (payload.permisos >= 1) {
                if (paginaActual == "pas4_concedirAccesGmail.html") {
                    window.location.href = "dashboard.html";
                }
            } else if (payload.permisos == 0) {
                if (paginaActual == "dashboard.html") { //AFEGIR AQUI LES ALTRES PAGINES PRIVADES QUE AFEGIRÀS!
                    window.location.href = "pas4_concedirAccesGmail.html";
                }
            }
        }
    } catch (error) { 
        console.clear();
        console.log("NO HI HA TOKEN :).");
    }
}

redirigeix_a_dashboard_o_pas4();

