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


//-------VALIDACIONS DTO Alies--------
@Size(max = 30, message = "El campo es demasiado grande! No puede tener más de 30 caracteres!") //també va en tàndem a @valid (COMPTE QUE NO CUBREIX EL CAS EN QUE ENTRI null EN COMPTES DE STRING BUIT)
@Pattern(regexp = REGEX_TEXT_SEGUR, message = MISSATGE_ERROR_TEXT)
//-------FI VALIDACIONS DTO Alies--------
public @interface Alies {
    String message() default "Alias o nombre no válido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
