# 0. Introducción

En este repositorio muestro el código para generar una aplicación web con la que hacer un análisis de tikets digitales. En este proyecto existe un back-end, un front-end y una base de datos.

En este readme especificaremos como correr el proyecto y mostraremos un diagrama de flujo de la aplicación partiendo del enrutamiento del front-end que ha sido inspirado en el proceso de registro de la plataforma Netflix.

En primer lugar, podréis ver el [back-end](/APP%20WEB/__springboot__produccio__/) que se ha hecho con `Spring Boot` , siendo ésta la parte más importante de este proyecto y aquello en lo que los lectores pasarán más tiempo inspeccionando. En segundo lugar,  podréis vislumbrar [el front-end](/APP%20WEB/__frontend__produccio__/landingPage/) de la aplicación: que he desarrollado con HTML5, CSS y Javascript puro (sin frameworks) y, finalmente, una [base de datos](/APP%20WEB/___BBDD___/estructuraTaules/pirApp.sql) hecha con mySQL que contiene dos tablas de usuarios -a la que por ahora, y en este ejemplo, solo tocaremos una (la tabla "usuari")-.

La gracia de la aplicación web que contiene este repositorio es que mediante el back-end se ha intentado (y, en mi opinión, conseguido) hacer una réplica de la lógica de negocio que sigue Netflix cuando un usuario, con el objetivo de introducir los datos en el sistema por primera vez, envía su correo a través del formulario de registro que aparece nada más entrar en la "landing-page". 

Cuando el usuario lo mande, en Netflix, entra en la antesala de un sistema preparado para brindarle, con la máxima sencillez posible, la inscripción a un servicio por suscripción. En este caso de uso el sistema evalúa cuál es el estado actual del usuario en la base de datos: en función de ello la aplicación le muestara a éste un camino u otro. Si el usuario está registrado o no lo está, o bien si al estar registrado está pagando por servicios o no, son distintos escenarios que generarán también por parte del back-end distintas redirecciones del usuario a distintas páginas de acuerdo a lo que se especifica en el [diagrama de flujo (replica Netflix)](#3-diagrama-de-flujo-replica-Netflix) que mostraremos en el siguiente apartado.

Para el diseño de la aplicacion de mercApp se ha usado la misma lógica de la réplica de este sistema de NetFlix, pero adaptada a nuestro caso particular: en lugar de redirigir al usuario a escoger planes de suscripción le redirigimos a poder iniciar sesión en su cuenta de google para darnos acceso a sus tikets digitales, de acuerdo con lo que se especifica en el [diagrama de flujo (mercApp)](#4-diagrama-de-flujo-mercApp)

Además, la comunicación entre front-end y back-end la he realizado en todo caso mediante API (usaremos la interfaz nativa del navegador fetch-api en el front-end para que este pueda "consumir" los endpoints que nos proporciona la rest-API del back-end). En todo caso se ha seguido en la medida de lo posible los principios REST (véase nota al pie[^1]). Así pues, debe quedar claro que el back-end y el front-end son dos proyectos separados que están en comunicación entre ellos y que el back-end, además, se comunicará con la base de datos (que será un tercer proyecto). Así pues, la ventaja de hacerlo por separado con tres proyectos distintos, por ejemplo, es que se podría reescribir por completo el proyecto front-end en otra tecnología basada en componentes (por ejemplo Angular, React o Vue) sin tener que hacer modificación alguna en el back-end, o incluso podría usarse este back-end para permitir que sus endpoints sean consumidos por otras aplicaciones además del front-end web: por ejemplo, una aplicación en android. O más todavía: utilizar la misma base de datos y cambiar de framework de back-end por ejemplo, en un futuro.


# 2. Recomendaciones para ejecutar el proyecto

Se recomienda al lector que, si quiere probar y ver la aplicación web con todas sus características, empiece haciendo un clone del repositorio en local usando su terminal:

```git clone https://github.com/blackcub3s/miApp```

Acto seguido, que abra y ejecute cada uno de los tres proyectos con su editor correspondiente. De este modo, cada editor expondrá una URL y un puerto en el mismo equipo[^2] simulando un servidor distinto para cada uno:

- **[el front-end](/APP%20WEB/__frontend__produccio__/landingPage/)**: se recomienda abrirlo con el editor `vscode`, y ejecutar la página [pas1_landingSignUp.html](/APP%20WEB/__frontend__produccio__/landingPage/pas1_landingSignUp.html) mediante la extensión "live server".
- **[La base de datos](/APP%20WEB/___BBDD___/estructuraTaules/pirApp.sql)**: se aconseja abrirla y definir una conexión con la misma mediante el editor `mysql workbench`.
-  **[El back-end](/APP%20WEB/__springboot__produccio__/)**: se propone ejecturarlo mediante el editor de Java `IntelliJ idea`. Para hacerlo hay que buscar el archivo `AppApplication.java`, donde se situa la función main que en ser llamada activa todo el proyecto, y correrlo mediante "ctrl + shift + F10".  
    - >Las dependencias necesarias para el proyecto Spring Boot pueden ser consultadas en el archivo [pom.xml](/APP%20WEB/__springboot__produccio__/app/pom.xml)

Como se ha comentado, cada uno de los tres proyectos necesita su propio puerto para poder vivir en el localhost. Para que los tres funcionen directamente sin hacer cambios en la configuración del front, back o sistema de gestión de la base de datos recomiendo al usuario que se asegure que:

- 1. El front-end esté ejecutándose en el puerto por defecto de Vscode, el **5500**,  en la dirección IP loopback 127.0.0.1. (es decir en `localhost:5500`).
- 2. la base de datos esté exponiéndose en el puerto por defecto de mysql workbench, **3306** de la mencionada dirección.
- 3. El back-end de Spring Boot sea accesible a través del puerto por defecto **8080**.

Es indispensable que se respeten estos puertos porque en las distintas fetch-APIs del front-end apuntamos al puerto 8080. Asimismo, en los controladores de Spring Boot permitimos consumir las APIs de orígenes cruzados solamente desde el puerto 5500 y, finalmente, dentro del archivo [application.properties](/APP%20WEB/__springboot__produccio__/app/src/main/resources/application.properties) del back-end especificamos que la base de datos está en el puerto 8080.

# 3. Diagrama de flujo (replica netflix)

Como se ha comentado anteriormente, este sistema de registro y de iniciar sesión ha sido el resultado de un proceso de desarrollo inverso que ha venido motivado por la observación pormenorizada del funcionamiento de las etapas iniciales del proceso de registro de Netflix. Por ello, el comportamiento de la aplicación que describimos en este diagrama de flujo es aplicable por partida doble: tanto para la aplicación que he creado como para lo que se puede observar en la página oficial de Netflix.

El diagrama de flujo[^5] es el siguiente (está en catalán dado que, por consistencia con los nombres de archivos y de variables del programa me pareció mejor opción que cambiar todos los nombres de los archivos html del proyecto):

<div align="center">
  <img src="/img/diagramaTikzDefinitiu.svg" alt="diagrama svg no cargó" />
</div>

Este diagrama se puede entender del siguiente modo:

1. Cada rectángulo de color naranja es una página estática .html de nuestro proyecto.
2. Cada rombo de fondo **amarillo** es una decisión que se hará dentro del **back-end** de Spring Boot, dado que requiere hacer consultas a la BBDD y contiene datos sensibles.
3. Los rombos de fondo azul se decidirán en el front-end en tanto que sus decisiones no requieren consultar información personal en la base de datos y no precisan, por lo tanto, del uso del back-end (y, además, no se explicarán en este readme).
4. El paréntesis que incluye la extensión de una URL debajo de cada rectángulo naranja es cada página de Netflix cuyo comportamiento y, en menor medida, aspecto, se ha intentado replicar en el archivo .html del rectángulo naranja que le es contiguo. Por ejemplo, el archivo .html `pas2A_infoBenvinguda.html` de este proyecto es una réplica de la página especificada en el paréntesis `netflix.com/signup/registration` y el usuario llegará a ella a través del proceso de registro gracias a la aplicación de una lógica de back-end similar a la que usa Netflix. 







# 4. Diagrama de flujo (mercApp)


El diagrama de flujo[^5] es el siguiente (está en catalán dado que, por consistencia con los nombres de archivos y de variables del programa me pareció mejor opción que cambiar todos los nombres de los archivos html del proyecto):

<div align="center">
  <img src="/img/diagramaTikzDefinitiu.svg" alt="diagrama svg no cargó" />
</div>

Este diagrama se puede entender del siguiente modo:

1. Cada rectángulo de color naranja es una página estática .html de nuestro proyecto.
2. Cada rombo de fondo **amarillo** es una decisión que se hará dentro del **back-end** de Spring Boot, dado que requiere hacer consultas a la BBDD y contiene datos sensibles.
3. Los rombos de fondo azul se decidirán en el front-end en tanto que sus decisiones no requieren consultar información personal en la base de datos y no precisan, por lo tanto, del uso del back-end (y, además, no se explicarán en este readme).
4. El paréntesis que incluye la extensión de una URL debajo de cada rectángulo naranja es cada página de Netflix cuyo comportamiento y, en menor medida, aspecto, se ha intentado replicar en el archivo .html del rectángulo naranja que le es contiguo. Por ejemplo, el archivo .html `pas2A_infoBenvinguda.html` de este proyecto es una réplica de la página especificada en el paréntesis `netflix.com/signup/registration` y el usuario llegará a ella a través del proceso de registro gracias a la aplicación de una lógica de back-end similar a la que usa Netflix.


>⚠️ **NOTA**: es muy importante hacer notar que las consultas de datos personales a la base de datos -correos y contraseñas- no se deben hacer desde el front-end, porque los archivos del front-end son públicos para el usuario y podrían exponer las bases de datos (y los datos de los usuarios) a vulnerabilidades. Además las contraseñas jamás deben almacenarse directamente (como, por simplicidad demostrativa, se ha hecho en este proyecto), sino que hay que usar una función de hash para evitar que nadie pueda acceder a las contraseñas si hubiesen vulnerabilidades o par evitar que los propios gestores de la base de datos tengan información sensible de los propios usuarios.























## 3.1 Página inicial (landing page)

La página inicial de Netflix, a la que denominamos, `pas1_landingSignUp.html` nos muestra la siguiente "landing page": 

![página inicial Netflix no cargó](https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/SISTEMA%20LOGIN%20REPLICAT%20DE%20NETFLIX/pas1_landingSignUp.PNG)

Nuestra página replicada [pas1_landingSignUp_.html](/img/pas1_landingSignUp_.png) tiene este aspecto:

![replica pagina inicial netflix no cargó](https://github.com/blackcub3s/miApp/blob/609d440db083e853ea9a6000fa0ba83d4d0905b9/imatges%20replica/pas1_landingSignUp_.png)

Lo más importante que tiene es el botón de iniciar sesión en la parte superior derecha y el formulario para mandar el correo y registrarse en caso que un usuario no lo esté. En este repositorio nos centraremos **únicamente** en este último aspecto: el formulario de registro. Con ello será suficiente para hacer una pequeña, pero exhaustiva, primera aproximación al framework Spring Boot.

Desgranaré, en los subapartados 3.1.1 a 3.1.4, los distintos tipos de clases que hay que escribir en un proyecto Spring Boot para conseguir que el back-end consiga entrar en una decisión concreta del [diagrama de flujo](#3-diagrama-de-flujo) que describe el comportamiento de la aplicación</u>. En estos apartados describiré como se efectúa en el back-end la decisión mostrada en el rombo "Existeix correu" o "existe correo" (es decir, cuando Spring Boot está comprobando si un usuario existe en el sistema o no). Para ello, deberemos tener en mente el siguiente esquema de estructura del proyecto y el concepto de "inyección de dependencias" que también explicaremos en los próximos apartados y que es fundamental para entender como se pasa información de una clase de java a la otra dentro del mismo proyecto Spring Boot sin necesidad de instanciar un nuevo objeto dentro del constructor de cada clase que dependa de otra. Si al lector le interesa saber por qué hemos escogido este tipo de organización (`by feature y by layer` -por característica y capa-, en lugar del esquema `by feature`a secas o `by layer` a secas puede consultar el [Anexo](#Anexo)).

![esquema estructura byFeature byLayer no ha carregat](/img/byFeatureByLayer.jpeg)

Es importante que el lector entienda que cuando se programa un back-end en Spring Boot primero vamos a programar la clase `Usuari.java`, `luego UsuariRepositori.java`, luego `UsuariServei.java` y luego `UsuariControlador.java`. Sin embargo, en cada uno de los cuatro subapartados siguientes se desgrana cada una de estas clases en orden inverso (empezando por el último, el controller). Bajo mi punto de vista, es más didáctico y sencillo de entender si al lector se le presenta la información desgranada de este modo. Empezamos:


### 3.1.1 definición de la clase "controller": del front-end al back-end y viceversa (endpoints, puertos y conexión con bbdd)

Cuando un usuario introduce su correo en el formulario de registro de la landing page y le da al botón de registro se va a mandar el correo desde el front-end a un endpoint de la API REST del back-end -en este caso, el endpoint está en la línea 171, que es esta URL: `'http://localhost:8080/api/usuariExisteix'`-. La información viajará a través del _cuerpo_ o body de la solicitud POST mediante formato JSON: en este caso particular, si el correo introducido fuese `asd@ijk.com` entonces el mensaje transmitido sería un objeto Javascript que tendría esta forma: `{"email":"asd@ijk.com"}`:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__frontend__produccio__/landingPage/pas1_landingSignUp.html#L171-L177

Asimismo, dentro del back-end de Spring Boot queremos exponer al front-end el *endpoint* correspondiente para recibir el cuerpo de esta solicitud. Los distintos *endpoints* en Spring Boot (y probablemente en otros frameworks de back-end) van a ser definidos dentro de lo que llaman una clase "controller" o controlador. En este caso, la clase controlador que nos ocupa está en el archivo `UsuariControlador.java`, en donde tenemos especificado que -por seguridad- SOLO se permita el acceso cruzado desde la IP loopback y el puerto 5500 (básicamente, el front-end de vscode). 

Siguiendo con el ejemplo anterior, la solicitud POST (que lleva `{"email":"asd@ijk.com"}` en el cuerpo) hecha desde el front-end será recogida en formato JSON por el endpoint del back-end (`localhost/api/usuariExisteix`). Acto seguido, ésta será resuelta con una petición de vuelta, también en formato JSON, por la función `verificarUsuari` con información que viajará de nuevo por el cuerpo de la respuesta de la solicitud POST: es decir, ahora el cliente recibirá en el código Javascript un  ``{"existeixUsuari": false, "teAccesArecursos": false}``, ya que el usuario de correo `asd@ijk.com` no existe en la base de datos de usuarios y menos tiene acceso a recursos. Fijaros bien en la anotación `@CrossOrigin` de la línea 33, en donde definimos la IP del front-end desde donde se permite que nos manden datos:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__springboot__produccio__/app/src/main/java/pirapp/app/Usuaris/controlador/UsuariControlador.java#L31-L52

Finalmente hay que mencionar que la base de datos también se especifica en el proyecto. Especificamos su puerto e IP dentro del archivo `application.properties` (esto será de relevancia para entender luego como vinculamos la información de la base de datos con la clase Usuari):

https://github.com/blackcub3s/miApp/blob/f2321cda760d75436d16658b72a4507e5701f507/APP%20WEB/__springboot__produccio__/app/src/main/resources/application.properties#L4-L8


### 3.1.2 La clase "service" (la lógica de negocio)

Si nos hemos fijado en el subapartado anterior, habremos visto que la clase controlador llamaba a una función de un objecto "serveiUPP", de tipo "UsuariServei":

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__springboot__produccio__/app/src/main/java/pirapp/app/Usuaris/controlador/UsuariControlador.java#L39

Vamos ahora a ver el cuerpo de esta función en la clase usuariServei (clase "service" o "servicio") que en esencia lo que hace es implementar la lógica de negocio de nuestra app. Cómo vamos a obtener el booleano que nos permite determinar si un usuario está registrado? Pues así:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__springboot__produccio__/app/src/main/java/pirapp/app/Usuaris/servei/UsuariServei.java#L35-L41

En esencia lo que hacemos en la función `usuariRegistrat(String eMail)` es pasar como parámetro el mail que hemos obtenido desde el controlador (que de hecho proviene en primera instancia del formulario de registro que un usuario web acabe de mandar) y ver si este mail se encuentra en la base de datos de usuarios. Si se encuentra en la bbdd -es decir, el usuario ya estaba registrado en la tabla de usuarios- la variable `mailUsuari` tendrá un string dentro. En caso que no -usuario no registrado-, la consulta a la base de datos no devolverá ningún resultado (en cuyo caso el tipo "Optional", que envuelve el tipo String, permitirá evitar errores). Finalmente, el juicio de si existe o no existe un usuario en base a esta lógica lo efectuamos en el return (con `mailUsuari.isPresent()`) que es una función va en tandem con el tipo `Optional<String>`

Bien, y después de esto nos preguntaremos... ¿Y dónde están las consultas a la base de datos? Porque bien que estamos haciendo consultas en una base de datos... ¿verdad? Pues esto nos lleva a hablar en el siguiente subapartado de la clase repositorio. A esta clase llegamos ahora ya que, el lector probablemente habrá observado que en la función de la clase "service" de la que hemos hablado tenemos una llamada al objeto "repoUsuari" que pertenece a la clase `UsuariRepositori.java`:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__springboot__produccio__/app/src/main/java/pirapp/app/Usuaris/servei/UsuariServei.java#L38


### 3.1.3 Definición de la clase "repository" (las consultas a la BBDD)

La clase `UsuariRepositori.java` (en el título, "repository" del inglés) implementa una interfaz que hereta las funciones de la clase JpaRepository (de ahí la palabra `extends`). Es en `UsuariRepositori.java` en donde escribiremos las consultas con lenguaje mySQL que queramos lanzar sobre la tabla de usuarios (si no queremos escribir estas consultas, en determinados casos, podremos evitarlo porque ya hay funciones predefinidas dentro de JpaRepository que permiten solucionar peticiones frecuentes en bbdd). Estas queries se especifican mediante la anotación Java `@Query` encima de cada una de las cabeceras de las funciones que escribamos. Cada una de estas funciones no va a tener cuerpo en realidad, y su cabecera va a actuar como un sistema para pasar valores por parámetro a la query mysql, por un lado; y un sistema para devolver el resultado de la query o consulta con el tipo de datos que especifiquemos para el return, por el otro.

Así las cosas, aquí tenemos la función `trobaStringUsuariPerCorreu(eMail)` de la clase *repository* (`UsuariRepositori.java`), de la que hemos hablado al final del apartado anterior donde se puede apreciar la cabecera de la función con la anotación `@Query` por encima.

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__springboot__produccio__/app/src/main/java/pirapp/app/Usuaris/repositori/UsuariRepositori.java#L27-L28

Si prestáis antención veréis que existe otra anotación denominada `@Param` y que esta anotación toma el parámetro "emailete". Asimismo, el valor que se pasa en la query mysql es el parámetro anterior con dos puntos delante (":emailete") y no tiene directamente el nombre "eMail" que proviene del parámetro de entrada de la función. Esto es porque al hacer la consulta mysql a través de la anotación @Param hace que el propio framework de back-end nos ayude a protegernos contra ciberataques como, por ejemplo, la inyección de mysql -no queremos que ningún usuario ponga consultas sql en donde deberían haber valores, verdad?-.

### 3.1.4 Definición de la clase "Usuari" (ORM y mapeado de objeto Java a fila de entidad de BBDD)

Una de las cosas que implementa Spring Boot es la posibilidad de mapear un objeto de una clase de Java con la línea de una tabla mysql mediante el uso de la anotación `@Entity`. Es lo que llaman ORM o "Object Relational Mapping". Vamos a comparar el DDL[^3] de la tabla "usuari" de mySQL con la clase anotada con `@Entity` que mapea a esa tabla (entidad y tabla son sinónimos), para verlo más claro Aquí tenemos la tabla Usuari en mySQL:

https://github.com/blackcub3s/miApp/blob/22f1209e754163440caa718ee0a6787a48b0944d/APP%20WEB/___BBDD___/estructuraTaules/pirApp.sql#L5-L13

Y aquí tenemos la clase Java que mapea a la tabla usuari de mySQL: 

https://github.com/blackcub3s/miApp/blob/f9ada4be41a84beed2ae312fd33dbe4e6102975c/APP%20WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/model/Usuari.java#L20-L42

Es fácil ver que cada atributo Java simplemente está mapeando o estableciendo una relación de cada columna de la tabla con un atributo de la clase Java. Por ello, si hacemos una instancia de esa clase Java, tendremos simplemente una fila de la tabla mysql usuari recogida en ese objeto.

Sin embargo, no todo el monte es orégano. También hay que especificar muchos detalles en el código Java y ser muy preciso para que el mapeo ORM entre ambos funcione correctamente: 

* En primer lugar, cada atributo Java requiere la anotación `@Column` en la que se va a especificar dentro de la misma el nombre del campo de la base de datos al que queremos mapear.
* En segundo lugar, en el DDL de mySql es importante que se siga la notación `underscore_case` (nombre_variable), que es la que se seguirá al pasar el parámetro dentro de `@Column` (por un lado); y en los atributos Java de la clase mapeada dentro de la clase del "model" hay que usar la nomenclatura `camelCase` (nombreVariable). En caso contrario, también dará errores.
* En tercer lugar, si la columna de la tabla mySQL es NOT NULL, hay que poner el parámetro `nullable = false`.
* En cuarto lugar, hay que vigilar con las correspondencias de tipos de datos de mySQL y tipos de datos reconocidos en Java y en JPA. Por poner un ejemplo, el tipo de datos mySQL "tinyInt" usado en el campo `pla_suscripcio_anual` de la tabla usuari no existe con este mismo nombre en Java. Sin embargo, dado que un tinyInt de mySQL ocupa exactamente 1 byte y con esta cantidad de información podemos representar el mismo rango de datos (numeros desde el 0 a 7[^4]) para mapear a "tinyInt" podemos, simplemente, usar el tipo de datos no primitivo de Java denominado "Byte". Las otras opciones de tipos recomendados por JPA (Java Persistence API) realmente fallaron.
* En quinto lugar, las relaciones de dependencia entre tablas se pueden definir dentro de Java pero, en mi caso, han dado problemas así que las dejaré definidas dentro del código mysql y en la lógica de programación deberé gestionar plenamente de forma manual la inserción de datos en cada tabla.
* En sexto lugar, si tenemos una clave primaria hay que usar la anotación `@Id` en Java, porque si no lo hacemos al implementar la interfaz repository como una clase que herede de la clase JpaRepository nos dará error. Esto pasará porque JpaRepository nos pide especificar el tipo de datos de la clave primaria de la Entity en cuestión, en este caso la entity Usuari (Java debe saber también cuál es esa clave primaria). La especificación mencionada se hace en el tipo de datos que sale en negrita: _public interface UsuariRepositori extends JpaRepository<Usuari, **Integer**>_

En este caso parte de los problemas derivados de la definición de la clase `Usuari.java` vienen producidos por una decisión que he tomado como desarrollador: la decisión de escribir mi propio código mySQL y validarlo luego con JPA e Hibernate en lugar de dejar que estas librerías de Java creen las bases de datos por sí mismas. A menudo este es el comportamiento que se busca con JPA e Hibernate; sin embargo, considero que esta forma de proceder quita control sobre el desarrollo de la BBDD al desarrollador. Es cierto que el trabajo es doble al definir tanto el DDL en una base de datos como la clase Java con la anotación @Entity, pero así no solo se gana en control, sino también en libertad al poder poder virar a otra plataforma si en un futuro así lo decide el desarrollador o poder escalar más fácilmente la base de datos.

Para poder hacer que JPA no cree por nosotros las tablas en mySQL, sino que valide que las que nosotros hemos programado correspondan a la perfección con la clase mapeada en el "model" debemos asegurarnos que tenemos una línea en el `application.properties` donde se especifique que el automatismo del DDL que ofrece JPA esté configurado en "validate". Así, solo con esta línea de configuración, no permitiremos que Java pueda crear o eliminar tablas:

https://github.com/blackcub3s/miApp/blob/c25ef5ba7e742f38300430c72d3f8f8357bb0ddf/APP%20WEB/__springboot__produccio__/app/src/main/resources/application.properties#L14

> NOTA: Ya para terminar con el "model" es imporante especificar que las clases de Java del model (es decir, las que tienen `@Entity`) nos permiten evitar escribir constructores con y sin parámetros, getters, setters, etc.(que es lo que hay que hacer cuando creamos una clase en Java y que es tan mecánico que incluso editores como netbeans permiten generarlos automáticamente). En este caso, empero, tenemos una librería en Spring Boot que se denomina `Lombok`y va más allá. Esta librería no solo nos asiste como lo haría Netbeans, sino mejor. De hecho permite escribir unas anotaciones que crean automática e invisiblemente los constructores (@NoArgsConstructor, @AllArgsConstructor), y una sola anotación (@Data) que crea del mismo modo los getters, setters, etc. sin que nosotros los veamos escritos, actualizándolos automáticamente incluso si cambiamos nombres de atributos. Así se reduce escribir el código mecánico "boilerplate" que caracteriza las clases de Java y, lo más importante, que nos olvidamos de mantenerlo también: si hacemos cambios en el nombre de un atributo Java, por ejemplo, ya no tendremos que preocuparnos sobre cambiar el nombre del getter y setter para ese atributo porque Lombok lo hará por nosotros automáticamente.


### 3.1.5 La inyección de dependencias

Antes hemos visto que en la clase controlador (`UsuariControlador`) llamamos una función de la clase servicio (`UsuariServei`). De forma análoga, dentro de la clase `UsuariServei` llamamos a una función de la clase `UsuariRepositori`. Por lo tanto, para conseguir hacer esto podríamos haber hecho nuestro programa de dos formas:

- **FORMA 1. instanciar objetos**: este es el método menos óptimo y requiere:
    - A. Instanciar dentro de la clase `UsuariControlador` una instancia u objeto de la clase `UsuariServei`.
    - B. Instanciar dentro de la clase `UsuariServei` un objeto de la clase `UsuariRepositori`.

- **FORMA 2. inyectar dependencias**: Esta es la forma más correcta de desarrollar nuestra aplicación, porque facilita los tests unitarios y los cambios en la clase sin tener que modificar código en las clases en donde se inyectan las dependencias en cuestión. Este método requiere, para el caso que nos ocupa:

    - A. Que vayamos a la clase controlador e inyectemos un atributo de tipo `UsuariServei` (clase servicio) y, acto seguido, lo pasamemos por parámetro por el constructor de la clase controlador con la anotación `@Autowired`. 
    - B. Que vayamos a la clase servicio e inyectemos un atributo de tipo `UsuariRepositori` y luego lo pasemos por parámetro por el constructor de la clase `UsuariServei` con la anotación `@Autowired`. Por ejemplo, en este último caso lo que hemos hecho ha sido esto:

    https://github.com/blackcub3s/miApp/blob/2f730ce5c1b1c23a573ff47b9dc6b5fe194b09d8/APP%20WEB/__springboot__produccio__/app/src/main/java/miApp/app/Usuaris/servei/UsuariServei.java#L22-L33

Para más información 
https://stackoverflow.com/questions/3386889/difference-between-creating-new-object-and-dependency-injection

>NOTA: Existe la inyección de dependencias por campo en lugar de la inyección de dependencias por constructor (pondríamos autowired directamente encima del atributo de la clase). Sin embargo, esta es menos recomendada.


## 3.2 Redirección a página de inicio de sesión (usuario registrado, con acceso arecursos)

Pongamos por caso que en el controlador del que hablamos en el apartado 3.1.1 recibimos via API REST un JSON del estilo `{"email":"acces@gmail.com"}`, ya que en la landing page el usuario ha introducido esto en el formulario:

![no se mostro iniciar sesión landing](/img/correuAmbAccesLanding.png)

Cuando ya sepamos que existe en la tabla usuari ese correo, luego si además el usuario que controla esta cuenta de correo tiene acceso a recursos de nuestra aplicación, el back-end aplicará la lógica de negocio previamente mencionada en el apartado 3.1 y subapartados 3.1.1 a 3.1.4 y conseguirá que nuestro front-end reciba del servidor `{"existeixUsuari": true, "teAccesArecursos": true}` (si el lector quiere probar la aplicación verá como se imprime la consulta al *endpoint* con una alerta -esto en producción no se imprimiría-).

Al obtener este objeto Javascript en el front-end (que previamente era un Hashmap en el back-end de Java por cierto, pero la API REST y JSON permite que pasemos información entre distintos lenguajes aprovechando que ambos lenguajes tienen objetos de par clave:valor similares) ello permitirá que la aplicación dictamine que el usuario se ha "confundido" poniendo su correo en el campo de registro y, para permitir reconducirle, le mandará automática y directamente a la página de login o iniciar sesión (la misma a la que se accede a la parte superior derecha de la barra de navegación). 

Para que el usuario no se moleste en reintroducir el correo electrónico en el campo de correo de la pantalla de [iniciar sesión](/APP%20WEB/__frontend__produccio__/landingPage/pas2C_login.html), se ha conseguido que este email pase de una página a otra por el front-end via localstorage, como vemos en el código Javascript:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__frontend__produccio__/landingPage/pas1_landingSignUp.html#L191-L196

Y se recogerá en la página de [iniciar sesión](/APP%20WEB/__frontend__produccio__/landingPage/pas2C_login.html) en la siguientes líneas de código:

https://github.com/blackcub3s/miApp/blob/9d06a71d4e7966cfe74a9e770beeb251e6a7bb50/APP%20WEB/__frontend__produccio__/landingPage/pas2C_login.html#L27-L37

Mostrándose así:

![no se mostró imagen iniciar sesion](/img/correuAmbAccesLogin.png)


## 3.3 Redirección a página de introducir contraseña (Existe correo de usuario y contraseña, pero el usuario NO tiene acceso a recursos)

En este caso se devolverá desde el back-end al front-end el siguiente JSON: `{"existeixUsuari": true, "teAccesArecursos": false}`. Por lot tanto, aquí nos interesa redirigir al usuario desde la landing page hasta [pas2B_introduirContrasenya.html](/APP%20WEB/__frontend__produccio__/landingPage/pas2B_introduirContrasenya.html) dado que el usuario no va tener los mismos privilegios de iniciar sesión que el usuario que está en el paso 3.2, dado que no está pagando por recursos; pero sí que en el pasado o bien se empezó a registrar o bien estuvo pagando por unos recursos a los que ahora ya no tiene acceso (e.g., porque anuló la suscripción de pago).

En este caso solo quedaría pedirle que introduzca su contraseña para luego llevarle a escoger qué plan quiere (directamente le llevaríamos a <b>pas5_EscullPlan.html</b>, archivo que para esta demostración no hemos creado).

## 3.4 No existe correo (no existe usuario)

 Si se devuelve `{"existeixUsuari": true, "teAccesArecursos": false}` al front-end ello significará que el usuario no está registrado en nuestra web. Nunca ha iniciado un proceso de registro que culminase con una introducción de correo y de contraseña y, por lo tanto, debemos redirigirle al primer paso [pas2A_infoBenvinguda.html](/APP%20WEB/__frontend__produccio__/landingPage/pas2A_infoBenvinguda.html). No será hasta que el usuario haya introducido el correo y la contraseña en el siguiente paso [pas2B_introduirContrasenya](/APP%20WEB/__frontend__produccio__/landingPage/pas2B_introduirContrasenya.html) que el usuario estará formalmente registrado en la base de datos (inicialmente sin acceso a recursos).



# Anexo

Existen `tres` formas de organizar un proyecto Spring Boot, cada una con sus ventajas y sus desventajas. Las desgranaremos poniendo un ejemplo con la estructura que habría tomado este pequeño proyecto con cada una de ellas:


* `By Feature` (por característica de la app): Si se hubiese escogido esta forma de estructurar el proyecto habría tenido el aspecto que tiene la imagen siguiente. Este tipo de organización permite que cuando hay pocos archivos estos se encuentren rápidamente. Sin embargo, si una característica requiere múltiples clases en el model, también requerirá múltiples repositorios, múltiples servicios... La gracia de organizar por característica es que estén juntos solamente los archivos de distintas capas que funcionen juntos (y esto no se consigue cuando la aplicación crece).

![esquema estructura byFeature no ha carregat](/img/byFeature.jpeg)

* `By layer` (por capa): Hemos comentado en este readme que un proyecto Spring Boot se organiza en distintas capas (modelo, repositorio, servicio y controlador). Si separamos en carpetas -"packages, en Java"- cada una de ellas encontraremos por ejemplo todas las definiciones de base de datos mediante ORM en una sola carpeta (model); todas las clases de definiciones de consultas de bases de datos en otra (repository); todas las clases para definir endpoints en otra (controlador)... Esto puede ser útil cuando el proyecto es pequeño, y cuando crece en mi opinión es más claro usar este enfoque que usar el enfoque *by feature*; sin embargo, si crece mucho tendremos múltiples "entities" dentro de los archivos de definición de "model" y éstas van a apuntar a características muy diferentes. Por ejemplo, imaginemos la tabla de usuarios con sus datos (entity usuaris) y una tabla de base de datos donde guardásemos los distintos paises a los que pertenecen las IPs entrantes que se conectan a nuestra aplicación. Si en este caso no nos importase mapear a qué usuario pertenece cada IP, eso supondría que cada una de las Entities (clases Java dentro del model) mapearía a una tabla de BBDD que pertenecería o apuntaría a una caracteristica distinta de la aplicación. Entonces estas dos clases no tendría sentido que estuviesen juntas aunque ambas sean clases de capa.

![esquema estructura byLayer no ha carregat](/img/byLayer.jpeg)

* `By Feature and by layer` (por característica y por capa): Esta forma de estructurar es la que **ha sido escogida para este proyecto**: dado que el proyecto se prevé que crezca bastante en el futuro, este tipo de organización es el más robusto para para mantener las clases organizadas. Lo que se hace es organizar por capa DENTRO de cada característica:

![esquema estructura byFeature byLayer no ha carregat](/img/byFeatureByLayer.jpeg)


[^5]: El diagrama fue hecho en tikz, paquete de LaTeX. Si el lector quiere saber como se ha hecho el mismo desde el diagrama original a mano alzada puede consultar mi repositorio [diagramaTikz](https://github.com/blackcub3s/diagramaTikz).

[^1]: La forma como yo entiendo estos principios es que hay que conseguir que cada solicitud al servidor mediante la API sea suficiente en sí misma y sin estado que requiera persistencia en servidor, que los datos que se pasen a través de la solicitud de la fetch-API a los endpoints de la API del back-end se hagan mediante JSON con uno o varios pares de claves valor donde la clave explique claramente a qué se destina el valor, que se utilicen métodos HTTP que apunten a endpoints con estructura URL, etc.

[^2]: no es necesario configurar un servidor para correr los proyectos sino que podemos usar nuestro propio ordenador como si fuese un servidor -cuya IP será la de loopback y cada proyecto se expondrá en un puerto distinto que permitirá su comunicación con los demás.

[^3]: DDL: Data Definition Language. Cuando tenemos una sentencia mySQL con create, forma parte del DDL.

[^4]: En un byte tenemos tres bits y, con ellos, podremos representar el número 0 (**000**), el 1 (**001**), el 2 (**010**)... y hasta el 7 (**111**).
