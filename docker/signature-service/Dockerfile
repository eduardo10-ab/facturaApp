# Dockerfile temporal para el servicio de firma
# Crear en: docker/signature-service/Dockerfile

FROM openjdk:17-jre-slim

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crear directorio de la aplicación
WORKDIR /app

# Crear directorios necesarios
RUN mkdir -p /app/certificates /app/logs

# Crear un servicio mock temporal hasta obtener el oficial del MH
COPY mock-signature-service.jar /app/app.jar

# Variables de entorno
ENV CERTIFICATE_HOME=/app/certificates
ENV CERTIFICATE_PROFILE=nonssl
ENV SERVER_PORT=8113

# Puerto expuesto
EXPOSE 8113

# Comando de inicio
CMD ["java", "-jar", "/app/app.jar"]