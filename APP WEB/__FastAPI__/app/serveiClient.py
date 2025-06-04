#NOTAS PARA LOS LECTORES DE LA MEMORIA DIRIGIDOS A ESTE ARCHIVO:

#En este archivo ponemos las funciones que permiten hacer FastAPI actúe 
#como un cliente, mandando una petición POST a Spring Boot con el idUsuario 
#para el que queremos un nuevo token expedido, esta vez con permisos a 1 (el usuario que necesita esto
#ya tenia un token pero este era permisos a 0 y no permite visualziar el dashboard).

#Se hace así porque en FastAPI no tenemos conexion con mySql y porque la expedición de tokens se maneja
#desde Spring Boot en nuestra aplicación

#¡MUCHO CUIDADO! 
#--------------------------------------------------NOTA IMPORTANTE----------------------------------------  
#Se ha cambiado una especificación de la memoria: en la solicitud 
#POST a Spring Boot no se mandará el token de acceso que el usuario ha proporcionado a FastAPI; solo se recibirá un token en la response.

#El motivo de ello es porque el token de acceso 
# saliente de FastAPI podría caducar cuando ya se han persistido los datos
# a mongo DB. Si eso pasase, cuando llegase a Spring Boot el susodicho token, el framework de Java lo detectaría como token inválido y no persistiría
# el cambio de permisos a la tabla Usuaris de mysql (este cambio debería ser de 0 a 1 para así ir en consonancia con la persistencia de los tickets
# en mongo DB).
#
# Para evitar este fallo en el diseño mostrado en la memoria desde FastAPI hasta Spring Boot SOLO se mandarán 
# ciertos datos del payload. Esto será igualmente seguro porque pediremos a Spring Boot que solo reconozca 
# conexiones entrantes del Host y puerto de FastAPI.
# ------------------------------------------------------------------------------------------------------------------

#FUNCIO QUE OBTE EL NOU TOKEN AMB PERMISOS A 1 DE SPRING BOOT PERSONALOTZAT PER A L'idUsuari_enToken entrant
def obtenirTokenSpringBoot(idUsuari_enToken):
    tokenPermisosA1 = f"token per a dashboard de permisos a 1 i per idUsuari: {idUsuari_enToken}"
    return tokenPermisosA1

#PRE: - nTicketPersistits:  nombre de tickets que s'han persistit a mongo db (minim 2)
#     - idUsuari_enToken:   es l'id de l'usuari que te els permisos en token.
#     - permisos en token:   HA DE SER (convidat, que esta al pas4 per exemple)
#POST: 
#     - nouTokenAccesPermisosA1: rtorna nou token d'accés expedit des de spring boot i amb 
#      permisos a 1 (que permetra al frntend accedir al dashboard)
def expedeixTokenPerAdashboard_SI_SESCAU(nTicketsPersistits, idUsuari_enToken, permisos_enToken):
    if permisos_enToken == 0:
        if nTicketsPersistits < 2:
            nouTokenAccesPermisosA1 = "" #si hi ha menys de dos tickets no té cap sentit fer cap resum, no permetem que accedeixi a dashboard
        else:
            nouTokenAccesPermisosA1 = obtenirTokenSpringBoot(idUsuari_enToken)

    return nouTokenAccesPermisosA1