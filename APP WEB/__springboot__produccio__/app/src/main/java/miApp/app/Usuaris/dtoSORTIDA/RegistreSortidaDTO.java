package miApp.app.Usuaris.dtoSORTIDA;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  // BRUTAL. AMB KACKSON si accessToken es null, et permet ometre'l i que no surti al JSON de sortida
public class RegistreSortidaDTO {
    private boolean existiaUsuari;
    private String accessToken;  // Només apareixerà si no és null (gracies a l'anotacio  JsonInclude.Include.NON_NULL)
    private boolean usuariShaRegistrat;
}

