# TO DO DOKERFILE NGINX
FROM nginx:alpine

#Elimina la configuración por defecto de Nginx i la substitueixo
#per la configuracio personalitzada (definir que localhost es 127.0.0.1, pq no ho agafa per defecte)
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# copio tots els arxius estatics de l'aplicacio 
# (docker ho fa de forma recursiva)
COPY app/ /usr/share/nginx/html

# exposa el port 80 dins contenidor (nomesw per termes de documentacio)
EXPOSE 80

# Aixi iniciem nginx (ja no cal fer que escolti en el 0.0.0.0:80
# perque ho fa per defecte)
CMD ["nginx", "-g", "daemon off;"]
