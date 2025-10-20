# 1. Introducción

En este repositorio muestro el código de la aplicación web del proyecto final de mi grado superior de DAW:

```
Creación de un dashboard para usuarios del ticket
digital de Mercadona con visualización gráfica de
datos: evolución de precios por producto, gastos
por categoría de alimentación y ventanas
temporales de gastos.
```


Esta aplicación permite hacer un análisis de tickets digitales del correo para los usuarios del ticket digital de mercadona y fue programada de cero mediante mútliples microservicios que permiten orquestrar la aplicación web (como veremos en el apartado 2).

Remitimos al lector a lo siguientes dos enlaces que le ayudarán, por un lado, a ganar comprensión de las complejidades del proyecto; y, por el otro, de entender cómo se han abordado los distintos problemas que han entrañado el desarrollo de esta aplicación: arquitectura, patrones de diseño, desacople entre los distintos microservicios, etc:

*memoria completa*  (120 páginas) $\rightarrow$ [memoria LaTeX](https://drive.google.com/file/d/12gHzV9FWSaKpbUgoN8VF0Hd1BpAlayGW/view)

*Presentación del proyecto* (79 d.)  $\rightarrow$ [presentación beamer](./APP%20WEB/memoriaLaTeX/presentacioMemoriaBeamer/presentacioMemoriaBeamer.pdf)



# 2. Microservicios programados

- [Spring Boot](/APP%20WEB/__springboot__produccio__/) (*Back-end primario*): con este back-end gestionamos  **los usuarios**, definiendo tres niveles de permisos para aquellos usuarios que se hayan registrado:

  * **0:** se concede cuando usuario es invitado (ya ha proporcionado correo y contraseña, pero nada más).
  * **1:** se concede cuando usuario antes invitado ha proporcionado tickets digitales Y ADEMÁS ha asegurado que se hayan persistido esos tickets en formato estructurado a mongoDB.
  * **2:** usuario tiene permisos de ADMIN, superusuario o administrador. Se lo concederemos manualmente al propio desarrollador (nosotros mismos).

- [FastAPI](/APP%20WEB/__FastAPI__/) (*Back-end secundario*): Un segundo back-end para el parseo, extracción y persistencia de los tickets digitales. También para dar la señal a Spring Boot que expida un nuevo token de acceso cuando termina dicho parseo, extracción y persistencia (*permisos = 0 **pasa a** permisos = 1*). Solo podrán acceder a endpoints de este back-end usuarios que estén registrados (permisos : {0,1,2}).

-  [Vanilla Javascript](/APP%20WEB/__FastAPI__/) (Front-end): se hizo con vanilla JavaScript, vanilla CSS y vanilla HTML (a excepción del uso de librerías animate.css, wow.js y chart.js).

>⚠️ **NOTA**: Se ha configurado Google Cloud para que cada usuario haga automáticamente la extracción de tickets desde su Gmail mediante interacción con el front-end de nuestra aplicación; concretamente el acceso a la Gmail API mediante OAuth2.0. A continuación Podéis ver un esquema general de los componentes de la aplicación, su interacción con las bases de datos y el cloud de google. Más información en la memoria, apartado despliegue; hay muchísimas páginas dedicadas a desgranar cada uno de ellos.

![imatge](/APP%20WEB/memoriaLaTeX/img/diagramaSistemesAplicacioMercapp.png)




# 3. Despliegue de los microservicios

## 3.1 Mediante editores de código

Se puede hacer el despliegue en local mediante los servidores embedidos en los editores de código correspondientes (véase apartado 3.2 de la [memoria](/APP%20WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto%20DAW_7S_SantiagoSanchezSans.pdf) en PDF).

## 3.2 Mediante contenedores Docker
También se permite el despliegue de cada componente o microservicio del apartado anterior en un contenedor Docker. Para ello, para cada subdirectorio de cada microservicio en la carpeta [APP WEB](/APP%20WEB) del repositorio (más información en apartado "3.3 despliegue" de la [memoria](/APP%20WEB/memoriaLaTeX/IESAbastos_2024-2025_Proyecto%20DAW_7S_SantiagoSanchezSans.pdf)) se ha proporcionado un Dockerfile y un script en bash para crear imagen y contenedor, como vemos en la figura: 

![imatge](/APP%20WEB/memoriaLaTeX/img/dockeritzacioAplicacioPlantilla.png)




# 4. Bases de datos



- **mySQL**: con mySQL hemos podido guardar los datos de los usuarios: correo, hash de contraseña y variable permisos principalmente. La base de datos contiene dos tablas de usuarios -a la que por ahora, y en este proyecto, solo tocaremos una (la tabla "usuari"): véase el DDL [aquí](/APP%20WEB/___BBDD___/estructuraTaules/mercApp.sql). 

- **mongoDB**: Donde persistimos los tickets, en una collection.

>⚠️ **NOTA 1**: a mySQL solo se persisten y leen datos desde Spring Boot. Mientras que a MongoDB la conexión es únicamente mediante fastAPI.

>ℹ️ **NOTA 2**: Para iniciar mongodb en mac es necesario activar la bbdd con este comando de zsh. En windows no es necesario hacer nada más que iniciar mongo db compass:

```
brew services start mongodb/brew/mongodb-community
```


# 5. Aspectos destacables

Se manejó el enrutamiento de vistas front-end mediante redirecciones con JavaScript en función de los valores devueltos en variables booleanas en endpoints a los que llamábamos en Spring Boot. Este enrutamiento se ha inspirado, mediante un proceso de desarrollo inverso, en el que utiliza la aplicación web de NetFlix ante usuarios. 

Explicación completa del diagrama y lo que significa cada caja, paréntesis, rombo y color puede encontrarse en el apartado 3.6.3. Enrutamiento de vistas de la [memoria](/APP%20WEB/memoriaLaTeX/auxiliars/diagramaMercAppFront.pdf).

![diagrama](/APP%20WEB/memoriaLaTeX/img/diagramaMercAppFront.pdf)



