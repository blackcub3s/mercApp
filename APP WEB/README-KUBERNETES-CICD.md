# Guía: Kubernetes y CI/CD

## Respuesta a tus Preguntas

### ✅ ¿Puedo desplegar en Kubernetes con estos Dockerfiles?

**Sí, pero con ajustes:**

1. **Los Dockerfiles están bien estructurados** - No hay problema en tenerlos en subdirectorios
2. **Necesitas especificar el contexto correcto** al construir las imágenes
3. **Necesitas crear manifests de Kubernetes** (Deployments, Services) - Ya creados en `k8s/`
4. **Ajustar la comunicación entre servicios** - En K8s no puedes usar `host.docker.internal`

### ✅ ¿Puedo hacer integración continua?

**Sí, totalmente.** He creado un workflow de GitHub Actions en `.github/workflows/ci-cd.yml` que:
- Construye las 3 imágenes Docker
- Las sube a un registry (GitHub Container Registry por defecto)
- Las despliega en Kubernetes (cuando se hace push a `main`)

### ⚠️ ¿Problemas por no estar en la raíz?

**No es un problema**, pero hay que tener en cuenta:

#### Ventajas de tenerlos en subdirectorios:
- ✅ Organización clara del proyecto
- ✅ Cada servicio tiene su contexto aislado
- ✅ Fácil de mantener

#### Consideraciones:
1. **Contexto de build**: En CI/CD debes especificar el contexto correcto:
   ```yaml
   context: ./__FastAPI__
   file: ./__FastAPI__/Dockerfile
   ```

2. **Rutas en Dockerfiles**: Tus Dockerfiles usan `COPY app/...` que asume que el contexto es el subdirectorio. Esto está bien si construyes desde ahí, pero en CI/CD desde la raíz necesitas el contexto correcto.

## Cambios Realizados

### 1. Actualización de `serveiClient.py`
- Ahora detecta automáticamente el entorno (Kubernetes, Docker local, o desarrollo)
- En Kubernetes usa el nombre del servicio: `springboot-service:8080`
- En Docker local usa: `host.docker.internal:8080`
- Permite override con variable de entorno `SPRINGBOOT_HOST`

### 2. Manifests de Kubernetes
Creados en `k8s/`:
- `fastapi-deployment.yaml`
- `springboot-deployment.yaml`
- `frontend-deployment.yaml`

### 3. Workflow de CI/CD
Creado en `.github/workflows/ci-cd.yml`:
- Construye las 3 imágenes
- Usa cache para acelerar builds
- Despliega automáticamente en K8s (solo en `main`)

## Próximos Pasos

### 1. Configurar el Registry
Edita `.github/workflows/ci-cd.yml` y cambia:
```yaml
REGISTRY: ghcr.io  # O usa Docker Hub, ECR, etc.
```

### 2. Configurar Acceso a Kubernetes
En el workflow, en el step `Configure kubectl`, añade tu configuración:
- Para GKE: credenciales de Google Cloud
- Para EKS: credenciales de AWS
- Para AKS: credenciales de Azure
- Para otros: configura según tu proveedor

### 3. Configurar Secrets en GitHub
Si usas secrets para Kubernetes, añádelos en:
`Settings > Secrets and variables > Actions`

### 4. Ajustar los Manifests
- Actualiza las imágenes con tu registry
- Añade variables de entorno necesarias
- Configura recursos (CPU/memoria) según tus necesidades
- Añade ConfigMaps y Secrets si es necesario

### 5. MongoDB en Kubernetes
Si MongoDB está en K8s, crea un servicio para él. Si está fuera, actualiza `MONGODB_HOST` en el deployment de FastAPI.

## Comandos Útiles

### Construir imágenes localmente (desde la raíz)
```bash
docker build -f __FastAPI__/Dockerfile -t back-end-fastapi:latest __FastAPI__
docker build -f __springboot__produccio__/Dockerfile -t back-end-springboot:latest __springboot__produccio__
docker build -f __frontend__produccio__/Dockerfile -t front-end-nginx:latest __frontend__produccio__
```

### Desplegar en Kubernetes
```bash
kubectl apply -f k8s/
```

### Ver estado
```bash
kubectl get all
kubectl get pods -w  # watch mode
```

## Resumen

✅ **Sí puedes desplegar en Kubernetes** - Los Dockerfiles están bien  
✅ **Sí puedes hacer CI/CD** - Workflow creado  
✅ **No hay problema con subdirectorios** - Solo especifica el contexto correcto  
✅ **Código actualizado** - `serveiClient.py` ahora funciona en todos los entornos  

¡Todo listo para desplegar! 🚀

