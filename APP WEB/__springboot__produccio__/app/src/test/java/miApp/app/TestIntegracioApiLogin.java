package miApp.app;

import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import miApp.app.utils.EncriptaContrasenyes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class) // Permet executar tests en ordre si cal
class TestIntegracioApiLogin {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuariRepositori repoUsuari;

    @BeforeEach
    void setUp() {
        repoUsuari.deleteAll(); // netejem la BBDD abans de cada test
    }

    @Test
    void testValidacioFallidaPerCorreuBuit() throws Exception {
        String loginJson = """
            {"correuElectronic": "", "contrasenya": "12345678Mm"} 
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }

    @Test
    void testValidacioFallidaPerContrasenyaCurta() throws Exception {
        String loginJson = """
            {"correuElectronic": "pepe@gmail.com", "contrasenya": "12"} 
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }

    @Test
    void testUsuariNoExisteix() throws Exception {
        String loginJson = """
            {"correuElectronic": "noexisteix@gmail.com", "contrasenya": "12345678Mm_"}
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(false))
                .andExpect(jsonPath("$.teAccesArecursos").value(false))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(false));
    }


    //PRE: entra POST a api/login  el seguent JSON de un usuari amb permisos a 0 amb contra CORRECTA:
    //          {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    //             {"existeixUsuari": true, "teAccesArecursos": false, "contrasenyaCorrecta": true}
    @Test
    void usuariDePermisosA0_QueExisteixAbbdd() throws Exception {


        String loginJson = """
            {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
        """;

        //GUARDO L'USUARI A LA BASE DE DADES
        Usuari u = new Usuari();

        u.setCorreuElectronic("noacces@gmail.com"); //poso el nou mail
        EncriptaContrasenyes encriptador = new EncriptaContrasenyes();
        u.setHashContrasenya(encriptador.hashejaContrasenya("12345678Mm_"));
        u.setAlies("UsuariPermisos0TestIntegracio");
        u.setPermisos((byte) 0);
        repoUsuari.save(u);

        //ENVIEM loginJson
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(true))
                .andExpect(jsonPath("$.teAccesArecursos").value(false))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(true));
    }

}
