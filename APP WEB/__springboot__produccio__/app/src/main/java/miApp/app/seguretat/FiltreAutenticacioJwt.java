package miApp.app.seguretat;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import miApp.app.seguretat.jwt.AccessToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FiltreAutenticacioJwt extends OncePerRequestFilter {

    private final AccessToken accessToken;

    //INJECTO LA DEPENDENCIA DE LA CLASSE QUE HEM FET AccessToken
    public FiltreAutenticacioJwt(AccessToken accessToken) {
        this.accessToken = accessToken;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        //el header que entra amb el fetch de javascript o el bearer toeken de postman
        String authHeader = request.getHeader("Authorization");

        //Si la capçalera o HEADER de la solicitud HTTP es correcta ha de tenir
        // "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5c..." i no ser nul·la, clar!
        //(so no compleix aquest aspecte, la solicitud continua sense autenticacio i para la funcio)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response); //deixa que la solicitud continui sense autenticacio
            return;
        }

        String token = authHeader.substring(7); //treu el "Bearer " del principi i quedat amb el JWT

        try {
            //treiem el payload del token.
            // Si el JWT hagues EXPIRAT .-> la funcio tira una excepcio ExpiredJwtException.
            // Si el JWT fos INVALID -----> la funcioo tira una excepcio general respectivament
            // (fem catch a sota)
            Claims claims = accessToken.getClaims(token);

            String username = claims.getSubject(); //lo que en el token era "sub", pero no te massa utilitat.
            Integer permisos = (Integer) claims.get("permisos"); //0 si no te permis. 1 si té permís per accedir a lo del propi usuari. 2 si pot fer-ho tot i es super usuari
            Integer idUsuari = (Integer) claims.get("idUsuari"); //id de l'usuari en la BBDD

            // Creo autoritat basada en permisos
            //   "ROLE_ADMIN" per a permisos = 2
            //   "ROLE_USER" per a permisos = 1
            String role;
            if (permisos == 2) {
                role = "ROLE_ADMIN";
            } else if (permisos == 1) {
                role = "ROLE_USER";
            } else {
                role = null;
            }

            //NOMES MIRO AUTENTICACIO SI HI HA UN ROL VALID (SI ES NULL NO HI HA ROL)
            if (role != null) {

                //QUAN S'AUTENTICA UN USUARI EN EL FILTRE JWT CAL CREAR UN OBJECTE DE TIPUS
                // UsernamePasswordAuthenticationToken. Aquest objecte te els seguents tres parametres:
                //
                // - principal: li passem idUsuari (el principal funcionara en fer
                //          #id = principal en el controlador, restringint aixi usuari que nomes pugui accedir a recursos del seu ID).
                // - credentials: es posa a null pq usuari ja esta autenticat a hores d ara (gracies al JWT!) que no ha generat excepcio
                //                no cal una contrasenya a cada solicitud, per aixo es null.
                // - Authorities: llista de rols/permisos de l'usuari: Collections.singletonList(new SimpleGrantedAuthority(role))
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        idUsuari,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(role))
                );


                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //GUARDEM l'objecte creat tipus UsernamePasswordAuthenticationToken (autentication) DINS SecurityContextHolder.
                //AQUESTA LINIA ES MOLT IMPORTANT: ES LA QUE DETERMINA SI L'USUARI ESTA AUTENTICAT (que no
                // autoritzat, sino autenticat) QUAN FEM .authenticated() en la ConfiguracioSeguretat.java:
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            //SI EL ROL FOS NUL ALESHORES  DEIXA QUE LA SOLICITUD continui sense autenticacio
            chain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            // Clear any existing security context
            SecurityContextHolder.clearContext();

            // Specific handling for expired tokens
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token expired\", \"message\": \"El token de autenticación ha expirado.\"}");
            return;
        } catch (Exception e) {

            // Clear any existing security context
            SecurityContextHolder.clearContext();

            // Generic handling for other token-related exceptions
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid token\", \"message\": \"El token de autenticación no es válido.\"}");
            return;
        }


    }
}
