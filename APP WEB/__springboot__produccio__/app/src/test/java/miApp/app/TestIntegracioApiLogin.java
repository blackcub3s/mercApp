package miApp.app;

import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import miApp.app.utils.EncriptaContrasenyes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
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
    void testValidacioFallidaPer_CORREU_BUIT() throws Exception {
        String loginJson = """
            {"correuElectronic": "", "contrasenya": "12345678Mm"} 
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }

    @Test
    void testValidacioFallidaPer_CONTRASENYA_CURTA() throws Exception {
        String loginJson = """
            {"correuElectronic": "mailQualsevol@gmail.com", "contrasenya": "12"} 
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }


    @Test
    void testValidacioFallidaPer_CONTRASENYA_BUIDA() throws Exception {
        String loginJson = """
            {"correuElectronic": "mailQualsevol@gmail.com", "contrasenya": ""} 
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }


    //PRE: {"correuElectronic" :  "mailQualsevol@gmail.com", "contrasenya" : "12345678Mm'" }
    //POST: Test passa si torna un 400 bad request ja que té ' que es caràcter no permès
    @Test
    void testValidacioFallidaPer_CARACTER_NO_PERMES_EN_CONTRASENYA() throws Exception {
        String loginJson = """
            {"correuElectronic" : "mailQualsevol@gmail.com", "contrasenya" : "12345678Mm'" }
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isBadRequest());  //mira si torna el 400 (isBadRequest())
    }






    //PRE:



    //PRE: entra POST a api/login  el seguent JSON de un usuari NO EXISTENT
    //     amb permisos a 0 amb una potencial contra vàlida que no generi el 400 del manejador global d'excepcions:
    //          {"correuElectronic": "noExisteix@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    //             {
    //                 "existeixUsuari": false,
    //                 "teAccesArecursos": false,
    //                 "contrasenyaCorrecta": true
    //             }
    @Test
    void testUsuariNoExisteix() throws Exception {
        String loginJson = """
            {"correuElectronic": "noExisteix@gmail.com", "contrasenya": "12345678Mm_"}
        """;

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(false))
                .andExpect(jsonPath("$.teAccesArecursos").value(false))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(false));
    }




    //PRE: entra POST a api/login  el seguent JSON de un usuari JA EXISTENT
    //     amb permisos a 0 amb un contrasenya incorrecta però no invàlida
    //     que generi un 200 ok:
    //          {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    //             {
    //                 "existeixUsuari": true,
    //                 "teAccesArecursos": false,
    //                 "contrasenyaCorrecta": true
    //             }
    @Test
    void testUsuariExisteix_Permisos0_CONTRA_INCORRECTA() throws Exception {

        //contra incorrecta, li falta la barra baixa perque farem
        // que la correcta tingui una barra baixa al final
        String loginJson = """                                          
            {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm"} 
        """;


        Usuari u = new Usuari();

        u.setCorreuElectronic("noacces@gmail.com"); //poso el nou mail
        EncriptaContrasenyes encriptador = new EncriptaContrasenyes();
        u.setHashContrasenya(encriptador.hashejaContrasenya("12345678Mm_"));  //contra correcta
        u.setAlies("UsuariPerm0_contraIncorr");
        u.setPermisos((byte) 0);
        repoUsuari.save(u);





        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(true))
                .andExpect(jsonPath("$.teAccesArecursos").value(false))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(false));
    }





    //PRE: entra POST a api/login  el seguent JSON de un usuari JA EXISTENT
    //     amb permisos a 1 amb un contrasenya incorrecta però no invàlida
    //     que generi un 200 ok:
    //          {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    //             {
    //                 "existeixUsuari": true,
    //                 "teAccesArecursos": true,
    //                 "contrasenyaCorrecta": true
    //             }
    @Test
    void testUsuariExisteix_Permisos1_CONTRA_INCORRECTA() throws Exception {

        //contra incorrecta, li falta la barra baixa perque farem
        // que la correcta tingui una barra baixa al final
        String loginJson = """                                          
            {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm"} 
        """;


        Usuari u = new Usuari();

        u.setCorreuElectronic("noacces@gmail.com"); //poso el nou mail
        EncriptaContrasenyes encriptador = new EncriptaContrasenyes();
        u.setHashContrasenya(encriptador.hashejaContrasenya("12345678Mm_"));  //contra correcta
        u.setAlies("UsuariPerm1_contraIncorr");
        u.setPermisos((byte) 1);
        repoUsuari.save(u);





        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(true))
                .andExpect(jsonPath("$.teAccesArecursos").value(true))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(false));
    }








    //PRE: entra POST a api/login  el seguent JSON de un usuari ja preeexistent
    //     amb permisos a 0 i amb contra CORRECTA:
    //          {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    /*

        {
            "usuari": {
                "alies": "UsuariPermisos0TestIntegracio",
                "permisos": 0,
                "idUsuari": 94                  //VARIARÀ, TESTEJARÉ QUE SIGUI UN NOMBRE
            },
            "existeixUsuari": true,
                "AccessToken": "eyJhEJQWNFLKQR",   //VARIARÀ: TESTEJARÉ QUE VALUE SIGUI STRING
                "teAccesArecursos": false,
                "contrasenyaCorrecta": true
        }
    */
    @Test
    void usuariDePermisosA0_QueExisteixAbbdd() throws Exception {

        String loginJson = """
            {"correuElectronic": "noacces@gmail.com", "contrasenya": "12345678Mm_"}
        """;

        //GUARDO L'USUARI A LA BASE DE DADES PRIMER, PERQUÈ PUGUI SER PREEXISTENT ABANS DELS TESTS!
        Usuari u = new Usuari();

        u.setCorreuElectronic("noacces@gmail.com"); //poso el nou mail
        EncriptaContrasenyes encriptador = new EncriptaContrasenyes();
        u.setHashContrasenya(encriptador.hashejaContrasenya("12345678Mm_"));
        u.setAlies("UsuariPermisos0TestIntegracio");
        u.setPermisos((byte) 0);
        repoUsuari.save(u);


        //ARA JA PUC ENVIAR LA SOLICITUD POST AMB EL BODY CONTENINT EL loginJson
        //I LI DEMANO ESPERAR ELS VALORS CORRESPONENTS A LES CLAUS CORRESPONENTS
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(true))
                .andExpect(jsonPath("$.teAccesArecursos").value(false))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(true))
                .andExpect(jsonPath("$.AccessToken").isString()) //espera un string i la clau AccessToken. Si canvies la clau a accessToken fallara
                .andExpect(jsonPath("$.usuari.alies").value("UsuariPermisos0TestIntegracio"))
                .andExpect(jsonPath("$.usuari.permisos").value(0))
                .andExpect(jsonPath("$.usuari.idUsuari").isNumber());

    }


    //PRE: entra POST a api/login  el seguent JSON de un usuari ja preeexistent
    //     amb permisos a 1 i amb contra CORRECTA:
    //          {"correuElectronic": "acces@gmail.com", "contrasenya": "12345678Mm_"}
    //POST:
    //     Passa el test si la solicitud post fa la seguent response:
    /*

        {
            "usuari": {
                "alies": "UsuariPermisos1TestIntegracio",
                "permisos": 1,
                "idUsuari": 2    //VARIARÀ
            },
            "existeixUsuari": true,
            "AccessToken": "eyJhbGciOiJIUzI1NiJ9.eyJ [...] 5XanxDb7xXfM",   //VARIARÀ
            "teAccesArecursos": true,
            "contrasenyaCorrecta": true
        }

    */
    @Test
    void usuariDePermisosA1_QueExisteixAbbdd() throws Exception {

        String loginJson = """
            {"correuElectronic" : "acces@gmail.com", "contrasenya" : "12345678Mm_" }
        """;

        //GUARDO L'USUARI A LA BASE DE DADES PRIMER, PERQUÈ PUGUI SER PREEXISTENT ABANS DELS TESTS!
        Usuari u = new Usuari();

        u.setCorreuElectronic("acces@gmail.com"); //poso el nou mail
        EncriptaContrasenyes encriptador = new EncriptaContrasenyes();
        u.setHashContrasenya(encriptador.hashejaContrasenya("12345678Mm_"));
        u.setAlies("UsuariPermisos1TestIntegracio");
        u.setPermisos((byte) 1);
        repoUsuari.save(u);


        //ARA JA PUC ENVIAR LA SOLICITUD POST AMB EL BODY CONTENINT EL loginJson
        //I LI DEMANO ESPERAR ELS VALORS CORRESPONENTS A LES CLAUS CORRESPONENTS
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.existeixUsuari").value(true))
                .andExpect(jsonPath("$.teAccesArecursos").value(true))
                .andExpect(jsonPath("$.contrasenyaCorrecta").value(true))
                .andExpect(jsonPath("$.AccessToken").isString()) //espera un string i la clau AccessToken. Si canvies la clau a accessToken fallara
                .andExpect(jsonPath("$.usuari.alies").value("UsuariPermisos1TestIntegracio"))
                .andExpect(jsonPath("$.usuari.permisos").value(1))
                .andExpect(jsonPath("$.usuari.idUsuari").isNumber());

    }










}




