// main.js - inicialización central - NAVEGACIÓN ENTRE PÁGINAS
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación...');
    
    const currentPage = window.location.pathname.split('/').pop();
    const currentFolder = window.location.pathname.split('/').slice(-2, -1)[0];
    
    console.log('Página actual:', currentPage);
    console.log('Carpeta actual:', currentFolder);
    
    // Inicialización común para todas las páginas
    initializeCommonFeatures();
    
    // Inicialización específica por página
    if (currentFolder === 'formularios') {
        // Páginas dentro de la carpeta formularios
        initializeFormPage(currentPage);
    } else {
        // Páginas en la raíz
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
            // Mantener compatibilidad con formulario.html si existe
            case 'formulario.html':
                initializeFormPage(currentPage);
                break;
            default:
                console.warn('Página no reconocida:', currentPage);
        }
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
    
    // Mapeo de tipos de documento a archivos HTML
    // ORDEN IMPORTANTE: Los más específicos primero para evitar coincidencias parciales
    const documentTypeMap = {
        'factura de exportación': {
            file: 'formularios/facturaExportacion.html',
            type: 'facturaExportacion',
            title: 'Factura de Exportación'
        },
        'factura de sujeto excluido': {
            file: 'formularios/facturaExcluido.html',
            type: 'facturaExcluido',
            title: 'Factura de Sujeto Excluido'
        },
        'nota de crédito': {
            file: 'formularios/notaCredito.html',
            type: 'notaCredito',
            title: 'Nota de Crédito'
        },
        'nota de débito': {
            file: 'formularios/notaDebito.html',
            type: 'notaDebito',
            title: 'Nota de Débito'
        },
        'nota de remisión': {
            file: 'formularios/notaRemision.html',
            type: 'notaRemision',
            title: 'Nota de Remisión'
        },
        'crédito fiscal': {
            file: 'formularios/creditoFiscal.html',
            type: 'ccf',
            title: 'Comprobante de Crédito Fiscal'
        },
        'comprobante de retención': {
            file: 'formularios/comprobanteRetencion.html',
            type: 'comprobanteRetencion',
            title: 'Comprobante de Retención'
        },
        'declaración de renta': {
            file: 'formularios/declaracionRenta.html',
            type: 'declaracionRenta',
            title: 'Declaración de Renta'
        },
        'factura': {
            file: 'formularios/factura.html',
            type: 'factura',
            title: 'Factura'
        }
    };
    
    // Configurar botones de tipo de documento
    const docButtons = document.querySelectorAll('.doc-type-btn');
    docButtons.forEach(btn => {
        btn.onclick = function() {
            const docText = this.textContent.trim().toLowerCase();
            console.log('Documento clickeado:', docText);
            
            // Buscar el tipo de documento en el mapeo (coincidencia exacta primero)
            let documentInfo = null;
            
            // Primero buscar coincidencia exacta
            for (const [key, value] of Object.entries(documentTypeMap)) {
                if (docText === key) {
                    documentInfo = value;
                    console.log('Coincidencia exacta encontrada:', key);
                    break;
                }
            }
            
            // Si no hay coincidencia exacta, buscar si contiene la clave
            if (!documentInfo) {
                for (const [key, value] of Object.entries(documentTypeMap)) {
                    if (docText.includes(key)) {
                        documentInfo = value;
                        console.log('Coincidencia parcial encontrada:', key);
                        break;
                    }
                }
            }
            
            if (documentInfo) {
                // Guardar el tipo de documento seleccionado
                localStorage.setItem('selectedDocumentType', documentInfo.type);
                localStorage.setItem('documentTitle', documentInfo.title);
                
                console.log('Navegando a:', documentInfo.file);
                
                // Navegar al formulario específico
                navigateToPage(documentInfo.file);
            } else {
                console.warn('Tipo de documento no encontrado:', docText);
                alert('Tipo de documento no configurado');
            }
        };
    });
}

function initializeFormPage(pageFilename) {
    console.log('Inicializando página de formulario:', pageFilename);
    
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
    const backBtn = document.querySelector('.back-btn2, .back-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            navigateToPage('../seleccion.html');
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