#deriv la imatge de versio alpine que es lleugera
FROM python:3.11-alpine

#especifiquem directori de treball on hi haura l arrel de l aplicacio (estandar) 
WORKDIR /usr/src/app 

#PyPDF2p parseja pdf a text | pytz manejar be zones temporals a espanya | uvicorn important per a correr fastAPI
RUN pip install PyPDF2 && pip install pytz && pip install --no-cache-dir fastapi uvicorn

#copiem els scripts a l'arrel de la imatge
COPY app/controlador.py /usr/src/app/
COPY app/servei.py /usr/src/app/

# Nomes ho posem per documentacio. El port intern del contenidor es defineix en la comanda CMD de fastAPI
EXPOSE 8000

# comanda per defecte que s'executara a l'arrancar en desenvolupament
# CMD ["fastapi", "dev", "controlador.py"]

# Entorns de produccio fem servir "uvicorn controlador:app --reload". A aquesta comanda pots afegir
# el host i el port. Host 0.0.0.0, o IP comodí (network adress) permetra parlar amb altres 
# contenidors (ex. en kubernetes) o fins i tot amb el localhost de l'equip anfitrió del contenidor
# (podrem accedir al contingut del contenidor des de fora)
# faig explícid el port de fastAPI per claredat -per defecte es justament el 8000-.
CMD ["uvicorn", "controlador:app", "--host", "0.0.0.0", "--port", "8000"]