package miApp.app.seguretat.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;


@Component
public class JwtUtil {

    //es la clau privada de 256 bits com a minim per encriptar el token (tant el d'acces com el de refresh)
    //a stackoverflow es pot veure un debat sobre si compartir la mateixa clauSecreta pel d'acces com pel de
    //refresh
    //https://stackoverflow.com/questions/63092165/should-refresh-tokens-in-jwt-authentication-schemes-be-signed-with-a-different-s
    protected static String clauSecreta = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z";


    //METODE QUE PARSEJA EL TOKEN JWT COMPLET.
    //VERIFICA LA FIRMA I EXTRAU LES CLAIMS (parells
    //clau valor en el payload).

    //PRE: un JWT.
    //POST: Si el token no expirad i valid retorna els claims del token
    //      Si el token es invalido (manipulado, firma incorrecta)
    //      tira excepcio (en poden haver varies SignatureException una d elles).
    //      Si el token este expirado, llansa una excepcion ExpiredJwtException. VERIFICAT!
    protected static Claims getClaims(String token) {
        return Jwts.parser()
            .setSigningKey(clauSecreta.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

}








