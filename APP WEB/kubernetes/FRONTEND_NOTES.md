# Notas sobre el Frontend en Kubernetes

## Problema

El frontend (archivos HTML/JS estáticos) hace llamadas directas a:
- `http://localhost:8080` para Spring Boot
- `http://localhost:8000` para FastAPI

En Kubernetes, estos `localhost` no funcionan porque:
1. El frontend corre en un pod diferente a los backends
2. `localhost` dentro del pod del frontend se refiere al propio pod, no a los servicios

## Soluciones

### Opción 1: Usar NodePort para exponer los backends (Recomendado para desarrollo local)

Exponer los servicios de backend mediante NodePort y actualizar el código del frontend para usar las URLs correctas.

**Pasos:**

1. Modifica `fastapi-deployment.yaml` y `springboot-deployment.yaml` para exponer los servicios con NodePort:

```yaml
# En fastapi-deployment.yaml, cambia el Service:
apiVersion: v1
kind: Service
metadata:
  name: fastapi-service
spec:
  type: NodePort
  ports:
  - port: 8000
    targetPort: 8000
    nodePort: 30080  # Puerto externo
    protocol: TCP
```

```yaml
# En springboot-deployment.yaml, cambia el Service:
apiVersion: v1
kind: Service
metadata:
  name: springboot-service
spec:
  type: NodePort
  ports:
  - port: 8080
    targetPort: 8080
    nodePort: 30081  # Puerto externo
    protocol: TCP
```

2. Actualiza el código JavaScript del frontend para usar las URLs correctas:

   - Para Minikube: `http://<minikube-ip>:30080` y `http://<minikube-ip>:30081`
   - Para Docker Desktop: `http://localhost:30080` y `http://localhost:30081`

3. O mejor aún, usa variables de entorno inyectadas en tiempo de build o runtime.

### Opción 2: Configurar Nginx como Reverse Proxy

Modifica el Dockerfile del frontend para incluir una configuración de Nginx que actúe como reverse proxy.

1. Crea un archivo `nginx.conf` en `__frontend__produccio__/`:

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para FastAPI
    location /api/fastapi/ {
        proxy_pass http://fastapi-service:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Proxy para Spring Boot
    location /api/springboot/ {
        proxy_pass http://springboot-service:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

2. Actualiza el Dockerfile para copiar esta configuración:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

3. Actualiza el código JavaScript para usar rutas relativas:
   - `http://localhost:8000/api/...` → `/api/fastapi/...`
   - `http://localhost:8080/api/...` → `/api/springboot/...`

### Opción 3: Usar Ingress (Recomendado para producción)

Configura un Ingress controller (nginx-ingress, traefik, etc.) para enrutar el tráfico.

**Ejemplo de Ingress:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mercapp-ingress
spec:
  rules:
  - host: mercapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api/fastapi
        pathType: Prefix
        backend:
          service:
            name: fastapi-service
            port:
              number: 8000
      - path: /api/springboot
        pathType: Prefix
        backend:
          service:
            name: springboot-service
            port:
              number: 8080
```

Luego actualiza el código del frontend para usar rutas relativas.

### Opción 4: ConfigMap para URLs (Solución temporal)

Crea un ConfigMap con las URLs y úsalo para generar un archivo de configuración JavaScript que el frontend pueda leer.

## Recomendación para desarrollo local

Para empezar rápidamente, usa la **Opción 1** (NodePort). Es la más simple y no requiere cambios en el código del frontend si usas las IPs correctas.

Para producción, considera la **Opción 3** (Ingress) con un dominio real.

