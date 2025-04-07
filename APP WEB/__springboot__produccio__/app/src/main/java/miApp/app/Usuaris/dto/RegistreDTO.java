package miApp.app.Usuaris.dto;

import lombok.Getter;
import lombok.Setter;

//simplement extenc LoginDTO (ambdós DTOs usen contrasenya i correu
// i només volem canviar el nom per una qüestió purament semàntica.
@Getter @Setter
public class RegistreDTO extends LoginDTO {}
