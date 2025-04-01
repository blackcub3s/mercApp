package miApp.app.seguretat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


//AQUESTA CLASSE PERMET PROTEGIR O DESPROTEGIR ELS ENDPOINTS. ES NECESSARIA PERQUÈ ELS ENDPOINTS, EN AFEGIR
//LA DEPENDÈNCIA spring-boot-starter-security QUEDEN PROTEGITS I QUALSEVOL CRIDA A ELLS DÓNA ERROR 401
//L'anotacio @EnableWebSecurity ja no cal posar-la (en versions noves spring boot no es necessaria)
@Configuration
@EnableMethodSecurity  //CRUCIAL! Sense aquesta anotació no pots activar valicadions a nivell de method de controlador, tal com @PreAuthorise per poder autoritzar l'usuari de idUsuari en el principal de authentication en /usuaris/1
public class ConfiguracioSeguretat {

    private final FiltreAutenticacioJwt jwtAuthenticationFilter;

    public ConfiguracioSeguretat(FiltreAutenticacioJwt jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        //.requestMatchers("/api/usuaris").authenticated()  //ENDPOINT PROTEGIT  || NOTA: PROVAR hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/usuaris/*").hasRole("USER")  //PROTEGEIXO RUTA /api/usuaris/{ID}. SI VOLGUES PROTEGIR TOTES LES SUBRUTES POSTERIORS (POSARIA DOS ASTERISCS EN COMPTES DE UN)
                        .requestMatchers("/api/usuaris").hasRole("ADMIN")   //TESTEJAT! ENDPOINT PROTEGIT (ADMIN es permisos == 2 de la bbdd veure FiltreAutenticacioJwt)
                        .requestMatchers("/api/nreUsuaris").hasAnyRole("USER", "ADMIN") //TESTEJAT! ENDPOINT PROTEGIT (USER es permisos==1 de la bbdd) TESTEJAT! NOMES DEIXA ACCEDIR USERS I ADMIN
                        .requestMatchers("/api/**").permitAll()  // PERMET QUE LA RESTA D'ENDPOINTS dins /api/ SIGUIN PUBLICS
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/swagger-resources/**", "/webjars/**", "/v3/api-docs").permitAll() //AFEGEIXO ACCES ALS ENDPOINTS DE SWAGGER!
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
