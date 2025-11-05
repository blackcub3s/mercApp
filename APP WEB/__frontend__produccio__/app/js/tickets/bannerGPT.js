document.addEventListener("DOMContentLoaded", () => {

    let dirHandle;

    // --- FUNCIONS PER MOSTRAR BANNERS BONICS ---
    function mostrarBanner(missatge, tipus = "info") {
        const container = document.getElementById("bannerContainer");
        const banner = document.createElement("div");
        banner.className = `banner ${tipus}`;
        banner.textContent = missatge;
        container.appendChild(banner);

        // Eliminar després de 4 segons
        setTimeout(() => banner.remove(), 4000);
    }

    // --- ESCOLLIR CARPETA ---
    const carpetaButtons = document.getElementById("escollirCarpetaTicketsFisics");
    carpetaButtons.addEventListener("click", async () => {
        try {
            dirHandle = await window.showDirectoryPicker();
            mostrarBanner(`Carpeta seleccionada: ${dirHandle.name}`, "success");
        } catch (err) {
            console.error(err); // usuari pot haver cancel·lat
        }
    });


    // --- OBRIR TICKETS ---
    const ticketButtons = document.getElementsByClassName("obrirTicketDigitalFisic");
    for (let i = 0; i < ticketButtons.length; i++) {
        ticketButtons[i].addEventListener("click", async (esdeveniment) => {
            if (!dirHandle) {
                mostrarBanner("Selecciona una carpeta primer!", "error");
                return;
            }

            try {
                const nomFitxer = esdeveniment.target.title; //agafo el nom del ticket digital original per tal d'obrir-lo si la carpeta ja està seleccionada.
                const fileHandle = await dirHandle.getFileHandle(nomFitxer);
                const file = await fileHandle.getFile();
                const blobUrl = URL.createObjectURL(file);
                window.open(blobUrl, "_blank");
                mostrarBanner(`Obrint ticket: ${nomFitxer}`, "info");
            } catch (err) {
                mostrarBanner("No s'ha pogut obrir: " + err.message, "error");
            }
        });
    }



});
