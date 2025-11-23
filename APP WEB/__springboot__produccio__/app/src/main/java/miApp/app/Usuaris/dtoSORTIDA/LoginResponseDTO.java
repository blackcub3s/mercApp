package miApp.app.Usuaris.dtoSORTIDA;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  // BRUTAL. AMB JACKSON si accessToken es null, et permet ometre'l i que no surti al JSON de sortida
public class LoginResponseDTO {
    private boolean existeixUsuari;
    private boolean teAccesArecursos;
    private boolean contrasenyaCorrecta;
    
    @JsonProperty("AccessToken") //apareixerà com a AccessToken en el json de sortida per fer match amb el front-end
    private String accessToken;
    
    private UsuariDadesDTO usuari;
}
