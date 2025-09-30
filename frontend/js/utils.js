// utils.js - utilidades compartidas - NAVEGACIÓN ENTRE PÁGINAS

function showAlert(message, type = 'success') {
    // Buscar alertas específicas por página primero
    const specificAlerts = {
        'documentFormAlert': document.getElementById('documentFormAlert'),
        'loginError': document.getElementById('loginError')
    };
    
    let alertDiv = null;
    
    // Buscar primero alerts específicos que existan
    for (const [key, element] of Object.entries(specificAlerts)) {
        if (element) {
            alertDiv = element;
            break;
        }
    }
    
    // Si no hay alerts específicos, crear uno temporal
    if (!alertDiv) {
        alertDiv = createTemporaryAlert();
    }
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('hidden');

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('hidden');
        
        // Si es temporal, eliminarlo
        if (alertDiv.id === 'tempAlert') {
            alertDiv.remove();
        }
    }, 5000);
}

function createTemporaryAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert hidden';
    alertDiv.id = 'tempAlert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 20px;
        border-radius: 8px;
        max-width: 400px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(alertDiv);
    return alertDiv;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Función para guardar información del receptor
function saveReceiverInfo() {
    showAlert('Información del receptor guardada exitosamente', 'success');
}

// Funciones de navegación (para compatibilidad con código existente)
function navigateToPage(page) {
    // Validar que la página existe antes de navegar
    const validPages = ['login.html', 'principal.html', 'seleccion.html', 'formulario.html'];
    
    if (validPages.includes(page)) {
        window.location.href = page;
    } else {
        console.warn('Página no válida:', page);
    }
}

function goToDashboard() {
    navigateToPage('principal.html');
}

function goToDocumentSelection() {
    navigateToPage('seleccion.html');
}

function goToDocumentForm() {
    navigateToPage('formulario.html');
}

function goToLogin() {
    navigateToPage('login.html');
}

// Función para obtener la página actual
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Función para validar si el usuario está en la página correcta
function validateCurrentPage(requiredAuth = true) {
    const currentPage = getCurrentPage();
    const isAuthenticated = localStorage.getItem('authToken') && localStorage.getItem('currentUser');
    
    // Páginas que requieren autenticación
    const protectedPages = ['principal.html', 'seleccion.html', 'formulario.html'];
    
    if (requiredAuth && protectedPages.includes(currentPage) && !isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo al login');
        navigateToPage('login.html');
        return false;
    }
    
    // Si está autenticado pero está en login, redirigir al dashboard
    if (isAuthenticated && (currentPage === 'login.html' || currentPage === '')) {
        console.log('Usuario autenticado en login, redirigiendo al dashboard');
        navigateToPage('principal.html');
        return false;
    }
    
    return true;
}

// Función para limpiar datos de sesión
function clearSessionData() {
    const sessionKeys = [
        'currentUser',
        'authToken',
        'selectedDocumentType',
        'documentTitle'
    ];
    
    sessionKeys.forEach(key => localStorage.removeItem(key));
}

// Función para mostrar loading en botones
function setButtonLoading(buttonElement, isLoading, originalText = 'Enviar') {
    if (!buttonElement) return;
    
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.dataset.originalText = buttonElement.textContent;
        buttonElement.textContent = 'Cargando...';
    } else {
        buttonElement.disabled = false;
        buttonElement.textContent = buttonElement.dataset.originalText || originalText;
    }
}

// Función para debug - mostrar información de la sesión actual
function debugSessionInfo() {
    const currentPage = getCurrentPage();
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    const docType = localStorage.getItem('selectedDocumentType');
    
    console.log('=== DEBUG SESSION INFO ===');
    console.log('Página actual:', currentPage);
    console.log('Usuario raw:', user);
    console.log('Usuario parsed:', user ? JSON.parse(user) : 'No autenticado');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'Ausente');
    console.log('Tipo documento:', docType);
    console.log('Variables globales:', {
        currentUser: window.currentUser,
        authToken: window.authToken ? `${window.authToken.substring(0, 20)}...` : 'Ausente'
    });
    console.log('Axios headers:', axios.defaults.headers.common);
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================');
    
    return {
        currentPage,
        hasUser: !!user,
        hasToken: !!token,
        docType,
        globalUser: !!window.currentUser,
        globalToken: !!window.authToken
    };
}

// Función temporal de debug para agregar al HTML
function addDebugButton() {
    if (document.getElementById('debugBtn')) return; // Ya existe
    
    const debugBtn = document.createElement('button');
    debugBtn.id = 'debugBtn';
    debugBtn.textContent = 'DEBUG';
    debugBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #ff4444;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    debugBtn.onclick = debugSessionInfo;
    document.body.appendChild(debugBtn);
}

// Función para manejar errores de red
function handleNetworkError(error) {
    console.error('Error de red:', error);
    
    let message = 'Error de conexión';
    
    if (error.response) {
        // El servidor respondió con un código de error
        message = error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        message = 'Sin respuesta del servidor. Verifique su conexión.';
    } else {
        // Error en la configuración de la petición
        message = error.message || 'Error desconocido';
    }
    
    showAlert(message, 'error');
    return message;
}

// Función para validar campos requeridos en formularios
function validateRequiredFields(formElement) {
    if (!formElement) return false;
    
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc2626';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showAlert('Por favor complete todos los campos requeridos', 'error');
    }
    
    return isValid;
}

// ============ VALIDACIONES ESPECÍFICAS POR TIPO DE CAMPO ============

function validateLettersOnly(value) {
    // Acepta letras, espacios, acentos y caracteres especiales del español
    return /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(value);
}

function validateNumbersOnly(value) {
    // Solo acepta números y guiones (para formato de teléfono y NIT)
    return /^[\d-]+$/.test(value);
}

function validateAlphanumeric(value) {
    // Acepta letras, números, espacios y algunos caracteres especiales
    return /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ0-9\s.,#-]+$/.test(value);
}

// Aplicar validaciones en tiempo real
function setupFieldValidations() {
    // Campos que solo aceptan letras
    const letterFields = [
        'clientName',
        'economicActivity', 
        'receiverName',
        'issuerName',
        'product[]'
    ];
    
    // Campos que solo aceptan números
    const numberFields = [
        'nit',
        'phone'
    ];
    
    document.addEventListener('input', function(e) {
        const fieldName = e.target.name;
        const value = e.target.value;
        
        // Validar campos de solo letras
        if (letterFields.includes(fieldName)) {
            if (value && !validateLettersOnly(value)) {
                e.target.style.borderColor = '#dc2626';
                e.target.title = 'Solo se permiten letras';
                // Eliminar caracteres no válidos
                e.target.value = value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]/g, '');
            } else {
                e.target.style.borderColor = '';
                e.target.title = '';
            }
        }
        
        // Validar campos de solo números
        if (numberFields.includes(fieldName)) {
            if (value && !validateNumbersOnly(value)) {
                e.target.style.borderColor = '#dc2626';
                e.target.title = 'Solo se permiten números';
                // Eliminar caracteres no válidos (excepto guiones)
                e.target.value = value.replace(/[^\d-]/g, '');
            } else {
                e.target.style.borderColor = '';
                e.target.title = '';
            }
        }
    });
}