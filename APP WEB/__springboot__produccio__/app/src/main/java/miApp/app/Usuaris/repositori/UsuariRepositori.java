//CAL TESTEJAR CLASSE I

package miApp.app.Usuaris.repositori;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import miApp.app.Usuaris.model.Usuari;

import java.util.List;
import java.util.Optional;

//PAS 2: Declarant la interfície UsuariRepositori podem crear automàticament usuaris, actualitzar-los,
//       esborrar-los... per ara l'únic que farem serà trobar-ne un.

//NOTA: US DE CERQUES PARAMETRTITZADES AMB @Param i passant els parametres amb els dos punts a la query junstament
//amb l'anotacio @Query tecnicament fa que tot el que entra com a parametre sigui tractat com un valor i no una
//consulta sql... prevenint ataccs per INJECCIÓ D'SQL (en teoria).
@Repository
public interface UsuariRepositori extends JpaRepository<Usuari, Integer> {

    /* La funció trobaUsuariPerCorreu no cal implementar-la, ja que és una interfície De la implementació de la funció
     se n'ocuparà JPA behind the scenes, nosaltres només li passem la query. Fixa't que */
    @Query(value="SELECT correu_electronic FROM usuari WHERE correu_electronic = :emailete", nativeQuery = true)
    Optional<String> trobaStringUsuariPerCorreu(@Param("emailete") String eMail); //Opcional perque pot ser que estigui buida la consulta i sigui null no usuari.

    //SI TORNA EL HASH DINS L'OPTIONAL ES QUE L'USUARI EXISTEIX. EN CAS CONTRARI NO EXISTEIX.
    @Query(value="SELECT hash_contrasenya FROM usuari WHERE correu_electronic = :emailete", nativeQuery = true)
    Optional<String> trobaHashPerCorreu(@Param("emailete") String eMail);

    /*PER VEURE SI ALGU TE ACCES ALS RECURSOS O NO*/
    @Query(value="SELECT permisos FROM usuari WHERE correu_electronic = :emailete", nativeQuery = true)
    Optional<Byte> trobaSiUsuariTeAccesArecursosDePago_PerCorreu(@Param("emailete") String eMail); //Opcional perque pot ser que estigui buida la consulta i sigui null no usuari.

    @Query(value="SELECT id_usuari FROM usuari WHERE correu_electronic = :correu", nativeQuery = true)
    Integer trobaIdPerCorreu(@Param("correu") String correu);

    @Query(value="SELECT correu_electronic FROM usuari", nativeQuery = true)
    List<String> trobaTotsElsCorreusDelsUsuarisRegistrats();

    @Query(value="SELECT * FROM usuari", nativeQuery = true)
    Usuari[] trobaTotsElsUsuarisRegistrats();

    @Query(value = "SELECT * FROM usuari WHERE id = :idenete", nativeQuery = true)
    Optional<Usuari> obtinguesUsuariPerId(@Param("idenete") Byte id);


}