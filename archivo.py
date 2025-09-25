import os

# Ruta base del proyecto
base_path = r"C:\Users\eduaf\OneDrive\Escritorio\facturapp"

# Lista de carpetas a crear
folders = [
    "src/main/java/com/mh/dte/config",
    "src/main/java/com/mh/dte/controller",
    "src/main/java/com/mh/dte/service/auth",
    "src/main/java/com/mh/dte/service/signature",
    "src/main/java/com/mh/dte/service/transmission",
    "src/main/java/com/mh/dte/service/contingency",
    "src/main/java/com/mh/dte/service/query",
    "src/main/java/com/mh/dte/service/qr",
    "src/main/java/com/mh/dte/repository",
    "src/main/java/com/mh/dte/entity",
    "src/main/java/com/mh/dte/dto/auth",
    "src/main/java/com/mh/dte/dto/dte",
    "src/main/java/com/mh/dte/dto/signature",
    "src/main/java/com/mh/dte/exception",
    "src/main/java/com/mh/dte/util",
    "src/main/resources/db/migration",
    "src/main/resources/certificates",
    "src/test/java/com/mh/dte/service",
    "src/test/java/com/mh/dte/controller",
    "src/test/java/com/mh/dte/integration",
    "docker/signature-service/temp",
    "docker/postgresql",
    "docs/api",
    "docs/setup"
]

# Crear carpetas
for folder in folders:
    path = os.path.join(base_path, folder)
    os.makedirs(path, exist_ok=True)

# Lista de archivos vacíos a crear
files = [
    "src/main/java/com/mh/dte/DteSystemApplication.java",
    "src/main/java/com/mh/dte/config/SecurityConfig.java",
    "src/main/java/com/mh/dte/config/DatabaseConfig.java",
    "src/main/java/com/mh/dte/config/RestClientConfig.java",
    "src/main/java/com/mh/dte/config/AsyncConfig.java",
    "src/main/java/com/mh/dte/controller/AuthController.java",
    "src/main/java/com/mh/dte/controller/DteController.java",
    "src/main/java/com/mh/dte/controller/BatchController.java",
    "src/main/java/com/mh/dte/controller/QueryController.java",
    "src/main/java/com/mh/dte/service/auth/AuthService.java",
    "src/main/java/com/mh/dte/service/auth/TokenService.java",
    "src/main/java/com/mh/dte/service/signature/SignatureService.java",
    "src/main/java/com/mh/dte/service/signature/SignatureClient.java",
    "src/main/java/com/mh/dte/service/transmission/TransmissionService.java",
    "src/main/java/com/mh/dte/service/transmission/BatchService.java",
    "src/main/java/com/mh/dte/service/transmission/RetryPolicyService.java",
    "src/main/java/com/mh/dte/service/contingency/ContingencyService.java",
    "src/main/java/com/mh/dte/service/contingency/ContingencyEventService.java",
    "src/main/java/com/mh/dte/service/query/QueryService.java",
    "src/main/java/com/mh/dte/service/query/BatchQueryService.java",
    "src/main/java/com/mh/dte/service/qr/QrCodeService.java",
    "src/main/java/com/mh/dte/repository/UserRepository.java",
    "src/main/java/com/mh/dte/repository/DteDocumentRepository.java",
    "src/main/java/com/mh/dte/repository/BatchRepository.java",
    "src/main/java/com/mh/dte/repository/ContingencyRepository.java",
    "src/main/java/com/mh/dte/repository/AuditLogRepository.java",
    "src/main/java/com/mh/dte/entity/User.java",
    "src/main/java/com/mh/dte/entity/DteDocument.java",
    "src/main/java/com/mh/dte/entity/Batch.java",
    "src/main/java/com/mh/dte/entity/BatchDocument.java",
    "src/main/java/com/mh/dte/entity/Contingency.java",
    "src/main/java/com/mh/dte/entity/Token.java",
    "src/main/java/com/mh/dte/entity/AuditLog.java",
    "src/main/java/com/mh/dte/dto/auth/AuthRequest.java",
    "src/main/java/com/mh/dte/dto/auth/AuthResponse.java",
    "src/main/java/com/mh/dte/dto/dte/DteRequest.java",
    "src/main/java/com/mh/dte/dto/dte/DteResponse.java",
    "src/main/java/com/mh/dte/dto/dte/BatchRequest.java",
    "src/main/java/com/mh/dte/dto/signature/SignatureRequest.java",
    "src/main/java/com/mh/dte/dto/signature/SignatureResponse.java",
    "src/main/java/com/mh/dte/exception/GlobalExceptionHandler.java",
    "src/main/java/com/mh/dte/exception/AuthenticationException.java",
    "src/main/java/com/mh/dte/exception/SignatureException.java",
    "src/main/java/com/mh/dte/exception/TransmissionException.java",
    "src/main/resources/application.yml",
    "src/main/resources/application-dev.yml",
    "src/main/resources/application-prod.yml",
    "src/main/resources/db/migration/V1__create_initial_schema.sql",
    "src/main/resources/db/migration/V2__create_audit_tables.sql",
    "src/main/resources/db/migration/V3__add_indexes.sql",
    "src/main/resources/certificates/.gitkeep",
    "docker/docker-compose.yml",
    "docker/signature-service/Dockerfile",
    "docker/signature-service/temp/.gitkeep",
    "docker/postgresql/init.sql",
    "pom.xml",
    ".gitignore",
    "README.md",
    "docker-compose.dev.yml"
]

# Crear archivos vacíos
for file in files:
    path = os.path.join(base_path, file)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        pass  # crear archivo vacío

print(f"Estructura de proyecto generada en: {base_path}")
