document.addEventListener("DOMContentLoaded", () => {
    /*AQUEST ENDPOINT CONTA QUANS PDFS HI HA PER A L'USUARI AMB idUsuari FACILITAT PEL TOKEN D'ACCÉS
    DINS DEL DIRECTORIO tickets --> idUsuari*/
    fetch('http://localhost:8000/api/conta-pdfs-servidor', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("AccessToken"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'    
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la sol·licitud: ' + response.status + " || Missatge: " + response.message);
        }
        return response.json();
    })
    .then(data => {
        posaMissatgesAusuari_PASO2_contaTicketsSistemaArxiusServidor(data.existentes) //funcio dins alertes pas4
        console.log(`existentes: ${data.existentes}`); //SORTIDES DE DADES VISIBLES PER POSTMAN O PER UI SEMPRE EN CASTELLÀ PER CONSISTÈNCIA
    })
    .catch(error => {
        console.error('Error al llegir els PDFs:', error);
    });
})