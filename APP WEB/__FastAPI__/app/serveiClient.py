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




import httpx
import os

# Detecta si correm dins d'un contenidor Docker i ajusta la URL base
if os.path.exists("/.dockerenv"):
    BASE_URL = "http://host.docker.internal:8080"  # si es un contenidor docker accedim a Spring Boot així (en un entorn windows)
else:
    BASE_URL = "http://localhost:8080"  # si no corre en contenidor ho fem així


#FUNCIO QUE OBTE EL NOU TOKEN AMB PERMISOS A 1 DE SPRING BOOT PERSONALOTZAT PER A L'idUsuari_enToken entrant
async def obtenirTokenSpringBoot(idUsuari_enToken: int) -> str:
    payload = {"idUsuari": idUsuari_enToken}

    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        try:
            response = await client.post("/api/obtenerTokenPermisosDashboard", json=payload)
            response.raise_for_status()
            JSON_token = response.json() #tindria {"nouToken": "asdkjqwoiehqowdha"}
            return JSON_token["nouToken"] #retorna nomes el token
        except httpx.HTTPStatusError as e:
            print(f"Error HTTP: {e.response.status_code} - {e.response.text}")
            raise
        except httpx.RequestError as e:
            print(f"Error de conexión: {e}")
            raise











#PRE: - nTicketPersistits:  nombre de tickets que s'han persistit a mongo db
#     - idUsuari_enToken:   es l'id de l'usuari que te els permisos en token.
#     - permisos en token:   HA DE SER (convidat, que esta al pas4 per exemple)
#POST: 
#     - nouTokenAccesPermisosA1: si nTicketPersistits >= 2 retorna nou token d'accés expedit des 
#               de spring boot i amb permisos a 1 (que permetra al frontend accedir al dashboard).
#                                si nTicketsPersistits < 2 retorna un string buit
async def expedeixTokenPerAdashboard_SI_SESCAU(nTicketsPersistits, idUsuari_enToken, permisos_enToken):
    if permisos_enToken == 0:
        if nTicketsPersistits < 2:
            nouTokenAccesPermisosA1 = "" #si hi ha menys de dos tickets no té cap sentit fer cap resum, no permetem que accedeixi a dashboard
        else:
            nouTokenAccesPermisosA1 = await obtenirTokenSpringBoot(idUsuari_enToken)

    return nouTokenAccesPermisosA1




