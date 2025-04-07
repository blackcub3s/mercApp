package miApp.app.Usuaris.dto;


import lombok.Getter;
import lombok.Setter;
import miApp.app.utils.validacio.Contrasenya;
import miApp.app.utils.validacio.CorreuElectronic;

//L'USAREM PER A LA SOLICITUD POST (de modificacio completa de l'usauri) y PUT (de actualitzacio del recurs compplet de l'usuari)
@Getter @Setter
public class LoginDTO {

    @CorreuElectronic
    private String correuElectronic; //posar correuElectronic per consistencia

    @Contrasenya
    private String contrasenya; //posar contrasenya per consistencia un cop canviat al front
}
