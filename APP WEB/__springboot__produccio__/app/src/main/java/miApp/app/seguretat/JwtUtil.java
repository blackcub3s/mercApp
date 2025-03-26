package miApp.app.seguretat;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

//AQUESTA CLASSE ENS L'HA FET CHATGPT PER PODER MANEJAR TOKENS

@Component
public class JwtUtil {
    private static String clauSecreta = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z"; //es una clau privada

    public static String generateToken(String username, long tempsExpiracioMS) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tempsExpiracioMS))
                .signWith(SignatureAlgorithm.HS256, clauSecreta.getBytes())
                .compact();
    }

    private static Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(clauSecreta.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static void main(String[] args) {
        String strJWT = generateToken("blackcub3s", 10*60);
        System.out.println(strJWT);
    }
}
