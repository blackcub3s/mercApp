from fastapi import Depends, HTTPException, status, Header
from jose import jwt, JWTError

SECRET_KEY = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z" #POSO MATEIXA CLAU SECRETA (SECRET) QUE A jwtUtil DE SPRINGBOOT
ALGORITHM = "HS256"

# AQUESTA FUNCIÓ no només valida el token amb el secret, sino que també impedeix que -carregada en el controlador
# corresponent- pugui entrar una solicitud si el toquen està caducat. No cal ni manejar la lògica amb els segons des de la 
# epoch: ho fa tot el framework.

#NOTA: Logica de quins endpoints estan autoritzats en funció de permisos es maneja a cada controlador corresponent.
def verificar_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cabecera Authorization incorrecta",
        )
    
    token = authorization[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  #decode ja fa la verificació també de si està caducat o no!
        return payload # torno el payload cap al controlador!
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )



#PRE: una llista amb permisos 0 1 i/o 2. Permisos_enToken un enter amb 0, o 1 o 2.
#POST: Si el token d'acces entrant al controlador on posem aquesta funcio
#      no te un dels permisos dins la llista llPermisosPermesos generara codi d'error 403
#  ---- NOTA: Aquesta funció la carregarem dins de cada controlador. ---
def permetSolicitudsEntrantsNomesA(llPermisosPermesos, permisos_enToken):
    permisosPermesos = [0,2] 
    if permisos_enToken not in permisosPermesos:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Els permisos permesos son només: {permisosPermesos}"
        )