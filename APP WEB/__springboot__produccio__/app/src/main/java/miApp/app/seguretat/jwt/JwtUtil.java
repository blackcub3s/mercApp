package miApp.app.seguretat.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;


//NO INSTANCIEM AQUESTA CLASSE MAI. LA FEM ABSTRACTA
@Component
public abstract class JwtUtil {



    //es la clau privada de 256 bits com a minim per encriptar el token (tant el d'acces com el de refresh)
    //veure debat http://bit.ly/3RmBGIK
    protected static String clauSecreta;

    public JwtUtil() {
        this.clauSecreta = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z";
    }

    //METODE QUE PARSEJA EL TOKEN JWT COMPLET.
    //VERIFICA LA FIRMA I EXTRAU LES CLAIMS (parells
    //clau valor en el payload).

    //PRE: un JWT.
    //POST: Si el token no expirad i valid retorna els claims del token
    //      Si el token es invalido (manipulado, firma incorrecta)
    //      tira excepcio (en poden haver varies SignatureException una d elles).
    //      Si el token este expirado, llansa una excepcion ExpiredJwtException. VERIFICAT!
    protected Claims getClaims(String token) {
        return Jwts.parser()
            .setSigningKey(clauSecreta.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

}








