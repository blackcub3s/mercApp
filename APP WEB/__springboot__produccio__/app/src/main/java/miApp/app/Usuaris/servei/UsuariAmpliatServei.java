package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.model.UsuariAmpliat;
import miApp.app.Usuaris.repositori.UsuariAmpliatRepositori;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuariAmpliatServei {

    private final UsuariAmpliatRepositori repoUsuariAmpliat;

    @Autowired
    public UsuariAmpliatServei(UsuariAmpliatRepositori repoUsuariAmpliat) {
        this.repoUsuariAmpliat = repoUsuariAmpliat;
    }

    public void afegirNomIcognoms(Usuari u, String nom, String cognom1, String cognom2) {
        UsuariAmpliat ua = new UsuariAmpliat();
        ua.setIdUsuari(u.getIdUsuari());
        ua.setNom(nom);
        ua.setPrimerCognom(cognom1);
        ua.setSegonCognom(cognom2);
        u.setUsuariAmpliat(ua);
        repoUsuariAmpliat.guardaNomComplet(nom, cognom1, cognom2);

    }






}
