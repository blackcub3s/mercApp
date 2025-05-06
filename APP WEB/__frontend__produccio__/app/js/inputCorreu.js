//PER FER QUE EL BOUNDING BOX DE L'INPUT DEL CORREU ES POSI DE COLOR BLAU
//QUAN EL CLIQUES EN TOTS ELS LLOCS ON APAREIX!

//PRE: Existeix un element inputs a la pàgina amb id email i una etiqueta amb id "email-labeleta"
//POST: Element inputs amb id "email" queda pintat en color blau i també l'etiqueta d'id "email-labeleta"
document.addEventListener('DOMContentLoaded', function() {
    
    // Carrego l'element que conté l'email (l'input)
    const emailInput = document.getElementById('email');
    const emailEtiqueta = document.getElementById("email-labeleta");
    
    // Variable per controlar si s'ha activat blur amb error
    let blurActivatAmbError = false;
    let blurActivatAmbCorreuCorrecte = false;
    
    //funcio auxiliar per eliminar ells contorns
    function aux_treuClassesColorsContorns() {
        let classesContorn = emailInput.classList;
        const classes = Array.from(classesContorn);
        for (let i = 0; i < classes.length; ++i) {
            if (classes[i] != "input-border")
                emailInput.classList.remove(classes[i]);
        }
    }

    //funcio que s'activa amb el blur
    function aux_pintaContornIetiqueta_enFuncio_valoracio_correu() {
        if (!correuApte(emailInput.value) && emailInput.value.length > 0) {
            posaContornVermell();   
            posaColorEtiquetaEnVermell();
            posaAlertaLleugerMail();

            blurActivatAmbError = true;
        } else if (correuApte(emailInput.value) && emailInput.value.length > 0) {
            posaContornEnVerd();   
            pintaColorEtiquetaEnVerd();   
            treuAlertaLleugerMail(); 
            blurActivatAmbCorreuCorrecte = true;        
        } else {
            treuContorn();
            treuColorEtiqueta();
            treuAlertaLleugerMail();
            blurActivatAmbError = false;
            blurActivatAmbCorreuCorrecte = false;
        }
    }
    
    //CONTORN DE L'ELEMENT EN BLAU (IGUAL QUE A LA WEB DE GOOGLE)
    function posaContornEnBlau() {
        emailInput.classList.add('input-border-blau');
        emailInput.classList.remove('input-border-default');           
    }
    //ETIQUETA
    function pintaColorEtiquetaEnBlau() {
        emailEtiqueta.style.color = "var(--contorn_blau)";
    }

    function posaContornEnVerd() {
        emailInput.classList.add('input-border-verd');
        emailInput.classList.remove('input-border-default');         
    }
    function pintaColorEtiquetaEnVerd() {
        emailEtiqueta.style.color = "var(--contorn_verd)";
    }



    function posaColorEtiquetaEnVermell() {
        emailEtiqueta.style.color = "red";
    }

    function posaContornVermell() {
        aux_treuClassesColorsContorns();
        emailInput.classList.add('input-border-vermell');
    }

    // FUNCIONS QUE TREUEN:
    //     - EL CONTORN (deixant el gris per defecte)
    function treuContorn() {
        aux_treuClassesColorsContorns();
        emailInput.classList.add('input-border-default');
    }

    //     - EL COLOR D'ETIQUETA (deixant el gris per defecte)
    function treuColorEtiqueta() {
        emailEtiqueta.style.color = "var(--foscMeu)";
    }
    
    function posaAlertaLleugerMail() {
        let elAlerta = document.getElementById("bannerMissatges");
        elAlerta.innerHTML = "<p style='font-size:.8em; color: red'>¡El formato del correo no es correcto!</p>";
    }

    function treuAlertaLleugerMail() {
        let elAlerta = document.getElementById("bannerMissatges");
        elAlerta.innerHTML = "";        
    }
    //PRE: existeix la variable emailInput que conte l'input d'email de la landing page.
    //POST: si s'aplica a la funció emailInput, tindrà els tres esdeveniments (focus, blur i input). 
    //       Tot en una única funció observadora.
    function esdevenimentsCorreu_SIGN_UP(event) {
        switch (event.type) {
            // SI L'INPUT OBTÉ EL FOCUS, POSO EL CONTORN I EL COLOR BLAU NOMÉS SI NO HI HA ERROR
            case "focus":
                if (!blurActivatAmbError && !blurActivatAmbCorreuCorrecte) {
                    posaContornEnBlau();
                    pintaColorEtiquetaEnBlau();
                    treuAlertaLleugerMail();
                }
                break;
                
            // SI L'INPUT PERD EL FOCUS, COMPROVA SI HI HA ERROR
            case "blur":
                aux_pintaContornIetiqueta_enFuncio_valoracio_correu();
                break;
                
            // SI HI HA INPUT I PRÈVIAMENT HI HA HAGUT ERROR, COMPROVA EL VALOR ACTUAL
            case "input":
                if (blurActivatAmbError) {
                    // Si teníamos error (rojo) y ahora el correo es correcto, cambiamos a verde
                    if (correuApte(emailInput.value)) {
                        posaContornEnVerd();
                        pintaColorEtiquetaEnVerd();
                        treuAlertaLleugerMail();
                        blurActivatAmbError = false;
                        blurActivatAmbCorreuCorrecte = true;
                    }
                } else if (blurActivatAmbCorreuCorrecte) {
                    // Si teníamos correo correcto (verde) y ahora hay error, cambiamos a rojo
                    if (!correuApte(emailInput.value) && emailInput.value.length > 0) {
                        posaContornVermell();
                        posaColorEtiquetaEnVermell();
                        posaAlertaLleugerMail();
                        blurActivatAmbError = true;
                        blurActivatAmbCorreuCorrecte = false;
                    }
                }

                if (emailInput.value.length == 0) {
                    
                    treuContorn();
                    posaContornEnBlau();
                    pintaColorEtiquetaEnBlau();
                    treuAlertaLleugerMail();  
                             
                }
                break;
        }
    }

    //emailRegistre es la classe associada a input email de registre. pero no la posarem a l'input mail de login (on no volem marejar a l'usuari
    //amb colors perquè ja té altres missatges d'error de la BBDD).
    if(emailInput.classList.contains("emailRegistre")) {
        emailInput.addEventListener("focus", esdevenimentsCorreu_SIGN_UP);
        emailInput.addEventListener("blur", esdevenimentsCorreu_SIGN_UP);
        emailInput.addEventListener("input", esdevenimentsCorreu_SIGN_UP);
    } else { 
        //CAS en que fem un login per exemple, que no te la classe emailRegistre
        emailInput.addEventListener('focus', () => { // SI L'INPUT OBTÉ EL FOCUS POSO EL CONTORN I EL COLOR BLAU
            posaContornEnBlau();
            pintaColorEtiquetaEnBlau();
        });
        emailInput.addEventListener('blur', () => { // SI L'INPUT PERD EL FOCUS, TREU EL COLOR I EL CONTORN BLAU
            treuColorEtiqueta();
            treuContorn();
        });
    }


});