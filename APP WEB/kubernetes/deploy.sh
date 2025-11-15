#!/bin/bash

# Script per desplegar MercApp en Kubernetes local amb port-forward automàtic

set -e

echo "=========================================="
echo "Despliegue de MercApp en Kubernetes"
echo "=========================================="

# Colores per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funció per verificar si un comand existeix
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerequisits
echo -e "${YELLOW}Verificant prerequisits...${NC}"

if ! command_exists kubectl; then
    echo -e "${RED}Error: kubectl no està instal·lat${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}Error: Docker no està instal·lat${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisits verificats${NC}"

# Verificar conexió a Kubernetes
echo -e "${YELLOW}Verificant conexió a Kubernetes...${NC}"
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo -e "${RED}Error: No es pot connectar al cluster de Kubernetes${NC}"
    echo "Assegura't que Kubernetes estigui corrent (minikube start, docker desktop, etc.)"
    exit 1
fi

echo -e "${GREEN}✓ Connectat a Kubernetes${NC}"

# Construir imatges Docker
echo -e "${YELLOW}Construint imatges Docker...${NC}"

cd "$(dirname "$0")/.."

echo "Construint FastAPI..."
cd __FastAPI__
docker build -t back-end-fastapi:latest . || {
    echo -e "${RED}Error al construir imatge de FastAPI${NC}"
    exit 1
}

echo "Construint Spring Boot..."
cd ../__springboot__produccio__
docker build -t back-end-springboot:latest . || {
    echo -e "${RED}Error al construir imatge de Spring Boot${NC}"
    exit 1
}

echo "Construint Frontend..."
cd ../__frontend__produccio__
docker build -t frontend-nginx:latest . || {
    echo -e "${RED}Error al construir imatge de Frontend${NC}"
    exit 1
}

cd ..

echo -e "${GREEN}✓ Imatges construïdes${NC}"

# Si utilitzes Minikube, carregar imatges
if command_exists minikube && minikube status >/dev/null 2>&1; then
    echo -e "${YELLOW}Carregant imatges a Minikube...${NC}"
    minikube image load back-end-fastapi:latest
    minikube image load back-end-springboot:latest
    minikube image load frontend-nginx:latest
    echo -e "${GREEN}✓ Imatges carregades a Minikube${NC}"
fi

# Aplicar configuracions de Kubernetes
echo -e "${YELLOW}Aplicant configuracions de Kubernetes...${NC}"

cd kubernetes

# Desplegar aplicacions
echo "Desplegant Spring Boot..."
kubectl apply -f springboot-deployment.yaml

echo "Desplegant FastAPI..."
kubectl apply -f fastapi-deployment.yaml

echo "Desplegant Frontend..."
kubectl apply -f frontend-deployment.yaml

echo -e "${GREEN}✓ Serveis desplegats${NC}"

# Esperar que els pods estiguin ready
echo -e "${YELLOW}Esperant que els pods estiguin ready...${NC}"
kubectl wait --for=condition=ready pod -l app=springboot-backend --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=fastapi-backend --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s || true

echo -e "${GREEN}✓ Desplegament completat${NC}"

# Mostrar estat
echo ""
echo -e "${GREEN}=========================================="
echo "Estat del desplegament:"
echo "==========================================${NC}"
kubectl get pods
echo ""
kubectl get services

# -----------------------
# PORT-FORWARD PER A TOTS 3
# -----------------------
echo ""
echo -e "${YELLOW}Creant port-forward per Frontend, FastAPI i SpringBoot...${NC}"

for svc in frontend-service:5500:80 fastapi-service:8000:8000 springboot-service:8080:8080; do
    OLD_PID=$(pgrep -f "kubectl port-forward svc/$svc" || true)
    if [ -n "$OLD_PID" ]; then
        echo "Matant port-forward antic per $svc (PID $OLD_PID)..."
        kill $OLD_PID || true
    fi
    kubectl port-forward svc/${svc} >/dev/null 2>&1 &
    PF_PID=$!
    echo -e "${GREEN}✓ Port-forward actiu per $svc (PID $PF_PID)${NC}"
done

# Accés a les aplicacions
echo ""
echo -e "${GREEN}=========================================="
echo "Accés a les aplicacions:"
echo "==========================================${NC}"
echo "Frontend: http://localhost:5500"
echo "FastAPI: http://localhost:8000"
echo "SpringBoot: http://localhost:8080"

echo ""
echo -e "${YELLOW}Per veure els logs:${NC}"
echo "  kubectl logs -l app=springboot-backend"
echo "  kubectl logs -l app=fastapi-backend"
echo "  kubectl logs -l app=frontend"
