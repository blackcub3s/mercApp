package miApp.app.Usuaris.controlador;

import jakarta.validation.Valid;
import miApp.app.Usuaris.dto.FormulariDTO;
import miApp.app.Usuaris.dtoSORTIDA.FormulariDTOsortida;
import miApp.app.Usuaris.servei.CorreuServei;
import miApp.app.Usuaris.servei.UsuariServei;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


//AQUEST CONTROLADOR ESTÀ PENSAT PER PROCESSAR LES DADES D'ENTRADA QUE VENEN DEL FORMULARI
//DE CONTACTE PRIVAT, QUE TÉ TRES CAMPS: NOM, CORREU I DESCRIPCIO
@RestController
@RequestMapping("/api")
public class FormulariControlador {

    private final CorreuServei correuServei;

    @Autowired
    public FormulariControlador(CorreuServei correuServei) {
        this.correuServei = correuServei;
    }


    /*    Si entra en el DTO d'entrada (pel body) un text de l'estil:

    {
            "nom" : "benito",
            "correuElectronic" : "benitete.majete@gmail.com",
            "comentaris" : "La teva aplicacio es la canya!"
    }

     */

    //     Si l'enviament de mail ha sigut exitós tornemo 200 OK i pel body el seguent dto de sortida
    //
    //          {"mailEnviat" : true,
    //           "missatge" : "Formulario enviado correctamente al correo del admin"}
    //
    //      Si ha fallat l'enviament del mail torno 500 i pel body (et donara error, per exemple si no
    //      carregues les variables d'entorn a .env amb els noms
    //
    //      MAIL_USUARI=EL TEU MAIL D'ON VOLS ENVIAR
    //      MAIL_CONTRA=la contra de 16 digits que obtens de la teva compta del mail d'on vols enviar
    //                                 ( https://myaccount.google.com/apppasswords )
    //
    //          {"mailEnviat" : false,
    //          "missatge : "Error mandando el formulario por correo: TEXTO DEL ERROR"}
    //
    //      Si un camp de nom XXX de FormulariDTO falla les seves validacions, aleshores
    //      tornarà (si n'hi han varis s'acumularàn com a més parells clau-valor) CODI 400 més el
    //      JSON programat al ManejadorExcepcions.java:
    //
    //          {"XXX": "el campo XXX tiene tal problema"}
    //
    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("/formulari")
    public ResponseEntity<FormulariDTOsortida> enviaCorreu(@RequestBody @Valid FormulariDTO dto) {
        FormulariDTOsortida dtoSortida = correuServei.enviaMail(dto);

        if (dtoSortida.isMailEnviat()) {
            return new ResponseEntity<>(dtoSortida, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(dtoSortida, HttpStatus.INTERNAL_SERVER_ERROR);  // 500
        }

    }
}
