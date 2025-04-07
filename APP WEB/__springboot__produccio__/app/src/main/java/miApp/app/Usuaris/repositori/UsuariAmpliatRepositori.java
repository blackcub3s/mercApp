//CLASSE FET PER XAT GPT. CAL TESTEJARLA

package miApp.app.Usuaris.repositori;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import miApp.app.Usuaris.model.UsuariAmpliat;

import java.util.Optional;


@Repository
public interface UsuariAmpliatRepositori extends JpaRepository<UsuariAmpliat, Integer> {

    @Modifying
    @Query(value = "INSERT INTO usuari_ampliat (nom, primer_cognom, segon_cognom) VALUES (:nom, :cog1, :cog2)", nativeQuery = true)
    void guardaNomComplet(@Param("nom") String nom, @Param("cog1") String cog1, @Param("cog2") String cog2);

}
