// main.js - inicialización central - NAVEGACIÓN ENTRE PÁGINAS
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación...');
    
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Página actual:', currentPage);
    
    // Inicialización común para todas las páginas
    initializeCommonFeatures();
    
    // Inicialización específica por página
    switch(currentPage) {
        case 'login.html':
        case '':
            initializeLoginPage();
            break;
        case 'principal.html':
            initializeDashboardPage();
            break;
        case 'seleccion.html':
            initializeSelectionPage();
            break;
        case 'formulario.html':
            initializeFormPage();
            break;
        default:
            console.warn('Página no reconocida:', currentPage);
    }
});

function initializeCommonFeatures() {
    // Configurar validaciones de campos
    setupFieldValidations();
    
    // Manejo de menús de usuario
    document.addEventListener('click', function(event) {
        const menus = document.querySelectorAll('.user-menu, .user-info');
        let clickedInside = false;
        
        menus.forEach(menu => {
            if (menu && menu.contains(event.target)) {
                clickedInside = true;
            }
        });
        
        if (!clickedInside) {
            closeUserMenus();
        }
    });
}

function initializeLoginPage() {
    console.log('=== INICIALIZANDO LOGIN ===');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Formulario de login configurado');
    }
    
    // IMPORTANTE: Verificar si ya hay una sesión válida
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
        console.log('🔄 Sesión existente detectada, restaurando...');
        try {
            // Restaurar variables globales
            currentUser = JSON.parse(storedUser);
            authToken = storedToken;
            axios.defaults.headers.common['Authorization'] = authToken;
            
            console.log('✅ Sesión restaurada, redirigiendo a dashboard...');
            window.location.replace('principal.html');
            return;
        } catch (error) {
            console.error('❌ Error restaurando sesión:', error);
            localStorage.clear();
        }
    }
    
    console.log('=== LOGIN INICIALIZADO ===');
}

function initializeDashboardPage() {
    console.log('Inicializando dashboard...');
    
    // Verificar autenticación
    if (!checkAuthentication()) {
        return; // Si no está autenticado, se redirigirá automáticamente
    }
    
    // Actualizar nombres de usuario
    updateUserNames();
    
    // Agregar event listeners para los botones del dashboard
    const facturationBtn = document.querySelector('.action-card[onclick*="documentSelectionSection"]');
    if (facturationBtn) {
        facturationBtn.onclick = function() {
            navigateToPage('seleccion.html');
        };
    }
    
    const clientsBtn = document.querySelector('.action-card[onclick*="clientes"]');
    if (clientsBtn) {
        clientsBtn.onclick = function() {
            alert('Función de clientes en desarrollo');
        };
    }
    
    const inventoryBtn = document.querySelector('.action-card[onclick*="inventario"]');
    if (inventoryBtn) {
        inventoryBtn.onclick = function() {
            alert('Función de inventario en desarrollo');
        };
    }
}

function initializeSelectionPage() {
    console.log('Inicializando página de selección...');
    
    // Verificar autenticación
    if (!checkAuthentication()) {
        return;
    }
    
    // Actualizar nombres de usuario
    updateUserNames();
    
    // Configurar botón de regreso
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            navigateToPage('principal.html');
        };
    }
    
    // Configurar botones de tipo de documento
    const docButtons = document.querySelectorAll('.doc-type-btn');
    docButtons.forEach(btn => {
        btn.onclick = function() {
            const docType = this.textContent.trim().toLowerCase();
            let documentType = '';
            
            if (docType.includes('crédito fiscal')) {
                documentType = 'ccf';
            } else if (docType.includes('factura')) {
                documentType = 'factura';
            } else if (docType.includes('declaración')) {
                documentType = 'declaracion';
            }
            
            // Guardar el tipo de documento seleccionado
            localStorage.setItem('selectedDocumentType', documentType);
            localStorage.setItem('documentTitle', this.textContent.trim());
            
            navigateToPage('formulario.html');
        };
    });
}

function initializeFormPage() {
    console.log('Inicializando página de formulario...');
    
    // Verificar autenticación
    if (!checkAuthentication()) {
        return;
    }
    
    // Actualizar nombres de usuario
    updateUserNames();
    
    // Configurar el título del documento según la selección anterior
    const documentTitle = localStorage.getItem('documentTitle');
    const documentType = localStorage.getItem('selectedDocumentType');
    const titleElement = document.getElementById('documentTitle');
    
    if (titleElement && documentTitle) {
        titleElement.textContent = documentTitle;
    }
    
    if (documentType) {
        currentDocumentType = documentType;
    }
    
    // Configurar botón de regreso
    const backBtn = document.querySelector('.back-btn2');
    if (backBtn) {
        backBtn.onclick = function() {
            navigateToPage('seleccion.html');
        };
    }
    
    // Registrar el formulario DTE
    const dteForm = document.getElementById('dteForm');
    if (dteForm) {
        dteForm.addEventListener('submit', handleDTEFormSubmit);
    }
    
    // Configurar selects de ubicación
    setupLocationSelects();
    
    // Configurar auto-cálculo para productos
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[name="quantity[]"], input[name="price[]"], select[name="saleType[]"]')) {
            calculateTotals();
        }
    });
    
    // Configurar botón para agregar productos
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.onclick = addProductRow;
    }
    
    // Cálculo inicial de totales
    setTimeout(calculateTotals, 100);
}

// Funciones auxiliares de validación (mantener compatibilidad)
function validateNIT(nit) {
    return /^\d{4}-\d{6}-\d{3}-\d{1}$/.test(nit);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}