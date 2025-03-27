package miApp.app.seguretat.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class AccessToken extends JwtUtil {
    private static int tExpM = 10;

    //FINALITAT: Generar un JWT d'acces.
    //
    //PRE: correu usuari, temps d'expiracio en minuts,
    //     idUsuari de la base de dades i un byte amb els permisos.
    //POST: String JWT valid durant els minuts indicats a tExpM.
    //      En el payload incloura: idUsuari, correu i permisos.
    public static String generaAccesToken(String correu, int idUsuari, byte permisos) {
        Map<String, Object> dadesExtraApayload = new HashMap<>();
        dadesExtraApayload.put("permisos", permisos);
        dadesExtraApayload.put("idUsuari", idUsuari);
        //posar mes dades si vols

        return Jwts.builder()
                .setClaims(dadesExtraApayload)   //dades customitzades
                .setSubject(correu)              //guardo nom subjecte (clau "sub")
                .setIssuedAt(new Date())         //data creacio (clau "iat" payload)
                .setExpiration(new Date(System.currentTimeMillis() + (tExpM*60*1000)))  //(clau "exp")
                .signWith(SignatureAlgorithm.HS256, clauSecreta.getBytes())
                .compact();
    }





    public static void main(String[] args) {

        //ES BYTE A LA BBDD, OKO
        int permisos = 1;

        //GENERO EL ACCESS TOKEN
        String accesJWT = generaAccesToken("santo@gmail.com",
                2, //id usuari
                (byte) permisos
        );



        //DONA EXCEPCIO SI EL TOKEN HA EXPIRAT, COMPTE!
        System.out.println("token acces: \n"+accesJWT);


        //PROVO D OBTENIR DADES DE LES CLAIMS (DELS PARELLS CLAU VALOR DEL PAYLOAD)
        try {
            System.out.println(JwtUtil.getClaims(accesJWT).get("sub"));
            System.out.println(JwtUtil.getClaims("eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MSwiaWRVc3VhcmkiOjIsInN1YiI6InNhbnRvQGdtYWlsLmNvbSIsImlhdCI6MTc0MzEwOTY4OCwiZXhwIjoxNzQzMTA5NzQ4fQ.D6pJVH88D6LlW2YKPkvAC5ZIkWLUboazjNbVOROCI3M").get("sub"));
        } catch (ExpiredJwtException e) {
            System.out.println("___Token Expirat___:        "+e.getMessage());
        } catch (Exception e) {
            System.out.println("___Token manipulat___:       "+e.getMessage());
        }

    }
}


/*
TOKEN ACCÉS EXPIRAT PER PROVES --> eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MSwiaWRVc3VhcmkiOjIsInN1YiI6InNhbnRvQGdtYWlsLmNvbSIsImlhdCI6MTc0MzEwOTY4OCwiZXhwIjoxNzQzMTA5NzQ4fQ.D6pJVH88D6LlW2YKPkvAC5ZIkWLUboazjNbVOROCI3M
EL SEU PAYLOAD PER A idUsuari 2 en bbdd:

    {
      "permisos": 1,
      "idUsuari": 2,
      "sub": "santo@gmail.com",
      "iat": 1743109688,
      "exp": 1743109748
    }
*/