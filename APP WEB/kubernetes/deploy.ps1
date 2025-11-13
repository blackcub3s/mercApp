# Script PowerShell para desplegar MercApp en Kubernetes local (Windows)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Despliegue de MercApp en Kubernetes" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Verificar prerequisitos
Write-Host "`nVerificando prerequisitos..." -ForegroundColor Yellow

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "Error: kubectl no está instalado" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Prerequisitos verificados" -ForegroundColor Green

# Verificar conexión a Kubernetes
Write-Host "`nVerificando conexión a Kubernetes..." -ForegroundColor Yellow
try {
    kubectl cluster-info | Out-Null
    Write-Host "✓ Conectado a Kubernetes" -ForegroundColor Green
} catch {
    Write-Host "Error: No se puede conectar al cluster de Kubernetes" -ForegroundColor Red
    Write-Host "Asegúrate de que Kubernetes esté corriendo (Docker Desktop, minikube, etc.)" -ForegroundColor Yellow
    exit 1
}

# Construir imágenes Docker
Write-Host "`nConstruyendo imágenes Docker..." -ForegroundColor Yellow

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "Construyendo FastAPI..."
Set-Location "$projectRoot\__FastAPI__"
docker build -t back-end-fastapi:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir imagen de FastAPI" -ForegroundColor Red
    exit 1
}

Write-Host "Construyendo Spring Boot..."
Set-Location "$projectRoot\__springboot__produccio__"
docker build -t back-end-springboot:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir imagen de Spring Boot" -ForegroundColor Red
    exit 1
}

Write-Host "Construyendo Frontend..."
Set-Location "$projectRoot\__frontend__produccio__"
docker build -t frontend-nginx:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir imagen de Frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Imágenes construidas" -ForegroundColor Green

# Si usas Minikube, cargar imágenes
if (Get-Command minikube -ErrorAction SilentlyContinue) {
    $minikubeStatus = minikube status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nCargando imágenes en Minikube..." -ForegroundColor Yellow
        minikube image load back-end-fastapi:latest
        minikube image load back-end-springboot:latest
        minikube image load frontend-nginx:latest
        Write-Host "✓ Imágenes cargadas en Minikube" -ForegroundColor Green
    }
}

# Aplicar configuraciones de Kubernetes
Write-Host "`nAplicando configuraciones de Kubernetes..." -ForegroundColor Yellow

Set-Location "$scriptPath"

# Secretos
Write-Host "Aplicando secrets..."
kubectl apply -f springboot-secrets.yaml

# Bases de datos (opcional)
$deployDb = Read-Host "¿Deseas desplegar MySQL y MongoDB en Kubernetes? (s/n)"
if ($deployDb -eq "s" -or $deployDb -eq "S") {
    Write-Host "Desplegando MySQL..."
    kubectl apply -f mysql-deployment.yaml
    Write-Host "Desplegando MongoDB..."
    kubectl apply -f mongodb-deployment.yaml
    Write-Host "✓ Bases de datos desplegadas" -ForegroundColor Green
} else {
    Write-Host "Saltando despliegue de bases de datos (usarás bases de datos locales)" -ForegroundColor Yellow
    Write-Host "NOTA: Asegúrate de actualizar los deployments para usar host.docker.internal" -ForegroundColor Yellow
}

# Aplicaciones
Write-Host "Desplegando Spring Boot..."
kubectl apply -f springboot-deployment.yaml

Write-Host "Desplegando FastAPI..."
kubectl apply -f fastapi-deployment.yaml

Write-Host "Desplegando Frontend..."
kubectl apply -f frontend-deployment.yaml

Write-Host "✓ Servicios desplegados" -ForegroundColor Green

# Esperar a que los pods estén listos
Write-Host "`nEsperando a que los pods estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

kubectl wait --for=condition=ready pod -l app=springboot-backend --timeout=300s 2>$null
kubectl wait --for=condition=ready pod -l app=fastapi-backend --timeout=300s 2>$null
kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s 2>$null

Write-Host "✓ Despliegue completado" -ForegroundColor Green

# Mostrar estado
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "Estado del despliegue:" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
kubectl get pods
Write-Host ""
kubectl get services

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "Acceso a la aplicación:" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

if (Get-Command minikube -ErrorAction SilentlyContinue) {
    $minikubeIp = minikube ip 2>$null
    if ($minikubeIp) {
        Write-Host "Frontend: http://$minikubeIp:5500" -ForegroundColor Cyan
        Write-Host "O ejecuta: minikube service frontend-service" -ForegroundColor Cyan
    }
} else {
    Write-Host "Frontend: http://localhost:5500" -ForegroundColor Cyan
}

Write-Host "`nPara ver los logs:" -ForegroundColor Yellow
Write-Host "  kubectl logs -l app=springboot-backend" -ForegroundColor White
Write-Host "  kubectl logs -l app=fastapi-backend" -ForegroundColor White
Write-Host "  kubectl logs -l app=frontend" -ForegroundColor White

