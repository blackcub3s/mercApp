package miApp.app.utils.validacio;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static miApp.app.utils.validacio.ValidacionsUsuari.*;
import static miApp.app.utils.validacio.ValidacionsUsuari.MISSATGE_ERROR_CONTRASENYA;

@Constraint(validatedBy = {}) // No es necesario un validador personalizado porque usamos anotaciones estándar
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)


//-------VALIDACIONS DTO Contrasenya--------
@Size(min = TAMANY_MINIM_CONTRASENYA, max = TAMANY_MAXIM_CONTRASENYA, message = MISSATGE_ERROR_TAMANY) //també va en tàndem a @valid (COMPTE QUE NO CUBREIX EL CAS EN QUE ENTRI null EN COMPTES DE STRING BUIT)
@NotBlank(message = MISSATGE_NOT_BLANK_GENERIC)     //@NotBlank VA EN TÀNDEM A @valid dins del paràmetre del controlador de la funció actualitzaContrasenya
@Pattern(regexp = REGEX_CONTRASENYA, message = MISSATGE_ERROR_CONTRASENYA)
//-------FI VALIDACIONS DTO Contrasenya--------
public @interface Contrasenya {
    String message() default "Contrasenya no válida";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
