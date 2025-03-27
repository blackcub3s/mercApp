package miApp.app.seguretat;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@Component
public class JwtUtil {
    //es la clau privada de 256 bits com a minim per encriptar el token
    private static String clauSecreta = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z";


    //FINALITAT: Generar un JWT d'acces.
    //
    //PRE: correu usuari, temps d'expiracio en minuts,
    //     idUsuari de la base de dades i un byte amb els permisos.
    //POST: String JWT valid durant els minuts indicats a tExpM.
    //      En el payload incloura: idUsuari, correu i permisos.
    public static String generaAccesToken(String correu, int tExpM, int idUsuari, byte permisos) {
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


    // FINALITAT DEL METODE: Refrescar el token d'acces
    //      que genera generaAccesToken().
    //
    //PRE:  String correu electronic d un usuari, temps d'expiracio en
    //      dies i idUsuari de base de dades (respectivament).
    //POST: String token d'acces JWT. En el payload s'incloura idUsuari
    //      identificador de token UUID v4 (mai repetible).
    public static String generaRefreshToken(String correu, int tExpDies, int idUsuari) {
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

    //METODE QUE PARSEJA EL TOKEN JWT COMPLET.
    //VERIFICA LA FIRMA I EXTRAU LES CLAIMS (parells
    //clau valor en el payload).

    //PRE: un JWT.
    //POST: Si el token no expirad i valid retorna els claims del token
    //      Si el token es invalido (manipulado, firma incorrecta)
    //      tira excepcio (en poden haver varies SignatureException una d elles).
    //      Si el token este expirado, llansa una excepcion ExpiredJwtException. VERIFICAT!
    private static Claims getClaims(String token) {
        return Jwts.parser()
            .setSigningKey(clauSecreta.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public static void main(String[] args) {

        //ES BYTE A LA BBDD, OKO
        int permisos = 1;

        //GENERO EL ACCESS TOKEN
        String accesJWT = generaAccesToken(
                "santo@gmail.com",
                1, //1 minut
                2, //id usuari
                (byte) permisos
        );

        //GENERO EL REFRESH TOKEN
        String refreshJWT = generaRefreshToken(
                "santo@gmail.com",
                1, //7 dies
                2 //id usuari
        );

        //DONA EXCEPCIO SI EL TOKEN HA EXPIRAT, COMPTE!
        System.out.println("token acces: \n"+accesJWT);
        System.out.println("token refresh: \n"+refreshJWT);

        //PROVO D OBTENIR DADES DE LES CLAIMS (DELS PARELLS CLAU VALOR DEL PAYLOAD)
        try {
            System.out.println(JwtUtil.getClaims(accesJWT).get("sub")); //TOKEN EXPIRAT PER PROVES --> eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MiwianRpIjoiMiIsInN1YiI6ImJsYWNrY3ViM3MiLCJpYXQiOjE3NDMwODg0MTEsImV4cCI6MTc0MzA4ODQ3MX0.EnZfMtmcokoncHx_oT4Q5D49ZkVU9NRuXs14e_Sr9mk
            System.out.println(JwtUtil.getClaims("eyJhbGciOiI1NiJ9.eyJwZXJtaXNvcyI6MiwianRpIjoiMiIsInN1YiI6ImJsYWNrY3ViM3MiLCJpYXQiOjE3NDMwODg0MTEsImV4cCI6MTc0MzA4ODQ3MX0.EnZfMtmcokoncHx_oT4Q5D49ZkVU9NRuXs14e_Sr9mk").get("sub"));
            System.out.println(JwtUtil.getClaims(refreshJWT).get("sub")); //TOKEN EXPIRAT PER PROVES --> eyJhbGciOiJIUzI1NiJ9.eyJpZFVzdWFyaSI6MiwianRpIjoiYjlmNzhiNjgtYjI2Yy00NTA5LWFmYjEtMThiZDU5MGVkYzcwIiwic3ViIjoic2FudG9AZ21haWwuY29tIiwiaWF0IjoxNzQzMDk1MjM4LCJleHAiOjE3NDMxODE2Mzh9.C1UArYlwFyilwshH7H3CxARqgqfer4RUhKAFxdq9F3M
        } catch (ExpiredJwtException e) {
            System.out.println("___Token Expirat___:        "+e.getMessage());
        } catch (Exception e) {
            System.out.println("___Token manipulat___:       "+e.getMessage());
        }

    }
}


/*
PAYLOAD D UN ACCESS TOKEN PER A USUARI DE idUsuari 2 en bbdd
{
  "idUsuari": 2,
  "jti": "b9f78b68-b26c-4509-afb1-18bd590edc70",
  "sub": "santo@gmail.com",
  "iat": 1743095238,
  "exp": 1743181638
}
*/


/*
PAYLOAD D UN ACCES TOKEN PER A USUARI DE idUsuari 2 en bbdd
{
  "idUsuari": 2,
  "jti": "b9f78b68-b26c-4509-afb1-18bd590edc70",
  "sub": "santo@gmail.com",
  "iat": 1743095238,
  "exp": 1743181638
}
*/


