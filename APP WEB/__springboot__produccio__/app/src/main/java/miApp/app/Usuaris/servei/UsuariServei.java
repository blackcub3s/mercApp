package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.dto.*;
import miApp.app.Usuaris.dtoSORTIDA.LoginResponseDTO;
import miApp.app.Usuaris.dtoSORTIDA.RegistreSortidaDTO;
import miApp.app.Usuaris.model.Usuari;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface UsuariServei {

    boolean usuariRegistrat(String eMail);

    boolean usuariTeAcces(String eMail);

    boolean contraCoincideix(String contraPlana, String email);

    int nreUsuarisApp();

    List<String> correusUsuarisApp();

    void imprimirUsuarisPerPantalla();

    boolean afegirUsuari(String correuElectronic, String contrasenyaPlana, String alies, Byte plaSuscripcioActual);

    List<Usuari> trobaTotsElsUsuaris();

    Optional<Usuari> trobaPerId(int id);

    Optional<Usuari> guardaUsuari(UsuariDTO dto);

    boolean esborraUsuari(int id);

    Optional<Usuari> actualitzaUsuari(UsuariDTO dto, int id);

    Optional<Usuari> actualitzaContrasenya(ActualitzaContrasenyaDTO dto, int id);

    String generaTokenAccesPerUsuariParticular(String eMail);

    Usuari trobaUsuariPerEmail(String eMail);

    LoginResponseDTO generaBodyLogin(String eMail, String contraPlana);

    RegistreSortidaDTO registraUsuari(RegistreDTO dto);

    HashMap<String, Object> verificaUsuari(String eMail);

    String obtenirTokenPermisosPerAdashboard(int idUsuari);

}
