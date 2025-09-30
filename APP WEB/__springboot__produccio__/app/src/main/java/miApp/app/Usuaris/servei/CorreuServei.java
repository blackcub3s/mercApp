package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.repositori.UsuariAmpliatRepositori;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
