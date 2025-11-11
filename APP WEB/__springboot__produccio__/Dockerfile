# Multi-stage build per Spring Boot
# Stage 1: Build stage - compila l'aplicació i genera el JAR
FROM maven:3.9-eclipse-temurin-22 AS build

# Especifiquem directori de treball
WORKDIR /app

# Copiem primer el pom.xml per aprofitar la cache de Docker
# (si el pom.xml no canvia, no cal tornar a descarregar dependències)
COPY app/pom.xml .

# Descarguem les dependències (això es fa en una capa separada per optimitzar la cache)
RUN mvn dependency:go-offline -B

# Copiem el codi font
COPY app/src ./src

# Compilem i generem el JAR
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage - imatge lleugera només amb el JAR
FROM eclipse-temurin:22-jre-alpine

# Creem un usuari no-root per seguretat
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Especifiquem directori de treball
WORKDIR /app

# Copiem el JAR generat des del stage de build
# El nom del JAR és app-0.0.1-SNAPSHOT.jar segons el pom.xml
COPY --from=build /app/target/app-0.0.1-SNAPSHOT.jar app.jar

# Exposem el port 8080 (port per defecte de Spring Boot)
EXPOSE 8080

# Comanda per defecte que s'executarà a l'arrancar
# -Djava.security.egd=file:/dev/./urandom optimitza l'inici de l'aplicació
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
