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
        .then(data => {
            console.log("existents en servidor: "+ data.existentes) //TREU MES DADES
            posaMissatgesAusuari_PASO3_estadoCreacionExtraccionTickets(data.existentes) //funció pertanyent en arxiu en ruta js/pas4/alertesPas4.js
            
            //console.log(`Parseados correctamente: ${data.ticketsParseadosOK} || Fallados en parseo: ${data.ticketsParseadosFAIL} || Subidos a MongoDB: ${data.bbddOK}`);
        })
        .catch(error => {
            console.error('Error en paso3:', error);
        });

    });
});


