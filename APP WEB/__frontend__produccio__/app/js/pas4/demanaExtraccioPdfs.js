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



            if (data.nTicketsExistents <= 2)
                posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(data.nTicketsExistents) //funció pertanyent en arxiu en ruta js/pas4/alertesPas4.js
            else {
                if (data.totsParsejatsIguardatsBe) {
                    alert("to DO");
                    //
                    //xupare aqui token a 1 i posar-lo a local storage
                    //
                }
                posaMissatgesAusuari_PASO3_estatProcessament(data.totsParsejatsIguardatsBe, data.nTicketsExistents, data.nTicketsBenParsejats, data.nTicketsPersistits);
            }

            //console.log(`Parseados correctamente: ${data.ticketsParseadosOK} || Fallados en parseo: ${data.ticketsParseadosFAIL} || Subidos a MongoDB: ${data.bbddOK}`);
        })
        .catch(error => {
            console.error('Error en paso3:', error);
        });

    });
});


