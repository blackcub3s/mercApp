package miApp.app.Usuaris.dtoSORTIDA;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuariDadesDTO {
    private int idUsuari;
    private String alies;
    private byte permisos;
}
