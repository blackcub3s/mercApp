package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.dto.FormulariDTO;
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
    //POST: Si falla l'enviament posem false (si falla serà per algun problema aliè a les dades entrants)
    //      {"mailEnviat" : true} -- si s'ha enviat mail
    //      {"mailEnviat" : false} -- si ha fallat l'enviament del mail
    public HashMap<String, Object> enviaMail(FormulariDTO dto) {


        //AQUI FER ENVIAR CORREU (fer fucnio que torni un boolea o posar-ho aqui)



        boolean mailEnviat = true;
        HashMap<String, Object> mapJSONlike = new HashMap<>();
        mapJSONlike.put("mailEnviat", mailEnviat); //posem el clau valor al hasmap
        return mapJSONlike;
    }
}
