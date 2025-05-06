//EXPRESIONS REGULARS QUE UTILITZEN FUNCIONS  errorsContrasenyaNoApta() I contrasenyaApta()
//(LES HEM POSAT COM A VARIABLE GLOBAL PER NO REPETIR-LES).
//---NOTA: EN LES APIS DEL BACK-END LES POSEM TAMBÉ---
let regEx_nomesLletres_i_nombres_barraBaixa_punts = /^[a-zA-Z0-9àéèíòóú_.ÀÉÈÍÒÓÚñÑçÇ]+$/;
let regEx_min_obligat= /[a-z]|[ç]/;
let regEx_maj_obligat= /[A-Z]|[Ç]/;
let regEx_nre_obligat = /[0-9]/;
let regEx_noEspais_obligat = /^[^\s]+$/;

//PRE: la contraseña que ha introduit l'usuari (no sera mai buida). Les expresions regulars com a variable global.
//POST: un array que mostra què falta que l'usuari canvii perquè
//      la contrasenya sigui correcta segons els estandards de seguritat que hem fixat
function errorsContrasenyaNoApta(contra) {
    arrErrors = [];
    if (!regEx_nomesLletres_i_nombres_barraBaixa_punts.test(contra)) 
        arrErrors.push("La contraseña no puede tener caracteres que no sean alfanuméricos, a excepción de barras bajas '_', barras medias '_' y puntos '.'.");
    if (!regEx_min_obligat.test(contra))
        arrErrors.push("Mínimo hay que poner una minúscula!");
    if (!regEx_maj_obligat.test(contra))
        arrErrors.push("Mínimo hay que poner una mayúscula!");
    if (!regEx_nre_obligat.test(contra))
        arrErrors.push("Mínimo hay que poner un número!");
    if (!regEx_noEspais_obligat.test(contra))
        arrErrors.push("No puede contener espacios!");
    if (!(contra.length >= 8)) //aquesta longitud es la mateix que he posat a l'endpoint d'spring boot (dto contrasenya)
        arrErrors.push(`Mínimo 8 caracteres (¡solo pusiste ${contra.length}!)`);
    if (!(contra.length <= 25)) //aquesta longitud es la mateix que he posat a l'endpoint d'spring boot (dto contrasenya)
        arrErrors.push(`Máximo 25 caracteres (¡Pusiste ${contra.length}!)`);
    console.log(arrErrors);
    return arrErrors;    
}

//PRE: la contraseña que ha introduit l'usuari (no serà mai buida).
//POST: un booleà que mostra si la contrasenya és apta segons 
//      els estandards que hem definit a les regex o no.
function contrasenyaApta(contra) {
    console.log("contra: ", contra);
    return regEx_nomesLletres_i_nombres_barraBaixa_punts.test(contra) && 
        regEx_min_obligat.test(contra) && 
        regEx_maj_obligat.test(contra) && 
        regEx_nre_obligat.test(contra) && 
        regEx_noEspais_obligat.test(contra);
}

//VOLEM LA BOUNDING BOX I L'ETIQUETA DE LA CONTRASENYA CORRECTAMENT MOSTRADES (AQUEST FITXER GENERA ESTILS CSS PROGRAMMATICALLY)
document.addEventListener('DOMContentLoaded', function() {

    //Carrego l'element que conté l'email (l'input)
    const contrasenyaInput = document.getElementById('contrasenya');
    const contrasenyaEtiqueta = document.getElementById("contra-labeleta");

    //FUNCIÓ QUE POSA EL CONTORN DE L'ELEMENT EN BLAU IGUAL QUE A LA WEB DE GOOGLE
    function posaContornEnBlau() {
        contrasenyaInput.classList.add('input-border-blau');
        contrasenyaInput.classList.remove('input-border-default');           
    }

    function pintaColorEtiquetaEnBlau() {
        contrasenyaEtiqueta.style.color = "var(--contorn_blau)";
    }

    function treuColorEtiquetaEnBlau() {
        contrasenyaEtiqueta.style.color = "var(--foscMeu)";
    }

    //FUNCIÓ QUE TREU EL CONTORN DE L'ELEMENT EN BLAU POSANT EL COLOR PER DEFECTE
    function treuContornBlau() {
        contrasenyaInput.classList.add('input-border-default');
        contrasenyaInput.classList.remove('input-border-blau');
    }

    // SI L'INPUT OBTÉ EL FOCUS POSO EL CONTORN I EL COLOR BLAU
    contrasenyaInput.addEventListener('focus', function() {
        posaContornEnBlau();
        pintaColorEtiquetaEnBlau();
    });

    // SI L'INPUT PERD EL FOCUS, TREU EL COLOR I EL CONTORN BLAU
    contrasenyaInput.addEventListener('blur', function() {
        treuContornBlau();
        treuColorEtiquetaEnBlau();
    });
});
