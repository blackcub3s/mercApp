# Despliegue en Kubernetes - MercApp

Este directorio contiene los archivos de configuración para desplegar la aplicación MercApp en Kubernetes local.

## Estructura de la aplicación

- **Frontend**: Nginx sirviendo archivos estáticos (HTML, CSS, JS)
- **Backend FastAPI**: API en Python (puerto 8000)
- **Backend Spring Boot**: API en Java (puerto 8080)
- **MySQL**: Base de datos para Spring Boot (puerto 3306)
- **MongoDB**: Base de datos para FastAPI (puerto 27017)

## Prerequisitos

1. **Kubernetes local** instalado:
   - Minikube: `minikube start`
   - Docker Desktop con Kubernetes habilitado
   - Kind (Kubernetes in Docker)
   - K3s

2. **kubectl** instalado y configurado

3. **Docker** para construir las imágenes

## Pasos para el despliegue

### 1. Construir las imágenes Docker

Primero, construye las imágenes Docker desde cada directorio:

```bash
# Desde la raíz del proyecto
cd __FastAPI__
docker build -t back-end-fastapi:latest .

cd ../__springboot__produccio__
docker build -t back-end-springboot:latest .

cd ../__frontend__produccio__
docker build -t frontend-nginx:latest .
```

### 2. Cargar imágenes en Kubernetes (si usas Minikube)

Si usas Minikube, necesitas cargar las imágenes:

```bash
# Para Minikube
minikube image load back-end-fastapi:latest
minikube image load back-end-springboot:latest
minikube image load frontend-nginx:latest
```

O alternativamente, puedes configurar Docker para usar el daemon de Minikube:

```bash
eval $(minikube docker-env)
# Luego construye las imágenes normalmente
```

### 3. Configurar los Secrets

Edita `springboot-secrets.yaml` con tus credenciales de email:

```yaml
stringData:
  mail-usuari: "tu-email@gmail.com"
  mail-contra: "tu-password-app"
```

Luego crea el secret:

```bash
kubectl apply -f kubernetes/springboot-secrets.yaml
```

### 4. Desplegar las bases de datos (Opcional)

Si quieres desplegar MySQL y MongoDB en Kubernetes:

```bash
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
```

**NOTA**: Si prefieres usar MySQL y MongoDB locales (fuera de Kubernetes), necesitarás:

1. **Para MySQL local**: Actualizar `springboot-deployment.yaml` para usar `host.docker.internal` o la IP de tu máquina
2. **Para MongoDB local**: Actualizar `fastapi-deployment.yaml` para usar `host.docker.internal` o la IP de tu máquina

### 5. Desplegar los servicios de aplicación

```bash
kubectl apply -f kubernetes/springboot-deployment.yaml
kubectl apply -f kubernetes/fastapi-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
```

### 6. Verificar el despliegue

```bash
# Ver los pods
kubectl get pods

# Ver los servicios
kubectl get services

# Ver los logs de un pod
kubectl logs <nombre-del-pod>
```

### 7. Acceder a la aplicación

El frontend está expuesto mediante **NodePort** en el puerto **5500** (igual que en desarrollo con Docker).

- **Con Minikube**:
  ```bash
  minikube service frontend-service
  ```
  O accede directamente a: `http://<minikube-ip>:5500`

- **Con Docker Desktop**:
  Accede a: `http://localhost:5500`

## Configuración para bases de datos locales

Los deployments ya están configurados por defecto para usar bases de datos **locales** (fuera de Kubernetes):

- **Spring Boot**: Usa `host.docker.internal:3306` para MySQL local
- **FastAPI**: Usa `host.docker.internal:27017` para MongoDB local

Si quieres usar bases de datos **dentro de Kubernetes**, edita los deployments y cambia:
- En `springboot-deployment.yaml`: `jdbc:mysql://mysql-service:3306/mercApp`
- En `fastapi-deployment.yaml`: `mongodb-service` como `MONGODB_HOST`

**Nota**: `host.docker.internal` funciona en Docker Desktop. Para Minikube, necesitarás usar la IP de tu máquina host o configurar port-forwarding.

## ⚠️ Importante: Problema del Frontend

El frontend hace llamadas directas a `localhost:8000` y `localhost:8080`, que **no funcionarán** en Kubernetes porque los servicios están en pods diferentes.

**Soluciones disponibles:**

1. **NodePort (Recomendado para desarrollo)**: Exponer los backends con NodePort y actualizar las URLs en el código del frontend
2. **Nginx Reverse Proxy**: Configurar Nginx para hacer proxy de las llamadas
3. **Ingress**: Usar un Ingress controller para enrutar el tráfico

Ver `FRONTEND_NOTES.md` para más detalles y soluciones paso a paso.

## Troubleshooting

### Los pods no inician

```bash
# Ver el estado de los pods
kubectl describe pod <nombre-del-pod>

# Ver los logs
kubectl logs <nombre-del-pod>
```

### Problemas de conectividad entre servicios

Verifica que los servicios estén creados:

```bash
kubectl get services
```

Los servicios deben tener el tipo `ClusterIP` para comunicarse internamente.

### El frontend no puede acceder a los backends

El frontend hace llamadas a `localhost:8000` y `localhost:8080`. En Kubernetes, necesitarás:

1. **Opción 1**: Configurar un Ingress o reverse proxy
2. **Opción 2**: Exponer los servicios mediante NodePort y actualizar el código del frontend
3. **Opción 3**: Usar un ConfigMap para inyectar las URLs en el frontend

## Limpiar el despliegue

```bash
kubectl delete -f kubernetes/
```

O eliminar recursos individualmente:

```bash
kubectl delete deployment fastapi-backend springboot-backend frontend
kubectl delete service fastapi-service springboot-service frontend-service
```

