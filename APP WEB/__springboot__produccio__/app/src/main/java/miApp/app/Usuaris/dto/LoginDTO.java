package miApp.app.Usuaris.dto;


import lombok.Getter;
import lombok.Setter;
import miApp.app.utils.validacio.Alies;
import miApp.app.utils.validacio.Contrasenya;
import miApp.app.utils.validacio.CorreuElectronic;
import miApp.app.utils.validacio.PlaSuscripcio;

//L'USAREM PER A LA SOLICITUD POST (de modificacio completa de l'usauri) y PUT (de actualitzacio del recurs compplet de l'usuari)
@Getter @Setter
public class LoginDTO {

    @CorreuElectronic
    private String email; //posar correuElectronic per consistencia

    @Contrasenya
    private String contra; //posar contrasenya per consistencia un cop canviat al front
}
