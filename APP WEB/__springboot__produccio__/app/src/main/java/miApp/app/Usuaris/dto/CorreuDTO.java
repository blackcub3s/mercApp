package miApp.app.Usuaris.dto;


import lombok.Getter;
import lombok.Setter;
import miApp.app.utils.validacio.CorreuElectronic;


@Getter @Setter
public class CorreuDTO {

    @CorreuElectronic
    private String correuElectronic;

}