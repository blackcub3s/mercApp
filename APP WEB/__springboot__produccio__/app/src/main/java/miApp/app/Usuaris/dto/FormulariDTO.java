package miApp.app.Usuaris.dto;

import lombok.Getter;
import lombok.Setter;
import miApp.app.utils.validacio.Alies;
import miApp.app.utils.validacio.CorreuElectronic;
import miApp.app.utils.validacio.TextLlarg;

@Getter
@Setter
public class FormulariDTO {

    @Alies
    private String nom;

    @CorreuElectronic
    private String correuElectronic;

    @TextLlarg
    private String comentaris;
}





