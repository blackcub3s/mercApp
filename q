[1mdiff --git a/APP WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/controlador/UsuariControlador.java b/APP WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/controlador/UsuariControlador.java[m
[1mindex 45eb988..10debe9 100644[m
[1m--- a/APP WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/controlador/UsuariControlador.java[m	
[1m+++ b/APP WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/controlador/UsuariControlador.java[m	
[36m@@ -93,20 +93,20 @@[m [mpublic class UsuariControlador {[m
     //      ---------------------------------------------------------------[m
     //[m
     //      - Si login correcte (E usuari i es contra correcta)[m
[31m-    //[m
[31m-    //          * Pel body:     {[m
[31m-    //                              "existeixUsuari": true,[m
[31m-    //                              "teAccesArecursos": true,[m
[31m-    //                              "contrasenyaCorrecta": true,[m
[31m-    //                              "usuari" : {[m
[31m-    //                                  "alies" :  VALORALIES,[m
[31m-    //                                  "permisos" : VALOR PERMISOS[m
[31m-    //                                  "idUsuari" : VALOR ID USUARI,[m
[31m-    //                              }[m
[31m-    //                          }[m
[31m-    //          * Pel header:   "Authorization" : "Bearer QWROIASOFDNAIOSFNQWR". (es torna token d'accés)[m
[31m-    //[m
[31m-    //[m
[32m+[m[32m    /*[m[41m[m
[32m+[m[32m                 * Pel Body s'enviarà:[m[41m[m
[32m+[m[32m                        {[m[41m[m
[32m+[m[32m                            "usuari": {[m[41m[m
[32m+[m[32m                                "alies": "the protein kingdom",[m[41m[m
[32m+[m[32m                                "permisos": 2,[m[41m[m
[32m+[m[32m                                "idUsuari": 1[m[41m[m
[32m+[m[32m                            },[m[41m[m
[32m+[m[32m                            "existeixUsuari": true,[m[41m[m
[32m+[m[32m                            "AccessToken": "eyJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNvcyI6MiwiaWRVc3VhcmkiOjEsInN1YiI6InN1cGVyYWNjZXNAZ21haWwuY29tIiwiaWF0IjoxNzQzNjc2ODcyLCJleHAiOjE3NDM2Nzc3NzJ9.8X-Y78Wzcntao3H6SrPhk2nDWMUOIdI8RuB9WMKBgQw",[m[41m[m
[32m+[m[32m                            "teAccesArecursos": true,[m[41m[m
[32m+[m[32m                            "contrasenyaCorrecta": true[m[41m[m
[32m+[m[32m                        }[m[41m[m
[32m+[m[32m    */[m[41m[m
     @CrossOrigin(origins = "http://127.0.0.1:5500") // PERMETO AL FRONTEND DEL VSCODE ENVIAR EL CORREU DEL FORMULARI[m
     @PostMapping("/login")              //@RequestParam es per a solicitud get (http://localhost:8080/api/usuariExisteix?eMail=santiago.sanchez.sans.44@gmail.com)[m
     public ResponseEntity<HashMap<String, Object>> verificarUsuariIcontrasenya_perA_logIn(@RequestBody @Valid LoginDTO dto) {  //@RequestBody es per la solicitud POST d'entrada des del front (la post tambe permet obtenir resposta, passant el mail pel formulari i obtenint el json de reposta no nomes es modificar el servidor ojo amb el lio)[m
[36m@@ -141,12 +141,12 @@[m [mpublic class UsuariControlador {[m
 [m
             //POSO EL TOKEN A LA CAPÇALERA HTTP PER TORNAR-LO AL CLIENT (FIX: EN PAS server --> client millor passar-lo[m
             // pel body -reimplementar-ho, ara passa pel header-. NOTA: en client --> server si va per header, al contrari).[m
[31m-            HttpHeaders capsaleraHTTP = new HttpHeaders();[m
[32m+[m[41m[m
             String tokenJWTgenerat = serveiUPP.generaTokenAccesPerUsuariParticular(eMail);[m
             System.out.println("TOKENETE ACCESETE "+tokenJWTgenerat);[m
[31m-            capsaleraHTTP.set("Access-Control-Expose-Headers", "Authorization"); //PERMETO EXPOSAR LES HEADERS (CORS)[m
[31m-            capsaleraHTTP.set("Authorization", "Bearer "+tokenJWTgenerat); //POSO EL TOKEN A LA CAPSALERA[m
[31m-            return new ResponseEntity<>(mapJSONlike, capsaleraHTTP, HttpStatus.OK);  //200 --> torno la response: el mapJSONlike i la capsalera amb el token!![m
[32m+[m[41m[m
[32m+[m[32m            mapJSONlike.put("AccessToken", tokenJWTgenerat); //POSO EL TOKEN A LA CAPSALERA[m[41m[m
[32m+[m[32m            return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);  //200 --> torno la response: el mapJSONlike (amb el token d'accés)![m[41m[m
 [m
         } else { //NO TORNO TOKEN SI LA CONTRASENYA DE L'USUARI NO ES CORRECTA PERO SI HAS DE PROCESSAR IGUALENT EL BODY EN EL FRONTEND[m
             return new ResponseEntity<>(mapJSONlike, HttpStatus.OK);  //  --> peticio no autoritzada per mala contrasenya[m
[1mdiff --git a/APP WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto DAW_7X_SantiagoSanchezSans.tex b/APP WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto DAW_7X_SantiagoSanchezSans.tex[m
[1mindex c70d0aa..e62c368 100644[m
[1m--- a/APP WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto DAW_7X_SantiagoSanchezSans.tex[m	
[1m+++ b/APP WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto DAW_7X_SantiagoSanchezSans.tex[m	
[36m@@ -341,7 +341,7 @@[m
 			\subsubsection{Recibir el Access Token desde el back-end}[m
 			\label{sec:recibirAccesTokenENFRONTEND}.[m
 			[m
[31m-			El token de acceso se recibe por primera vez desde el backend cuando el usuario se loguea con éxito en \textbf{pas2Clogin.html}. Para entender de dónde viene el token desde el back-end podéis ver la sección \ref{sec:enviarPorPrimeraVezAccesTokenDESDEBACKEND}, dado que en la sección que ocupa el lector ahora mismo nos centraremos en el front.[m
[32m+[m			[32mEl token de acceso se recibe por primera vez desde el backend cuando el usuario se loguea con éxito en \textbf{pas2Clogin.html}. Para entender de dónde viene el token desde el back-end redirigimos al lector a la sección \ref{sec:enviarPorPrimeraVezAccesTokenDESDEBACKEND}, donde se trata ese aspecto. En la presente sección nos ocuparemos de JavaScript en el front.[m[41m[m
 			[m
 			El token se recibe en la vista definida por \textbf{pas2Clogin.html}, cuando des de el script hacemos una solicitud POST con fetch() hacia el endpoint del back-end SpringBoot \textit{``/api/login''}.[m
 			[m
[36m@@ -349,7 +349,11 @@[m
 			[m
 			Como se puede ver desde el JavaScript embedido en el HTML en la figura \ref{fig:figuraLoginFetch}, cuando el usuario se loguee correctamente al recibir el código 200 OK hemos programado la función \textit{fetch()} para que guarde el token de Autenticación y Autorización recién creado desde el back-end de Spring Boot en el cliente. Es decir, para que se guarde el Access Token JWT en nuestro \textit{localStorage}.[m
 			[m
[31m-			Existe un debate para ver si el token de acceso se debe mandar del cliente al servidor (cuando se hace el login) en el body de la response POST o bien en la header ``Authorization''. [m
[32m+[m			[32mEn este trabajo no implementaremos cookies ya que implica configuración extra tanto en el cliente como en el servidor. Vamos a guardar el token en el cliente en el localStorage (que es, de hecho, una práctica habitual en aplicaciones que no requieren un alto grado de seguridad).[m[41m[m
[32m+[m[41m			[m
[32m+[m			[32mEn este caso, existe un debate para ver si en ese logIn el token de acceso recién generado en el servidor se debe mandar al cliente en el body de la respuesta de la solicitud POST o bien en la header ``Authorization''.[m[41m [m
[32m+[m[41m			[m
[32m+[m			[32mEs práctica común mandarlo en el body. También veremos que para el paso inverso[m[41m [m
 			[m
 			\setlength{\belowcaptionskip}{3pt}[m
 			\FloatBarrier[m
