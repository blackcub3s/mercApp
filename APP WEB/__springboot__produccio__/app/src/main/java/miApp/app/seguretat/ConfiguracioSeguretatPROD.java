package miApp.app.seguretat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// CLASSE APLICADA AL PERFIL DE PROD (PRODUCCIO). AQUEST PERFIL S'ACTIVA QUAN"spring.profiles.active = prod" ESTA
// COMENTAT dins de application.propertiesALESHORES l'app PROTEGEIX els endpoints PER token segons els rols definits
// a sota i també, tal i com està, habilita les anotacions @PreAuthorize() per evitar que usuaris accedeixin a recursos
// que no son seus (i.e. usuaris amb id diferent).

// AQUESTA CLASSE PROTEGEIX ELS ENDPOINTS.FUNCIONA EN AFEGIR LA DEPENDÈNCIA spring-boot-starter-security A POM.
// I FINE TUNEJA LES RESTRICCIONS QUE AQUESTA PERMET

@Configuration
@EnableMethodSecurity  //CRUCIAL! Sense aquesta anotació no pots activar valicadions a nivell de method de controlador, tal com @PreAuthorise per poder autoritzar l'usuari de idUsuari en el principal de authentication en /usuaris/1
public class ConfiguracioSeguretatPROD {

    private final FiltreAutenticacioJwt jwtAuthenticationFilter;
    public ConfiguracioSeguretatPROD(FiltreAutenticacioJwt jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    @Profile("prod") //activa aquesta configuració de seguretat quan spring.profiles.active = prod de application.properties no està comentat!
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        //.requestMatchers("/api/usuaris").authenticated()  //ENDPOINT PROTEGIT  || NOTA: PROVAR hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/usuaris/*").hasAnyRole("USER", "ADMIN")  //TESTEJAT!     PROTEGEIXO RUTA /api/usuaris/{ID}. SI VOLGUES PROTEGIR TOTES LES SUBRUTES POSTERIORS (POSARIA DOS ASTERISCS EN COMPTES DE UN). HE AFINAT PER RESTRINGIT ALS USUARIS AMB PreAuthorise
                        .requestMatchers("/api/usuaris").hasRole("ADMIN")   //TESTEJAT!     AQUEST ENDPOINT NOMES L'HA DE VEURE L'ADMINISTRADOR. ENDPOINT PROTEGIT (ADMIN es permisos == 2 de la bbdd veure FiltreAutenticacioJwt)
                        .requestMatchers("/api/nreUsuaris").hasAnyRole("USER", "ADMIN") //TESTEJAT!     ENDPOINT PROTEGIT (USER es permisos==1 de la bbdd) TESTEJAT! NOMES DEIXA ACCEDIR USERS I ADMIN
                        //.requestMatchers("/api/*/contrasenya").hasAnyRole("USER", "ADMIN") //
                        .requestMatchers("/api/**").permitAll()  // PERMET QUE LA RESTA D'ENDPOINTS dins /api/ SIGUIN PUBLICS

                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); //ES CARREGA EL FILTRE QUE DFINEIX ELS ROLES (ADMIN, USER!)

        return http.build();
    }


}
