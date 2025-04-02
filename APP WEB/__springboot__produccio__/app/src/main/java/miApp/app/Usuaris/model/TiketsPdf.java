package miApp.app.Usuaris.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Blob;



//Faig una Entity per mapejar la taula de la informació que s'emmagatzemarà en pdf si l'usuari ho demana,

@Entity
@Table(name = "tikets_pdf")     //indiquem el nom de la taula a sql
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TiketsPdf {

    @Column(name = "nre_factura_simplificada", nullable = false) //Byte es el tipus de dades de hibernate que mapeja al tipus TINYINT de mysql (nota que tinyint justament acupa un byte jeje)
    private Integer nreFacturaSimplificada; //0 es persona que nomes tenim mail i contrasenya (pero no te acces a recursos). Si es 1 aleshores te acces als seus recursos. Si es 2 es el superusuari i pot accedir a tot.

    @ManyToOne // Molts tikets a un usuari!
    @JoinColumn(name = "id_usuari", referencedColumnName = "id_usuari", nullable = false) // Definir clave foránea
    private Usuari usuari; // Relación con la entidad Usuari (se debe crear la entidad Usuari)

    @Column(name = "tiket_pdf", nullable = false)
    private Blob tiketPdf;
}
