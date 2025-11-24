document.addEventListener("DOMContentLoaded", () => {
    const formulari = document.getElementById("formete");
    formulari.addEventListener("submit", async (esdeveniment) => {
        esdeveniment.preventDefault();
       
        let nom = esdeveniment.target.nombre.value;
        let email = esdeveniment.target.email.value;
        let comentaris = esdeveniment.target.comentarios.value;

        console.log(nom + email + comentaris);

        
        try {
            const bannerEsperes = document.getElementById("bannerEsperes");
            posaPuntsSuspensius(bannerEsperes); //abans d'iniciar la solicitud ja mostrem a l'usuari els punts suspensius

            const resposta = await fetch("http://localhost:8080/api/formulari", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // enviamos JSON
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    nom: nom,
                    correuElectronic: email,
                    comentaris: comentaris
                }),
            });

            const bannerErrors = document.getElementById("bannerErrors");
            netejaImostraBanner(bannerErrors);

            if (!resposta.ok) {
                //POSO ELS ERRORS CONEGUTS DEL BACK-END AL BANNER
                const dadesErrors = await resposta.json(); // esperar resposta JSON del servidor
                posaEstilsBannerError(bannerErrors);
                treuPuntsSuspensius(bannerEsperes);

                /*SERVIDOR APAGAT, PER EXEMPLE*/ 
                if (resposta.status >= 500) { 
                    throw new Error("Error en la petición");
                } else { 
                    /*SERVIDOR ENCÈS, PERÒ PER EXEMPLE CAMPS QUE NO TOLERA EL BACKEND*/ 
                    for (const [campo, mensaje] of Object.entries(dadesErrors)) {
                        const pError = document.createElement("p");
                        pError.textContent = mensaje;
                        bannerErrors.appendChild(pError);
                        console.log(`Campo: ${campo} → Error: ${mensaje}`); //el campo no l'uso perquè surt del back del dto i esta en catala
                    }
                }
                
            } else {

                //SI LA RESPOSTA ES EXITOSA (200 crec):
                treuPuntsSuspensius(bannerEsperes);
                const data = await resposta.json(); // esperar resposta JSON del servidor
                console.log("resposta del servidor:", data);

                formulari.reset(); //borro els camps del formulari

                bannerErrors.innerHTML = "Mensaje enviado con éxito :)"; //netejo missatges anteriors
                posaEstilsBannerExitos(bannerErrors);


                
            }



        } catch (error) {
            console.error("Error:", error);

            //SI EL SERVIDOR ESTA APAGAT (CODI 500 O SUPERIOR EN PRINCIPI)
            bannerErrors.innerHTML = "¡Servidor de correo apagaduuu! ¡Inténtalo en otro momento!"; //netejo missatges anteriors
            posaEstilsBannerError(bannerErrors);
            treuPuntsSuspensius(bannerEsperes);
        }



    }); 
});


function netejaImostraBanner(bannerErrors) {
    bannerErrors.style.display = "block";
    bannerErrors.innerHTML = ""; //netejo missatges anteriors
}

function posaEstilsBannerExitos(bannerErrors) {
    bannerErrors.style.backgroundColor = "#d4edda";
    bannerErrors.style.color = "#155724";
    bannerErrors.style.border = "1px solid #c3e6cb";
}

function posaEstilsBannerError(bannerErrors) {
    bannerErrors.style.backgroundColor = "#f8d7da";
    bannerErrors.style.color = "#721c24";
    bannerErrors.style.border = "1px solid #f5c6cb";
    bannerErrors.style.display = "block";
}


//Animació amb els punts suspensius (Feta per mi, sense històries de IA). Cada 300ms fica un punt
//i en posar 3 punts reseteja a 0 per començar l'animació de nou.
function posaPuntsSuspensius(bannerEsperes) {
    bannerEsperes.style.display = "block";
    let s = "";
    let final = 3;
    idIntervalPuntsContacte = setInterval(() => {
        if (final < 3) {
            s = s + ".";
            bannerEsperes.innerHTML = s;
            final += 1; 
        } else {
            final = 0;
            s = "";
            bannerEsperes.innerHTML = "";
        }

    }, 300);
    
}

//Aturo punts suspensius amb el cliear interval (inicat per posaPunstSuspensius) i també poso a none el display.
function treuPuntsSuspensius(bannerEsperes) {
    bannerEsperes.innerHTML = "";
    clearInterval(idIntervalPuntsContacte);
    bannerEsperes.style.display = "none";
}



