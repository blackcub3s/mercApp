# Despliegue en Kubernetes

Este directorio contiene los manifests de Kubernetes para desplegar la aplicación.

## Estructura

- `fastapi-deployment.yaml`: Deployment y Service para FastAPI
- `springboot-deployment.yaml`: Deployment y Service para Spring Boot
- `frontend-deployment.yaml`: Deployment y Service para el frontend Nginx

## Requisitos Previos

1. Cluster de Kubernetes configurado
2. `kubectl` instalado y configurado
3. Imágenes Docker construidas y subidas a un registry accesible
4. MongoDB desplegado (puede ser en K8s o externo)

## Pasos para Desplegar

### 1. Construir y subir las imágenes

```bash
# Desde la raíz del repositorio
docker build -f __FastAPI__/Dockerfile -t tu-registry/back-end-fastapi:latest __FastAPI__
docker build -f __springboot__produccio__/Dockerfile -t tu-registry/back-end-springboot:latest __springboot__produccio__
docker build -f __frontend__produccio__/Dockerfile -t tu-registry/front-end-nginx:latest __frontend__produccio__

# Subir a registry
docker push tu-registry/back-end-fastapi:latest
docker push tu-registry/back-end-springboot:latest
docker push tu-registry/front-end-nginx:latest
```

### 2. Actualizar las imágenes en los manifests

Edita los archivos `.yaml` y reemplaza `back-end-fastapi:latest` por `tu-registry/back-end-fastapi:latest` (y lo mismo para los otros servicios).

O usa variables de entorno:

```bash
export REGISTRY="tu-registry"
sed -i "s|back-end-fastapi:latest|${REGISTRY}/back-end-fastapi:latest|g" k8s/*.yaml
sed -i "s|back-end-springboot:latest|${REGISTRY}/back-end-springboot:latest|g" k8s/*.yaml
sed -i "s|front-end-nginx:latest|${REGISTRY}/front-end-nginx:latest|g" k8s/*.yaml
```

### 3. Desplegar

```bash
kubectl apply -f k8s/
```

### 4. Verificar el despliegue

```bash
kubectl get deployments
kubectl get services
kubectl get pods
```

## Configuración de MongoDB

Si MongoDB está en Kubernetes, necesitarás crear un servicio para él:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
```

Si MongoDB está fuera de Kubernetes, actualiza `MONGODB_HOST` en `fastapi-deployment.yaml` con la IP o hostname correcto.

## Notas Importantes

1. **Comunicación entre servicios**: Los servicios se comunican usando los nombres de servicio de Kubernetes (ej: `springboot-service:8080`)
2. **Variables de entorno**: Asegúrate de configurar todas las variables de entorno necesarias en los deployments
3. **Secrets**: Para datos sensibles (passwords, tokens), usa Secrets de Kubernetes
4. **Ingress**: Para exponer el frontend, considera usar un Ingress Controller (nginx, traefik, etc.)

## Troubleshooting

```bash
# Ver logs de un pod
kubectl logs <pod-name>

# Describir un pod para ver eventos
kubectl describe pod <pod-name>

# Ejecutar un comando en un pod
kubectl exec -it <pod-name> -- /bin/sh
```

