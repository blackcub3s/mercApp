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
public class TokenFix extends JwtUtil {


    public TokenFix() {}


    // FINALITAT DEL METODE: generar un token que no canvia i que guardarem dins restclient.auth.token=
    // per poder-lo enviar amb RestClient cap al backend secundari. El token generat NO EXPIRARA MAI.
    public String generaTokenFix() {
        Map<String, Object> dadesExtraApayload = new HashMap<>();
        dadesExtraApayload.put("origen", "back-end spring boot");
        //posar mes dades al payload si es necessari

        return Jwts.builder()
                .setClaims(dadesExtraApayload) //dades customitzades
                .setIssuedAt(new Date())      //data creacio
                .signWith(SignatureAlgorithm.HS256, clauSecreta.getBytes())
                .compact();
    }
}