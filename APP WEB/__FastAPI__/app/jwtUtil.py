from fastapi import Depends, HTTPException, status, Header
from jose import jwt, JWTError

SECRET_KEY = "a8f7d9g0b6c3e5h2i4j7k1l0m9n8p6q3r5s2t1u4v0w9x8y7z" #POSO MATEIXA CLAU SECRETA (SECRET) QUE A jwtUtil DE SPRINGBOOT
ALGORITHM = "HS256"

def verificar_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cabecera Authorization incorrecta",
        )
    
    token = authorization[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
        
        # Puedes verificar más cosas aquí, como el "sub", "exp", etc.
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
