document.addEventListener("DOMContentLoaded", () => {
    let dirHandle = null;

    // --- FUNCIONS PER MOSTRAR BANNERS BONICS ---
    function mostrarBanner(missatge, tipus = "info") {
        const container = document.getElementById("bannerContainer");
        if (!container) return;
        const banner = document.createElement("div");
        banner.className = `banner ${tipus}`;
        banner.textContent = missatge;
        container.appendChild(banner);
        setTimeout(() => banner.remove(), 4000);
    }

    // --- ESCOLLIR CARPETA ---
    const carpetaButton = document.getElementById("escollirCarpetaTicketsFisics");
    carpetaButton.addEventListener("click", async () => {
        try {
            dirHandle = await window.showDirectoryPicker();
            await dirHandle.requestPermission({ mode: "read" }); // reforça permisos
            mostrarBanner(`Carpeta seleccionada: ${dirHandle.name}`, "success");
            console.log("✅ Carpeta seleccionada:", dirHandle.name);
        } catch (err) {
            console.error("❌ Error seleccionant carpeta:", err);
            mostrarBanner("Error al seleccionar la carpeta.", "error");
        }
    });

    // --- OBRIR TICKETS (delegació d'esdeveniments) ---
    document.body.addEventListener("click", async (e) => {
        const button = e.target.closest(".obrirTicketDigitalFisic");
        if (!button) return; // ignorar altres clics

        if (!dirHandle) {
            mostrarBanner("¡Selecciona la carpeta donde descargaste tus tickets digitales de Mercadona primero! ¡Luego podrás abrirlos desde la aplicación!", "error");
            fesUnShake();
            console.warn("⚠️ No hi ha carpeta seleccionada");
            return;
        }

        try {
            const nomFitxer = button.getAttribute("title")?.trim();
            if (!nomFitxer) {
                mostrarBanner("Este botón no tiene nombre de archivo.", "error");
                return;
            }

            console.log("🧾 Intentant obrir fitxer:", nomFitxer);
            const fileHandle = await dirHandle.getFileHandle(nomFitxer);
            const file = await fileHandle.getFile();
            const blobUrl = URL.createObjectURL(file);

            window.open(blobUrl, "_blank");
            mostrarBanner(`Ticket: ${nomFitxer} abierto en nueva pestaña.`, "info");
        } catch (err) {
            console.error("❌ Error obrint ticket:", err);
            if (err.name === "NotFoundError") {
                mostrarBanner("El archivo no se ha encontrado en la carpeta seleccionada.", "error");
            } else {
                mostrarBanner("No se ha podido abrir el archivo: " + err.message, "error");
            }
        }
    });
});


