package miApp.app.utils.validacio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

//VALIDO ELS CAMPS DE LA TAULA USUARI
public class ValidacionsUsuari {

    //validació camp contrasenya (TAMBÉ CAL POSAR el @not null i el size min=8 i max=25, no te n'oblidis),
    public static final String REGEX_CONTRASENYA =  "^(?=[a-zA-Z0-9àéèíòóú_.ÀÉÈÍÒÓÚñÑçÇ]+$)(?=.*[a-zç])(?=.*[A-ZÇ])(?=.*\\d)(?!.*\\s).{8,25}$";
    public static final String MISSATGE_ERROR_CONTRASENYA = "¡La contraseña debe contener al menos una minúscula, una mayúscula, un número y no puede contener espacios! Se admiten puntos y barras bajas pero no otros caracteres";
    public static final int TAMANY_MINIM_CONTRASENYA = 8;  //per a @Size
    public static final int TAMANY_MAXIM_CONTRASENYA = 25; //per a @Size
    public static final String MISSATGE_ERROR_TAMANY = "¡La contraseña debe tener entre 8 y 25 caracteres!"; //per a @Size


    //MISSATGE GENÈRIC ASSOCIAT A ANOTACIÓ @NOT_BLANK PER LES VALIDACIONS D'USUARI QUE FACIS
    public static final String MISSATGE_NOT_BLANK_GENERIC = "¡El campo no puede estar vacío, ni ser null! Comprueba que hayas usado la clave correcta en el JSON de entrada a la api!";

    //REGEX DE VALIDACIO GENÈRICA DE CAMPS STRING (PERMET LLETRES NORMALS, barrabaixa, punt, espais, i string buit
    public static final String REGEX_TEXT_SEGUR = "^[a-zA-Z0-9àéèíòóú_.ÀÉÈÍÒÓÚñÑçÇ ]*$";
    public static final String MISSATGE_ERROR_TEXT = "Se admiten puntos y barras bajas pero no otros caracteres raros!";

    //REGEX DE VALIDACIO DE CAMPS D'ENTRADA LLARGS (COMENTARIS EN UN FORMULARI)
    public static final String REGEX_TEXT_LLARG = "^[a-zA-Z0-9àéèíòóú_.,:;@?¿!¡*ÀÉÈÍÒÓÚñÑçÇ() \\-\\[\\]]*$";
    public static final String MISSATGE_ERROR_LLARG = "Hay Caracteres no admitidos en el campo de comentarios del formulario!";

    //VALIDACIO CAMP CORREU ELECTRONIC
    public static final int TAMANY_MAXIM_EMAIL = 70;
    public static final String MISSATGE_ERROR_TAMANY_EMAIL = "El tamaño del correo electrónico no puede superar 70 caracteres!";
    public static final String REGEX_EMAIL = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"; //by xat gpt (he osat la equivalent en javascript, en teoria, al front)
    public static final String MISSATGE_ERROR_CORREU = "El correo electrónico no es válido!";

}
