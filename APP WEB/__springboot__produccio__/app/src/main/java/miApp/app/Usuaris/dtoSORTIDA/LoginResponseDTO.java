package miApp.app.Usuaris.dtoSORTIDA;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private boolean existeixUsuari;
    private boolean teAccesArecursos;
    private boolean contrasenyaCorrecta;
    
    @JsonProperty("AccessToken") //apareixerà com a AccessToken en el json de sortida per fer match amb el front-end
    private String accessToken;
    
    private UsuariDadesDTO usuari;
}
