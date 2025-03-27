package miApp.app.seguretat.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class RefreshToken extends JwtUtil {

    private static int tExpDies = 7;


    // FINALITAT DEL METODE: Refrescar el token d'acces
    //      que genera generaAccesToken().
    //
    //PRE:  String correu electronic d un usuari, temps d'expiracio en
    //      dies i idUsuari de base de dades (respectivament).
    //POST: String token d'acces JWT. En el payload s'incloura idUsuari
    //      identificador de token UUID v4 (mai repetible).
    public static String generaRefreshToken(String correu, int idUsuari) {
        Map<String, Object> dadesExtraApayload = new HashMap<>();
        dadesExtraApayload.put("idUsuari", idUsuari);
        //posar mes dades al payload si es necessari

        return Jwts.builder()
                .setClaims(dadesExtraApayload) //dades customitzades
                .setId(String.valueOf(UUID.randomUUID().toString())) //id unic per a token. Per traSSSabilitat
                .setSubject(correu)           //guardo nom subjecte (dins "sub")
                .setIssuedAt(new Date())      //data creacio
                .setExpiration(new Date(System.currentTimeMillis() + tExpDies*86400*1000))  //expiracio
                .signWith(SignatureAlgorithm.HS256, clauSecreta.getBytes())
                .compact();
    }





    public static void main(String[] args) {

        //ES BYTE A LA BBDD, OKO
        int permisos = 1;


        //GENERO EL REFRESH TOKEN
        String refreshJWT = generaRefreshToken("santo@gmail.com", 2);

        //DONA EXCEPCIO SI EL TOKEN HA EXPIRAT, COMPTE!
        System.out.println("token refresh: \n"+refreshJWT);

        //PROVO D OBTENIR DADES DE LES CLAIMS (DELS PARELLS CLAU VALOR DEL PAYLOAD)
        try {
            System.out.println(JwtUtil.getClaims("eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MSwiaWRVc3VhcmkiOjIsInN1YiI6InNhbnRvQGdtYWlsLmNvbSIsImlhdCI6MTc0MzEwOTY4OCwiZXhwIjoxNzQzMTA5NzQ4fQ.D6pJVH88D6LlW2YKPkvAC5ZIkWLUboazjNbVOROCI3M").get("sub"));
            System.out.println(JwtUtil.getClaims(refreshJWT).get("sub"));
        } catch (ExpiredJwtException e) {
            System.out.println("___Token Expirat___:        "+e.getMessage());
        } catch (Exception e) {
            System.out.println("___Token manipulat___:       "+e.getMessage());
        }

    }
}


/*
REFRESH TOKEN PER A PROVES --> eyJhbGciOiJIUzI1NiJ9.eyJpZFVzdWFyaSI6MiwianRpIjoiYTNmNTk2YmYtZjRkZi00YjljLWI4ZTEtMzM0ODAyZTE5YWM3Iiwic3ViIjoic2FudG9AZ21haWwuY29tIiwiaWF0IjoxNzQzMTA5Njg4LCJleHAiOjE3NDMxOTYwODh9.l_35h4F047xzAoeymU_wYls6vY4qol-ZMb8n6cbr9cE
PAYLOAD D'UN REFRESH TOKEN PER A idUsuari 2 també:

    {
      "idUsuari": 2,
      "jti": "a3f596bf-f4df-4b9c-b8e1-334802e19ac7",
      "sub": "santo@gmail.com",
      "iat": 1743109688,
      "exp": 1743196088
    }
*/