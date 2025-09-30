package miApp.app.Usuaris.controlador;

import miApp.app.Usuaris.servei.CorreuServei;
import miApp.app.Usuaris.servei.UsuariServei;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FormulariControlador {

    private final CorreuServei correuServei;

    @Autowired
    public FormulariControlador(CorreuServei correuServei) {
        this.correuServei = correuServei;
    }
}
