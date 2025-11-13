#!/bin/bash

# Script para desplegar MercApp en Kubernetes local

set -e

echo "=========================================="
echo "Despliegue de MercApp en Kubernetes"
echo "=========================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerequisitos
echo -e "${YELLOW}Verificando prerequisitos...${NC}"

if ! command_exists kubectl; then
    echo -e "${RED}Error: kubectl no está instalado${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisitos verificados${NC}"

# Verificar conexión a Kubernetes
echo -e "${YELLOW}Verificando conexión a Kubernetes...${NC}"
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo -e "${RED}Error: No se puede conectar al cluster de Kubernetes${NC}"
    echo "Asegúrate de que Kubernetes esté corriendo (minikube start, docker desktop, etc.)"
    exit 1
fi

echo -e "${GREEN}✓ Conectado a Kubernetes${NC}"

# Construir imágenes Docker
echo -e "${YELLOW}Construyendo imágenes Docker...${NC}"

cd "$(dirname "$0")/.."

echo "Construyendo FastAPI..."
cd __FastAPI__
docker build -t back-end-fastapi:latest . || {
    echo -e "${RED}Error al construir imagen de FastAPI${NC}"
    exit 1
}

echo "Construyendo Spring Boot..."
cd ../__springboot__produccio__
docker build -t back-end-springboot:latest . || {
    echo -e "${RED}Error al construir imagen de Spring Boot${NC}"
    exit 1
}

echo "Construyendo Frontend..."
cd ../__frontend__produccio__
docker build -t frontend-nginx:latest . || {
    echo -e "${RED}Error al construir imagen de Frontend${NC}"
    exit 1
}

cd ..

echo -e "${GREEN}✓ Imágenes construidas${NC}"

# Si usas Minikube, cargar imágenes
if command_exists minikube && minikube status >/dev/null 2>&1; then
    echo -e "${YELLOW}Cargando imágenes en Minikube...${NC}"
    minikube image load back-end-fastapi:latest
    minikube image load back-end-springboot:latest
    minikube image load frontend-nginx:latest
    echo -e "${GREEN}✓ Imágenes cargadas en Minikube${NC}"
fi

# Aplicar configuraciones de Kubernetes
echo -e "${YELLOW}Aplicando configuraciones de Kubernetes...${NC}"

cd kubernetes

# Secretos
echo "Aplicando secrets..."
kubectl apply -f springboot-secrets.yaml

# Bases de datos (opcional - comentar si usas bases de datos locales)
read -p "¿Deseas desplegar MySQL y MongoDB en Kubernetes? (s/n): " deploy_db
if [[ $deploy_db == "s" || $deploy_db == "S" ]]; then
    echo "Desplegando MySQL..."
    kubectl apply -f mysql-deployment.yaml
    echo "Desplegando MongoDB..."
    kubectl apply -f mongodb-deployment.yaml
    echo -e "${GREEN}✓ Bases de datos desplegadas${NC}"
else
    echo -e "${YELLOW}Saltando despliegue de bases de datos (usarás bases de datos locales)${NC}"
    echo -e "${YELLOW}NOTA: Asegúrate de actualizar los deployments para usar host.docker.internal${NC}"
fi

# Aplicaciones
echo "Desplegando Spring Boot..."
kubectl apply -f springboot-deployment.yaml

echo "Desplegando FastAPI..."
kubectl apply -f fastapi-deployment.yaml

echo "Desplegando Frontend..."
kubectl apply -f frontend-deployment.yaml

echo -e "${GREEN}✓ Servicios desplegados${NC}"

# Esperar a que los pods estén listos
echo -e "${YELLOW}Esperando a que los pods estén listos...${NC}"
kubectl wait --for=condition=ready pod -l app=springboot-backend --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=fastapi-backend --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s || true

echo -e "${GREEN}✓ Despliegue completado${NC}"

# Mostrar estado
echo ""
echo -e "${GREEN}=========================================="
echo "Estado del despliegue:"
echo "==========================================${NC}"
kubectl get pods
echo ""
kubectl get services

echo ""
echo -e "${GREEN}=========================================="
echo "Acceso a la aplicación:"
echo "==========================================${NC}"

if command_exists minikube && minikube status >/dev/null 2>&1; then
    echo "Frontend: http://$(minikube ip):30080"
    echo "O ejecuta: minikube service frontend-service"
else
    echo "Frontend: http://localhost:30080"
fi

echo ""
echo -e "${YELLOW}Para ver los logs:${NC}"
echo "  kubectl logs -l app=springboot-backend"
echo "  kubectl logs -l app=fastapi-backend"
echo "  kubectl logs -l app=frontend"

