//PRE: un jwt de format header.payload.signature
//POST: un JSON amb les claims del JWT.
function decodificaPayloadJWT(token) {
    try {
        const payload = token.split('.')[1]; //Només cal fer un split i prendre el payload (segon element de l'split)
        const decodificat = atob(payload);
        return JSON.parse(decodificat); // exemple -- {{permisos: 0, idUsuari: 3, sub: 'noacces@gmail.com', iat: 1744214393, exp: 1744215293}
    } catch (e) {
      console.log('No s’ha pogut decodificar el token JWT:\n\n', e);
      return null;
    }
  }