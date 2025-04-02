package miApp.app.seguretat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


// CLASSE APLICADA AL PERFIL PER DEFECTE
// (i.e. quan "spring.profiles.active = prod" ESTA COMENTAT dins de application.properties
// ALESHORES l'app NO protegeix cap ENDPOINT.



@Configuration
@EnableMethodSecurity(prePostEnabled = false)  //CRUCIAL! Així els @PreAuthorise del controlador deixen de funcionar i pots visualitzar lliurement tots els endpoints que tenen id
public class ConfiguracioSeguretatPERMISIVA {





    //Activa aquesta configuracio SIMPLEMENT comentant la linia spring.profiles.active = prod
    // dins application.properties.
    @Bean
    public SecurityFilterChain securityFilterChain_PER_DEFECTE(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll()  // PERMET QUE LA RESTA D'ENDPOINTS dins /api/ SIGUIN PUBLICS
                        .requestMatchers("/swagger-ui/**","/v3/api-docs/**").permitAll() //AFEGEIXO ACCES ALS ENDPOINTS DE SWAGGER!
                );
                //.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
