document.addEventListener("DOMContentLoaded", () => {

    /*Prenc l'icono del clip!*/
    const iconoEngranatge = document.getElementById("botoDemanaExtraccioPdfs");
    iconoEngranatge.addEventListener("click", () => {

        /*Prenc accessToken del local storage de l'usuari*/
        const tokenAcces = localStorage.getItem("AccessToken");

        /*Envio senyal d'inici d'extracció de tickets!*/
        /*NOTA: Uso POST perquè creem recursos en el servidor per seguir principis REST. Tot i així,
        no passo res pel body: s'hagués pogut fer també amb GET*/
        fetch('http://localhost:8000/api/parsea-y-guarda-pdfs-en-bbdd', {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + tokenAcces,
                //NO POSO --> 'Content-Type': 'application/json' | JA QUE NO ENVIO RES PEL BODY EN LA PETICIÓ
                'Accept': 'application/json' 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud devolvió código de error en paso3 : ' + response.status + " || Mensaje de error: " + response.message);
            }
            return response.json();
        })
        .then(data => {                                                                                                                         //nTickets persistits a mongo
            console.log("nTicketsExistents: "+ data.nTicketsExistents); //enter 
            console.log("totsParsejatsIguardatsBe: " + data.totsParsejatsIguardatsBe); //booleà
            console.log("nTicketsBenParsejats: "+data.nTicketsBenParsejats);   //enter
            console.log("nTicketsPersistits: "+data.nTicketsPersistits); //enter 
            console.log("nouTokenAccesPermisosA1"+data.nouTokenAccesPermisosA1); //string AMB EL TOKEN (BORRAR QUEST CONSOOLE LOG)

            //SI HI HA ERRORS ELS IMPRIMIM (AIXI SABREM ELS TICKETS CONGLICTIUS QUE NO S'HAN POGUT GUARDAR I PERSISTIR PER BORRAR-LOS)
            if (data.llErrors.length > 0) {
                llArxiusConflictius = [];
                for (let i = 0; i < data.llErrors.length; ++i) {
                    arxiuConflictiu = data.llErrors[i].archivo.split(/[/\\]/).pop(); //VERSIO ANTIGA PROBABLEMENT NO PORTABLE ENTRE SOs --> arxiuConflictiu = data.llErrors[i].archivo.split("\\")[1];
                    llArxiusConflictius.push(arxiuConflictiu)
                }
                console.log(llArxiusConflictius);
                mostraTitolsTicketsPDF_queHanFallat_en_PAS3(llArxiusConflictius);
            } else {
                console.log("sense errors");
            }


            //SI HI HA MENYS DE DOS TICKETS AL SISTEMA D'ARXIUS NO ANALITZEM RES! NO TINDRIA SENTIT. EN CAS CONTRARI SÍ HO FEM I MOSTREM L'ESTAT DEL PROCESSAMENT
            if (data.nTicketsExistents < 2)
                posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(data.nTicketsExistents) //funció pertanyent en arxiu en ruta js/pas4/alertesPas4.js
            else {
                posaMissatgesAusuari_PASO3_estatProcessament(data.totsParsejatsIguardatsBe, data.nTicketsExistents, data.nTicketsBenParsejats, data.nTicketsPersistits);
            }

            //MANEJEM LA LÒGICA DE REDIRECCIÓ AL DASHBOARD UN COP REBEM LA RESPONSE: POT SRE QUE S'HAGI DE REDIRIGIR O NO
            if (data.nouTokenAccesPermisosA1 == "") {
                alert("NO EXISTEIX NOU TOKEN PERMISSO A U EXPEDIT ENCARA");
            } else {
                if (data.totsParsejatsIguardatsBe) {
                    setTimeout(() => {
                        console.log("No cal fer esperar a l'usuari gairebé. Simplement serà redirigit perquè no hi ha errors.");
                        localStorage.setItem("AccessToken", data.nouTokenAccesPermisosA1);
                        redirigeix_a_dashboard_o_pas4(); // Forço reavaluació immediata: en cas contrari no redirigiria a la pàgina fins fer F5
                    }, 1500); 

                   
                } else {
                    setTimeout(() => {
                        console.log("Fem esperar una mica més perquè l'usuari pugui veure els tickets que han fallat");
                        localStorage.setItem("AccessToken", data.nouTokenAccesPermisosA1);
                        redirigeix_a_dashboard_o_pas4(); // Forço reavaluació immediata: en cas contrari no redirigiria a la pàgina fins fer F5
                        //FUTUR: potser afegir un conte endarrera en el DOM
                    }, 5000); 
                    
                }
            }
            

        })
        .catch(error => {
            console.error('Error en paso3:', error);
        });

    });
});


