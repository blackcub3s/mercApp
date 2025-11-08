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


//-------VALIDACIONS DTO--------
@Size(max = 3000, message = "El campo de comentarios no puede tener más de 3000 caracteres!") //també va en tàndem a @valid (COMPTE QUE NO CUBREIX EL CAS EN QUE ENTRI null EN COMPTES DE STRING BUIT)
//@Pattern(regexp = REGEX_TEXT_LLARG, message = MISSATGE_ERROR_LLARG)  //m'he carregat la regex perquè no ho emmagatzemo a BBDD
//-------FI VALIDACIONS DTO--------
public @interface TextLlarg {
    String message() default "comentarios no son válidos";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
