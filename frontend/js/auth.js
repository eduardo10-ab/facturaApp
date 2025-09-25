// auth.js - login, logout, navegación y gestión de sesión - NAVEGACIÓN ENTRE PÁGINAS
const API_BASE_URL = 'http://localhost:8080/api/v1';
let currentUser = null;
let authToken = null;
let currentDocumentType = null;

// Configurar axios por defecto
axios.defaults.baseURL = API_BASE_URL;

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');

    console.log('=== INICIO LOGIN ===');
    
    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';

    try {
        const params = new URLSearchParams();
        params.append('user', username);
        params.append('pwd', password);

        console.log('Enviando petición login...');
        const response = await axios.post('/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log('Respuesta recibida:', response.data);

        if (response.data.status === 'OK') {
            console.log('Login exitoso, procesando datos...');
            
            const userData = response.data.body;
            
            // Establecer variables globales PRIMERO
            currentUser = userData;
            authToken = userData.token;
            axios.defaults.headers.common['Authorization'] = authToken;

            // Usar un enfoque más confiable para localStorage
            const saveToStorage = () => {
                try {
                    // Limpiar datos anteriores
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('authToken');
                    
                    // Guardar nuevos datos
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    localStorage.setItem('authToken', authToken);
                    
                    // Verificar inmediatamente que se guardó
                    const savedUser = localStorage.getItem('currentUser');
                    const savedToken = localStorage.getItem('authToken');
                    
                    if (savedUser && savedToken) {
                        console.log('Datos guardados correctamente, navegando...');
                        window.location.replace('principal.html'); // usar replace en lugar de href
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error('Error guardando en localStorage:', e);
                    return false;
                }
            };
            
            // Intentar guardar, con reintentos si es necesario
            if (!saveToStorage()) {
                console.log('Primer intento falló, reintentando...');
                setTimeout(() => {
                    if (!saveToStorage()) {
                        console.error('Error crítico guardando datos');
                        showAlert('Error al guardar sesión, intente nuevamente', 'error');
                    }
                }, 50);
            }
            
        } else {
            throw new Error(response.data.message || 'Error de autenticación');
        }
    } catch (error) {
        console.error('Error de login:', error);
        errorDiv.textContent = error.message || 'Error de conexión';
        errorDiv.classList.remove('hidden');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar sesión';
        console.log('=== FIN LOGIN ===');
    }
}

function checkAuthentication() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();

    console.log('=== VERIFICANDO AUTENTICACIÓN ===');
    console.log('Página actual:', currentPage);
    console.log('Token presente:', !!storedToken);
    console.log('Usuario presente:', !!storedUser);

    // Si no hay datos de autenticación
    if (!storedToken || !storedUser) {
        console.log('❌ No autenticado');
        if (currentPage !== 'login.html' && currentPage !== '') {
            console.log('Redirigiendo a login...');
            window.location.replace('login.html');
        }
        return false;
    }

    // Si hay datos, configurar la sesión
    try {
        currentUser = JSON.parse(storedUser);
        authToken = storedToken;
        axios.defaults.headers.common['Authorization'] = authToken;
        
        console.log('✅ Autenticado como:', currentUser.user || currentUser.companyName);
        updateUserNames();
        
        // Si está autenticado pero en login, ir al dashboard
        if (currentPage === 'login.html' || currentPage === '') {
            console.log('Usuario autenticado en login, redirigiendo a dashboard...');
            window.location.replace('principal.html');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error procesando datos de sesión:', error);
        localStorage.clear();
        if (currentPage !== 'login.html') {
            window.location.replace('login.html');
        }
        return false;
    }
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        currentUser = null;
        authToken = null;
        currentDocumentType = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('documentType');
        localStorage.removeItem('documentTitle');

        delete axios.defaults.headers.common['Authorization'];
        
        // Redirigir a login
        window.location.href = 'login.html';
    }
    closeUserMenus();
}

// Funciones de navegación entre páginas
function navigateToPage(page) {
    window.location.href = page;
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

// Función mejorada para mostrar secciones (mantener compatibilidad)
function showSection(sectionName) {
    const pageMap = {
        'loginSection': 'login.html',
        'dashboardSection': 'principal.html',
        'documentSelectionSection': 'seleccion.html',
        'documentFormSection': 'formulario.html'
    };
    
    const targetPage = pageMap[sectionName];
    if (targetPage) {
        navigateToPage(targetPage);
    } else {
        console.warn('Sección no encontrada:', sectionName);
    }
}

function updateUserNames() {
    const userNameElements = document.querySelectorAll('#userName, #userName2, #userName3');
    userNameElements.forEach(el => {
        if (currentUser && el) {
            el.textContent = currentUser.companyName || currentUser.user;
        }
    });
}

function toggleUserMenu() {
    // Manejar múltiples dropdowns
    const dropdowns = document.querySelectorAll('#userDropdown, #userDropdown2, #userDropdown3');
    dropdowns.forEach(dropdown => {
        if (dropdown) dropdown.classList.toggle('active');
    });
}

function closeUserMenus() {
    const dropdowns = document.querySelectorAll('.user-dropdown, #userDropdown, #userDropdown2, #userDropdown3');
    dropdowns.forEach(d => d.classList.remove('active'));
}

function editProfile() {
    alert('Función de editar perfil en desarrollo');
    closeUserMenus();
}

// Función para guardar información del receptor
function saveReceiverInfo() {
    showAlert('Información del receptor guardada exitosamente', 'success');
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', function(event) {
    const menus = document.querySelectorAll('.user-menu, .user-info');
    let clickedInside = false;
    
    menus.forEach(menu => {
        if (menu.contains(event.target)) {
            clickedInside = true;
        }
    });
    
    if (!clickedInside) {
        closeUserMenus();
    }
});

// Inicialización específica por página
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('=== INICIALIZANDO PÁGINA ===');
    console.log('Página:', currentPage);
    
    switch(currentPage) {
        case 'login.html':
        case '':
            // En login, NO verificar autenticación automáticamente
            console.log('Página de login - sin verificación automática');
            break;
        case 'principal.html':
        case 'seleccion.html':
        case 'formulario.html':
            // En páginas protegidas, verificar autenticación
            console.log('Página protegida - verificando autenticación');
            setTimeout(() => checkAuthentication(), 100);
            break;
        default:
            console.log('Página desconocida');
    }
}

// Ejecutar inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', initializePage);