package miApp.app.Usuaris.controlador;

import jakarta.validation.Valid;
import miApp.app.Usuaris.dto.FormulariDTO;
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

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("/formulari")
    public ResponseEntity<HashMap<String, Object>> enviaCorreu(@RequestBody @Valid FormulariDTO dto) {
        String eMail = dto.getCorreuElectronic();
        HashMap<String, Object> mapJSONlike = correuServei.enviaMail(dto);
        return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);  //torno la response
    }
}
