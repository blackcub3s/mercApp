package miApp.app.Usuaris.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;


//PAS 1: Faig una Entity per mapejar la taula de la informació que s'emmagatzemarà de l'usuari abans de fer pagament
//       en el moment del procés de registre i posar la contrassenya.
//       (recordem que estem al paradigma ORM que és el que ofereix JPA). En aquest cas JPA no crea
//       la taula de la base de dades ja que hem posat "spring.jpa.hibernate.ddl-auto=validate" a
//       application.properties".
//
//       En aquesta classe també creo els
//       getters, setters i la funció to string per poder imprimir la informació de l'usuari.

@Entity
@Table(name = "usuari")     //indiquem el nom de la taula a sql
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Usuari {


    @Id                                                     //CLAU PRIMARIA
    @GeneratedValue(strategy = GenerationType.IDENTITY)     //ES GENERA INCREMENTALMENT
    @Column(name = "id_usuari")
    private Integer idUsuari;

    @Column(name = "correu_electronic", nullable = false)  //FEM QUE, IGUAL QUE AL ABBDD, SIGUI NOT NULL I INDIQUEM EL NOM A LA BASE DE DADES
    private String correuElectronic;

    @Column(name = "hash_contrasenya", nullable = false)  //emfasitzes que sigui not null i
    private String hashContrasenya;

    @Column(name = "alies")
    private String alies;

    @Column(name = "permisos", nullable = false) //Byte es el tipus de dades de hibernate que mapeja al tipus TINYINT de mysql (nota que tinyint justament acupa un byte jeje)
    private Byte permisos; //0 es persona que nomes tenim mail i contrasenya (pero no te acces a recursos). Si es 1 aleshores te acces als seus recursos. Si es 2 es el superusuari i pot accedir a tot.

    @OneToMany(mappedBy = "usuari", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TiketsPdf> tiketsPdf; // Los tickets asociados a un usuario


    //COMPTE QUE NO HE ACONSEGIT MAPEJAR EL CAMP DE JAVA A LA COLUMNA CORRESPONENT PER A LA DATA DE REGISTRE... AIXI QUE HO DEIXO COMENTAT
    //@Column(name = "data_registre", nullable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    //private Date dataRegistre; // Utilitzo LocalDate per dates sense temps nomes amb format aaaa-mm-dd
    //-----------------------

    // --- NOTA: LOMBOK HA PERMÈS AIXÒ:
    //      ---A) CONSTRUCTORS afegits amb les anotacipons noargscontrustror i allargsconstructor
    //      ---B) GETTERS I SETTERS ESTAN AFEGITS AUTOMATICAMENT AMB FUNCIO DATA --
}
