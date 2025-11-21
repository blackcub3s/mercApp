package miApp.app.Usuaris.dtoSORTIDA;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  // BRUTAL. AMB JACKSON si accessToken es null, et permet ometre'l i que no surti al JSON de sortida
public class RegistreSortidaDTO {
    private boolean existiaUsuari;
    private String accessToken;  // Només apareixerà si no és null (gracies a l'anotacio  JsonInclude.Include.NON_NULL)
    private boolean usuariShaRegistrat;
}

//COMPTE! Jackson força que TOTS els atributs de la classe definida (es vegin o no beneficiats per l'ús de Jakson)
//segueixin convencions dels beans de java, de manera que si poses aquí atribut private String
//AccessToken (amb rimera o primeres lletres majuscules) el que sortirà en la resposta HTTP serà en realitat accessToken.
// MOLT DE COMPTE! perque això, en el refactor de hashmap<String, Object> cap a RegistreSortidaDTO
// ha suposat fer canvis al front-end també a pas3 html perquè l'extracció del valor
// del json que s'envia com a response en /api/registraUsuari al navegador és case sensitive
// i abans l'atribut que s'esperava era AccessToken en comptes de accessToken.

