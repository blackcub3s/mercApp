function bannerAlerta(parametresAlerta, tipusAlerta, colorAlerta) {
    const banner = document.getElementById("bannerMissatges");  
    
    banner.style.marginTop = "1em";
    banner.style.fontSize = ".9em";

    if (tipusAlerta == "usuariInexistent") {
        banner.innerHTML = `<p>¡El usuario <strong>${parametresAlerta[0]}</strong> no está registrado! <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "usuariExisteixPeroNoteAccesArecursos") {
        banner.innerHTML = `<p>¡Sin acceso! <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "contrasenyaIncorrecta") {
        banner.innerHTML = `<p>¡La contraseña para la cuenta <strong>${parametresAlerta[0]}</strong> Es incorrecta. <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "bienvenidoAlaApp") {
        banner.innerHTML = `<p> ¡Bienvenido a PirApp! <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;       
    } else if (tipusAlerta == "usuariExisteixError") {
        banner.innerHTML = `<p> !El usuario <strong>${parametresAlerta[0]} ya existe y no puede ser registrado!</p>`;
    } else if (tipusAlerta == "algoFueMalConRegistro") {
        banner.innerHTML = `<p> ¡Hubo un problema inesperado con el registro, probablemente problemas de conexión con la bbdd, vuélvelo a intentar!</p>`;
    } else if (tipusAlerta == "contrasenyaImposible") {
        //AFEGEIXO ELS MISSATGES D'ERROR!
        let strError = "";
        for (let i = 0; i < parametresAlerta.length; ++i) {
            strError = strError + parametresAlerta[i] + '<br>';
        }
        banner.innerHTML = `<p>${strError}<span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
        
        //AFEGEIXO EL TÍTOL ABANS DE TOTS ELS ELEMENTS FILLS DEL BANNER:
        const elH1 = document.createElement("h1");
        elH1.innerHTML = "LA CONTRASEÑA NO ES VÁLIDA:";
        elH1.style.fontSize = "1em";
        banner.insertBefore(elH1, banner.firstChild); // L'AFEGEIXO ABANS DEL PRIMER FILL DE BANNER -JA QUE elH1 es el titol-

    } else if (tipusAlerta == "formatCorreuIncorrecte") {
        banner.innerHTML = `<p>¡El formato del correo no es válido! ¡Revísalo!. <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "correoOcontrasenyaVacios") {
        banner.innerHTML = `<p>¡El correo y/o la contraseña son vacíos! ¡Revísalo!. <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "contrasenyaBuida") {
        banner.innerHTML = `<p>¡La contraseña está vacía! ¡Revísalo!. <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } else if (tipusAlerta == "usuariBuitIMPOSSIBLE") {
        banner.innerHTML = `<p>¡No existe el correo en el sistema! Te devolvemos a la página inicial en <span id="closeBanner" style="cursor:pointer; font-weight:bold;">5 segundos!</span></p>`;
    }  else if (tipusAlerta == "guanyaAccesArecursos") {
        banner.innerHTML = `<p>¡vamos a ganar permisos! <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    }  else if (tipusAlerta == "jaTeniesAcces") { //no es donara mai! a menys que algu modifiqui localStorage a pas2B en variable "emailUsuariNoRecposant" un mail amb permisos 1
        banner.innerHTML = `<p>¡ya tenías permisos! <span id="closeBanner" style="cursor:pointer; font-weight:bold; margin-left:10px;">&times;</span></p>`;
    } 

    


    
    

    


    banner.style.border = "1px solid black";
    banner.style.backgroundColor = colorAlerta;
    banner.style.borderRadius = ".2em";
    banner.style.marginBottom = ".3em";
    banner.style.padding = ".7em .3em .7em .3em";




    //ESBORRAR EL BANNER
    document.getElementById("closeBanner").onclick = function() {
        //banner senzill (un sol missatge) una iteracio.
        //banner complex (un h1 i un p amb varis missatges) dos.
        //resoluble amb un while que pot ampliar més casos particulars futurs.
        let i = 0;
        while (banner.children.length != 0) {
            banner.removeChild(banner.children[0]);
        }
        banner.style.cssText = "";  // Elimino tots els estils
    };
}

