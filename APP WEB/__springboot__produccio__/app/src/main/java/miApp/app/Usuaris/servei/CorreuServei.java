package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.dto.FormulariDTO;
import miApp.app.Usuaris.dtoSORTIDA.FormulariDTOsortida;
import miApp.app.Usuaris.repositori.UsuariAmpliatRepositori;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CorreuServei {
    //NOTA: Autowired es millor posar-lo en el constructor que en l'atribut i fer l'atribut constant amb final
    private final UsuariRepositori repoUsuari;
    private final UsuariAmpliatRepositori repoUsuariAmpliat;

    @Autowired   //injecció de dependència, portem el repositori per poder usar la funcio trobaUsuariPerCorreu
    public CorreuServei(UsuariRepositori repoUsuari, UsuariAmpliatRepositori repoUsuariAmpliat) {
        this.repoUsuari = repoUsuari;
        this.repoUsuariAmpliat = repoUsuariAmpliat;
    }

    //PRE: Les dades d'entrada en el DTO (el dto te ja dades valides en l'entrada! nom, mail i comentari del formualri)
    //POST: Si s'ha enviat el mail torno true i si no false a traves del FormulariDTOSortida. també un missatge adient.
    public FormulariDTOsortida enviaMail(FormulariDTO dto) {
        try {

            // AQUI FER ENVIAR CORREU
            // ------ TO DO ------
            // FI ENVIAMENT CORREU


            return new FormulariDTOsortida(true, "Formulario enviado correctamente al correo del admin");
        } catch (Exception e) {
            return new FormulariDTOsortida(false, "Error mandando el formulario por correo: " + e.getMessage());
        }
    }



}
