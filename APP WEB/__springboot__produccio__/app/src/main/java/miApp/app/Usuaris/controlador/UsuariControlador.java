//NOTA: FALTARA AFEGIR FUNCIONS QUE FACIN SERVIR LES FUNCIONS USUARI AMPLIAT DE DINS USUARISERVEI.java, segons necessitis

package miApp.app.Usuaris.controlador;


//PAS4: Controlador Rest. Aquí injectarem dependencia del servei

import jakarta.validation.Valid;
import miApp.app.Usuaris.dto.*;
import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import miApp.app.Usuaris.servei.UsuariServei;
import miApp.app.seguretat.jwt.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@RestController           //RestController --> l'anotació RestController retorna dades en comptes de vistes (vistes, en canvi, seria @CONTROLLER, que no ho usarem perquè el front va en un altre servidor -vscode live server-)
@RequestMapping("/api")   //RequestMapping --> és una anotació OPCIONAl que et defineix una ruta base per als REST endpoints que crearàs en aquest controlador. p.ex, si tens @RequestMapping("/api") com a anotació damunt de la classe UsuariControlador i després en un endpoint de solicitud get tens  @GetMapping("/usuaris"), hauràs de fer la solicitud a localhost:8080/api/usuaris.
public class UsuariControlador {

    private final UsuariServei serveiUPP; //millor fer-ho final

    @Autowired                                              //POSEM ANOTACIÓ D'INJECCIÓ DE DEPENDÈNCIES EN EL CONSTRUCTOR (no en l'atribut, no recomanat) ENCARA QUE A VERSIONS RECENTS DE  SPRING ES FA AUTOMATIC
    public UsuariControlador(UsuariServei serveiUPP) {
        this.serveiUPP = serveiUPP;
    }

    //-----------------------------------------------------------------
    //NOTA: -- consumim a aquest endpoint en pas1_landingSignUp.html --
    //-----------------------------------------------------------------
    //PRE: Un correu entra pel frontend: e.g -->  {"correuElectronic" : "acces@gmail.com"}
    //POST: si correu es invalid segons anotacions CorreuDTO activades per @Valid:
    //          - codi estat:  400 Bad Request [NO S'HA DE GENERAR MAI SI EL FRONT END ESTA BEN PROGRAMAT]
    //          - body:        {"correuElectronic": "El correo electrónico no es válido!"}
    //      si correu es valid segons anotacions classe CorreuDTO:
    //          - codi estat:  200 OK
    //          - body:        {"existeixUsuari": BOOLEÀ, "teAccesArecursos": BOOLEÀ}
    //
    // Un hashmap que es passara per response POST amb {"existeixUsuari":"True", teAccesArecursos:"true"} o false segons sigui el cas
    //@CrossOrigin(origins = "http://127.0.0.1:5500") // PERMETO AL FRONTEND DEL VSCODE ENVIAR EL CORREU DEL FORMULARI
    @PostMapping("/avaluaUsuari")
    public ResponseEntity<HashMap<String, Object>> verificaUsuari(@RequestBody @Valid CorreuDTO dto) {  //@RequestBody es per la solicitud POST d'entrada des del front (la post tambe permet obtenir resposta, passant el mail pel formulari i obtenint el json de reposta no nomes es modificar el servidor ojo amb el lio)
        String eMail = dto.getCorreuElectronic();
        HashMap<String, Object> mapJSONlike = serveiUPP.verificaUsuari(eMail);
        return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);  //torno la response
    }

    //------------------------------------------------------------
    //NOTA: --- Consumim a aquest endpoint en pas2C_login.html ---
    //------------------------------------------------------------
    //PRE: Un correu i contrasenya entren pel frontend.
    //          {"correuElectronic" : "acces@gmail.com", "contrasenya" : "12345678Mm_" }
    //

    //POST:
    // - CAS 1: Si qualsevol de les validacions activades amb @Valid del LoginDTO  falla:
    //          es retornarà {"email" : "error que sigui"}, etc i 400 Bad Request.
    //
    //
    // - CAS 2: Si les validacions NO FALLEN (no som a CAS 1) aleshores torna el flux habitual del programa:
    //
    //      - Si NO existeix l'usuari a la bbdd es retornarà PEL BODY:
    //
    //       {
    //          "existeixUsuari" : false,
    //          "teAccesArecursos": false,
    //          "contrasenyaCorrecta": false
    //       }
    //      - Si l'usuari existeix (dins BBDD) i TÉ ACCÉS a recursos("permis" >= 1 en BBDD) es retorna:

    //            {"existeixUsuari" : true, "teAccesArecursos" : true, "contrasenyaCorrecta": ????}  -? pot ser True o false-

    //      - Si l'usuari existeix i NO té accés a recursos (permis bbdd == 0) es retorna:

    //             {"existeixUsuari": true, "teAccesArecursos": false, "contrasenyaCorrecta": ????}
    //      ---------------------------------------------------------------
    //
    //      - Si login correcte (E usuari i es contra correcta)
    /*
                 * Pel Body s'enviarà:
                        {
                            "usuari": {
                                "alies": "the protein kingdom",
                                "permisos": 2,
                                "idUsuari": 1
                            },
                            "existeixUsuari": true,
                            "AccessToken": "eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MiwiaWRVc3VhcmkiOjEsInN1YiI6InN1cGVyYWNjZXNAZ21haWwuY29tIiwiaWF0IjoxNzQzNjc2ODcyLCJleHAiOjE3NDM2Nzc3NzJ9.8X-Y78Wzcntao3H6SrPhk2nDWMUOIdI8RuB9WMKBgQw",
                            "teAccesArecursos": true,
                            "contrasenyaCorrecta": true
                        }
    */
    //@CrossOrigin(origins = "http://127.0.0.1:5500") //permeto comunicacio amb vsCode
    @PostMapping("/login")              //@RequestParam es per a solicitud get (http://localhost:8080/api/usuariExisteix?eMail=santiago.sanchez.sans.44@gmail.com)
    public ResponseEntity<HashMap<String, Object>> login(@RequestBody @Valid LoginDTO dto) {  //@RequestBody es per la solicitud POST d'entrada des del front (la post tambe permet obtenir resposta, passant el mail pel formulari i obtenint el json de reposta no nomes es modificar el servidor ojo amb el lio)
        HashMap<String, Object> mapJSONlike = serveiUPP.generaBodyLogin(dto.getCorreuElectronic(), dto.getContrasenya());
        return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);  //200 --> torno la response: el mapJSONlike (amb el token d'accés)!
    }


    //----------------------------------------------------------------------
    //NOTA: --- Consumim a aquest endpoint en pas3_crearContrasenya.html ---
    //----------------------------------------------------------------------
    //PRE: Un correu i contrasenya entraran pel frontend
    //      {"correuElectronic" : "acces@gmail.com", "contrasenya" : "12345678Mm_" }
    //POST: Si l'usuari no existeix a usuari es registraran correu i contrasenya:
    //      Si usuari NO existia (ergo    es registra) --> {"existiaUsuari": false, "usuariShaRegistrat" : true, "AccessToken" : "eyJhbGciOiJIUz [...]"}
    //      Si usuari JA existia (ergo no es registra) --> {"existiaUsuari": true, "usuariShaRegistrat" : false}
    //@CrossOrigin(origins = "http://127.0.0.1:5500") // PERMETO AL FRONTEND DEL VSCODE ENVIAR EL CORREU DEL FORMULARI
    @PostMapping("/registraUsuari")
    public ResponseEntity<HashMap<String, Object>> registraUsuari(@RequestBody @Valid RegistreDTO dto) {  //@RequestBody es per la solicitud POST d'entrada des del front (la post tambe permet obtenir resposta, passant el mail pel formulari i obtenint el json de reposta no nomes es modificar el servidor ojo amb el lio)
        HashMap<String, Object> mapJSONLike = serveiUPP.registraUsuari(dto);
        return new ResponseEntity<>(mapJSONLike, HttpStatus.OK);  //torno la response
    }


    //PRE: existeix la bbdd i la taula de usuaris (no hi ha parametres d'entrada)
    //POST: Obtens el nombre d'usuaris que hi ha a la teva aplicacio a l'endpoint.
    @GetMapping("/correusUsuaris")
    public ResponseEntity<List<String>> mostraLlista() { //ni RequestBody ni RequestParam, perque no hi ha dades d'entrada.
        return new ResponseEntity<>(serveiUPP.correusUsuarisApp(), HttpStatus.OK);
    }



    //PRE: existeix la bbdd i la taula de usuaris (no hi ha parametres d'entrada)
    //POST: Obtens el nombre d'usuaris que hi ha a la teva aplicacio a l'endpoint (NO SE SI SERA UTIL)
    //@CrossOrigin(origins = "http://127.0.0.1:5500") // PERMETO AL FRONTEND DEL VSCODE ENVIAR EL CORREU DEL FORMULARI
    @GetMapping("/nreUsuaris")
    public ResponseEntity<HashMap<String, Integer>> mostraNreUsuaris() { //ni RequestBody ni RequestParam, perque no hi ha dades d'entrada.
        HashMap<String, Integer> mapJSONlike = new HashMap<>();
        mapJSONlike.put("nreUsuarisRegistrats", serveiUPP.nreUsuarisApp());
        return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);
    }

    //PRE: un hashmap estil ---> {"idUsuari" : 3}                [provinent de FastApi, sense token entrant]
    //POST: un hashmap estil --> {"nouToken" : "lksdqwoiqweih"}  [que tindrà permisos a 1 i l'idUsuari dins]
    @CrossOrigin(origins = "http://127.0.0.1:8000") //el cross origin nomes va pels navegadors. No evita connexions de postman. corregir.
    @PostMapping("/obtenerTokenPermisosDashboard")
    public ResponseEntity<HashMap<String, String>> creaToken(@RequestBody HashMap<String, Integer> mapIdUsuari) {
        Integer idUsuari = mapIdUsuari.get("idUsuari");
        HashMap<String, String> mapSortida = new HashMap<>(); //Amb aixo expedim el token
        mapSortida.put("nouToken", serveiUPP.obtenirTokenPermisosPerAdashboard(idUsuari));
        return new ResponseEntity<>(mapSortida, HttpStatus.OK);
    }



    //-----------------------------------------------------
    //AFEGIT MENTRE VAIG FENT CURS (CRUD) -- ENDPOINTS REST
    //-----------------------------------------------------






    //MOSTRA UNA LLSTA DE TOTS ELS USUARIS AMB TOTES LES DADES DE LA TAULA D'USUARIS --> R DEL CRUD
    // (SI NO HI HA USUARIS SEGUEIX MOSTRANT 200 OK, PERÒ RETORNA AL CLIENT
    //  UNA RESPONSE ENTITY: LLISTA BUIDA BÀSICAMENT)
    @GetMapping("/usuaris")
    public ResponseEntity<List<Usuari>> mostraUsuaris() {
        return new ResponseEntity<>(serveiUPP.trobaTotsElsUsuaris(), HttpStatus.OK);
    }

    //METODE PER TROBAR UN USUARI PER ID --------------------------------> LA R DEL CRUD
    //NOTA:  EXISTEIXEN DOS FORMES DE PASSAR EL PARAMETRE EN LA SOLICITUD GET per obtenir recursos d'un usuari per parametrte:
    //       @PathVariable("id"). Si id fos 1 -->  (http://localhost:8080/api/usuaris/1)   [OPCIÓ AQUÍ UTILITZADA]
    //       @RequestParam("id")  Si id fos 1 --> (http://localhost:8080/api/usuaris?id=1 |
    @GetMapping("/usuaris/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal")  //FA AUTENTICACIÓ AMB id==principal (RESTRINGEIX ACCÉS A UN SOL ID D'USUARI: EL QUE PASSA PEL "principal" DE UsernamePasswordAuthenticationToken authentication DINS FiltreAutenticacioJwt. També permet accedir-hi a admins sense importar quin id tinguin.
    public ResponseEntity<Usuari> obtinguesUsuari(@PathVariable("id") int id) {
        Optional<Usuari> usuari = serveiUPP.trobaPerId(id);
        if (usuari.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //retorno codi d'error 404 (no trobat)
        }
        return new ResponseEntity<>(usuari.get(), HttpStatus.OK);
    }

    //METODE PER CREAR UN USUARI DIRECTAMENT (CURS SPRING FUNDAMENTALS MILLORAT AMB BONES PRÀCTIQUES) --> LA C DEL CRUD [ESTUDIA SUBSTITUIR-LO PER registraUsuari I FER CANVIS EN FRONT]
    //
    //     SI EXISTEIX USUARI --> torno un 409
    //     SI NO EXISTEIX ------> torno un 201 (i creo l'usuari a la bbdd).

    //PRE: POTS VEURE EL PRE DE PUT, QUE ÉS IGUAL
    //POST: POTS VEURE EL POST DE PUT, QUE ÉS IGUAL.
    @PostMapping("/usuaris")
    public ResponseEntity<Usuari> creaUsuari(@RequestBody @Valid UsuariDTO dto) {
        Optional<Usuari> nouUsuariOPTIONAL = serveiUPP.guardaUsuari(dto);

        if (nouUsuariOPTIONAL.isPresent()) { //si usuari s'ha afegit, aquest tipus Optional tindrà un usuari dins
            Usuari nouUsuari = nouUsuariOPTIONAL.get();
            return new ResponseEntity<>(nouUsuari, HttpStatus.CREATED); // 201 CREATED si es crea correctament
        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 CONFLICT (l'usuari ja existia! i no s'ha afegit a la bbdd)
        }
    }


    //MÈTODE PER A CANVIAR TOTES LES DADES D'UN USUARI --> la U DEL CRUD (UN PUT, QUE TÉ COS COM UN POST I PASSA TOT EL RECURS PEL BODY)
    //
    //      SI S'HA ACTUALITZAT USUARI ----------------------> torno un 200 (OK)
    //      SI NO S'HA TROBAT (ergo, no s'ha actualitzat)----> torno un 404 (recurs no trobat)
    //      SI S'INTENTA AFEGIR UN CORREU JA EXISTENT A UN USUARI DIFERENT --------> tornarà internal server error (500, compte --> millorable)

    /*
    //PRE: Des del client entrarà un JSON de l'estil seguent (el que es congruent amb el DTOusuari
     i a la URL posaras l'URI http://localhost:8080/api/usuaris/4
     si l'usuari te idUsuari 4.
            {
                "correuElectronic": "titu9@exemplete.com",
                "contrasenya": "ijk",
                "alies": "chuckUson",
                "plaSuscripcioActual": 0
            }
    //POST: guarda les dades a la bbdd i mostra el que s'ha guardat en JSON
            {
                "idUsuari": 4,
                "correuElectronic": "titu9@exemplete.com",
                "hashContrasenya": "ijk",
                "alies": "chuckUson",
                "plaSuscripcioActual": 0
            }
    */
    @PutMapping("/usuaris/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal") //testejat (assegurem nomes admin o id de usuari puguin accedir
    public ResponseEntity<Usuari> actualitzaUsuari(@RequestBody @Valid UsuariDTO dto, @PathVariable("id") int id) {
        Optional<Usuari> usuariActualitzatOPTIONAL = serveiUPP.actualitzaUsuari(dto, id);

        if (usuariActualitzatOPTIONAL.isPresent()) { //si usuari s'ha afegit, aquest tipus Optional tindrà un usuari dins
            Usuari usuariActualitzat = usuariActualitzatOPTIONAL.get();
            return new ResponseEntity<>(usuariActualitzat, HttpStatus.OK); // 200 si s'ha actualitzat correctament (i torno l'usuari actualtizat)
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 l'usuari que vols actualitzar NO existeix!
        }
    }




    //MÈTODE PER A ESBORRAR UN USUARI () --> LA D DEL CRUD

    //      SI S'HA ESBORRAT USUARI -------> torno un 204 (no content, ok)
    //      SI NO S'HA ESBORRAT L'USUARI --> torno un 404 (recurs no trobat)
    @DeleteMapping("/usuaris/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal") //testejat (assegurem nomes admin o id de usuari puguin borrar)
    public ResponseEntity<Void> esborraUsuari(@PathVariable("id") int id) { //compte al void, que no pots usar el tipus primitiu. Has d'usar la wrapper class (Void)
        boolean usuariEsborrat = serveiUPP.esborraUsuari(id);
        if (usuariEsborrat) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); //SI USUARI S'HA POGUT ESBORRAR (AIXÒ ÉS, EXISTIA) ENVIO UN CODI D'ÈXIT: EL 204 (NO CONTENT)
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //SI USUARI NO S'HA POGUT ESBORRAR (AIXÒ ÉS, NO EXISTIA) ENVIO UN CODI D'ERROR 404 (JA QUE EL RECURS A TROBAR NO S'HAVIA TROBAT!)
        }
    }

    //MÈTODE PER A CANVIAR DADES PARCIALS D'UN USUARI --> la U del CRUD (UN PATCH).
    //   - EN AQUEST CAS SERVEIX PER CANVIAR LA CONTRASENYA I CAP ALTRE RECURS
    //   - AQUEST MÈTODE HA ESTAT MOLT BEN VALIDAT DINS ActualitzaContrasenyDTO.java d'acord amb el que ja havia fet al client en el camp de crear contrasenya.
    //     LA CLASSE ManejadorExcepcions.java IMPRIMEIX LES EXCEPCIONS QUE GENERI LA CLASSE DTO en questió.
    //   - TO DO --> Ho usaré per a fer el canvi de contrasenya quan l'usuari se n'oblidi i en vulgui una altra
    @PatchMapping("usuaris/{id}/contrasenya")
    @PreAuthorize("hasRole('ADMIN') or #id == principal") //paraula CLAU PRINCIPAL es idUsuari autenticat de SpringSecurity (es refereix a la paraula clau principal de l'objete autenticado (UsernamePasswordAuthenticationToken) en Spring Security, que s'emmagatzema en l objecte SecurityContextHolder (creat dins FiltreAutenticacio.java)
    public ResponseEntity<HashMap<String, String>> actualitzaContrasenya(@PathVariable("id") int id, @Valid @RequestBody ActualitzaContrasenyaDTO dto) { //hi ha més validacions que generen excepcions per l'antoacio @Valid. Veure ActiaotzaCmtrasemuaDTO i les anotacions amb arroba (congruents amb el front)
        Optional<Usuari> usuariActualitzatOPTIONAL = serveiUPP.actualitzaContrasenya(dto, id);
        HashMap<String, String> resposta = new HashMap<>(); //posem un hashmap per tornar la resposta serialitzada amb json
        if (usuariActualitzatOPTIONAL.isPresent()) {
            resposta.put("mensaje", "Contraseña actualizada correctamente.");
            return new ResponseEntity<>(resposta, HttpStatus.OK); //200 OK
        } else {
            resposta.put("mensaje", "Usuario no encontrado.");
            return new ResponseEntity<>(resposta, HttpStatus.NOT_FOUND);  //404 NOT FOUND
        }
    }




}















