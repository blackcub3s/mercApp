document.addEventListener("DOMContentLoaded", () => {

    /*Prenc l'icono del clip!*/
    const iconoAdjuntaTickets = document.getElementById("labelIconoPujar");

    iconoAdjuntaTickets.addEventListener("click", () => {
        console.log("icono clicat!");

        /*PRIMER DE TOT. PUJO ELS PDFS */
        const input = document.querySelector('#inputOcultEntradesPDFs');

        /*EVALUO SI L'USUARI HA SELECCIONAT ELS ARXIUS QUAN HI HAGI HAGUT UN CANVI
        EN L'INPUT! SI NO, NO FAIG SOLICITUD FETCH! AIXI M'ESTALVIO UN BOTO DE PUJAR I 
        UN BOTÓ DE SUBMIT DE FORMULARI. TOT AMB L'ICONO DEL CLIP!*/
        input.addEventListener("change", () => {

            const arxiusPujats = input.files;
            if (arxiusPujats.length === 0) {
                console.log("No s'han sel·leccionat arxius!");
                return;
            }


            const dadesFormulari = new FormData();
            for (let i = 0; i < arxiusPujats.length; i++) {
                dadesFormulari.append('arxius', arxiusPujats[i]); // "arxius" es el campo que espera FastAPI
                console.log(arxiusPujats[i].name);
            }

            /*EN SEGON LLOC: OBTINC EL TOKEN D'ACCÉS QUE TINC GUARDAT AL LOCAL STORAGE! */
            const tokenAcces = localStorage.getItem("AccessToken");


            /*ENVIO ELS PDFS!*/
            fetch('http://localhost:8000/api/subir-tickets-pdf', {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + tokenAcces
                },
                body: dadesFormulari
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status + " || Missatge: " + response.message);
                }
                return response.json();
            })
            .then(data => {
                posaMissatgesAusuari_PASO2_mandanosTickets(data.subidos, data.rechazados, data.existentes)
                console.log(`Subidos: ${data.subidos} || Rechazados: ${data.rechazados} || existentes: ${data.existentes}`);
            })
            .catch(error => {
                console.error('Error al subir los PDFs:', error);
            });

        });
    });
});

