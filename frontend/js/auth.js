// auth.js - login, logout, navegación y gestión de sesión CORREGIDO
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

    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';

    try {
        const params = new URLSearchParams();
        params.append('user', username);
        params.append('pwd', password);

        const response = await axios.post('/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data.status === 'OK') {
            const userData = response.data.body;
            currentUser = userData;
            authToken = userData.token;

            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', authToken);

            axios.defaults.headers.common['Authorization'] = authToken;

            // CORREGIDO: No navegar a otra página, mostrar sección dentro de la SPA
            showSection('dashboardSection');
            document.getElementById('loginForm').reset();
        } else {
            throw new Error(response.data.message || 'Error de autenticación');
        }
    } catch (error) {
        console.error('Error de login:', error);
        let errorMessage = 'Error de conexión al servidor';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Usuario o contraseña incorrectos';
            } else if (error.response.data?.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar sesión';
    }
}

function checkAuthentication() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (!storedToken || !storedUser) {
        // CORREGIDO: No redirigir a login.html, mostrar sección de login
        showSection('loginSection');
        return false;
    }

    authToken = storedToken;
    currentUser = JSON.parse(storedUser);
    axios.defaults.headers.common['Authorization'] = authToken;
    updateUserNames();
    return true;
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        currentUser = null;
        authToken = null;
        currentDocumentType = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('documentType');
        localStorage.removeUser('documentTitle');

        delete axios.defaults.headers.common['Authorization'];
        
        // CORREGIDO: No redirigir, mostrar sección de login
        showSection('loginSection');
    }
    closeUserMenus();
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));

    // Mostrar la sección solicitada
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        updateUserNames();
    }
}

function updateUserNames() {
    const userNameElements = document.querySelectorAll('#userName, #userName2, #userName3');
    userNameElements.forEach(el => {
        if (currentUser) {
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

// ELIMINAR: Las siguientes funciones no son necesarias en una SPA
// function navigateToPage(page) { ... }