package miApp.app.seguretat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


//AQUESTA CLASSE PERMET PROTEGIR O DESPROTEGIR ELS ENDPOINTS. ES NECESSARIA PERQUÈ ELS ENDPOINTS, EN AFEGIR
//LA DEPENDÈNCIA spring-boot-starter-security QUEDEN PROTEGITS I QUALSEVOL CRIDA A ELLS DÓNA ERROR 401
@Configuration
//@EnableWebSecurity  //L'anotacio @EnableWebSecurity ja no cal posar-la (en versions noves spring boot no es necessaria, pero la pots posar si vols)
public class ConfiguracioSeguretat {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        //.requestMatchers("/api/usuaris").authenticated()  //ENDPOINT PROTEGIT
                        .requestMatchers("/api/nreUsuaris").authenticated() //ENDPOINT PROTEGIT
                        .requestMatchers("/api/**").permitAll()  // PERMET QUE LA RESTA D'ENDPOINTS dins /api/ SIGUIN PUBLICS
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
