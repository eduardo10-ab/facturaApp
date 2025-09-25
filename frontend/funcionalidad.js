// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api/v1';
let currentUser = null;
let authToken = null;
let currentDocumentType = null;


// Configurar axios por defecto
axios.defaults.baseURL = API_BASE_URL;

// ===== FUNCIONES DE NAVEGACIÓN ENTRE SECCIONES =====

function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Mostrar la sección solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Actualizar nombres de usuario en todas las secciones
        updateUserNames();
    }
}

function updateUserNames() {
    const userNameElements = document.querySelectorAll('#userName, #userName2, #userName3');
    userNameElements.forEach(element => {
        if (currentUser) {
            element.textContent = currentUser.companyName || currentUser.user;
        }
    });
}

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Función de login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    
    // Reset error state
    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';
    
    try {
        // CORRECCIÓN: Usar URLSearchParams en lugar de FormData para application/x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('user', username);
        params.append('pwd', password);
        
        const response = await axios.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (response.data.status === 'OK') {
            const userData = response.data.body;
            currentUser = userData;
            authToken = userData.token;
            
            // Configurar header de autorización
            axios.defaults.headers.common['Authorization'] = authToken;
            
            // Mostrar dashboard o redirigir según tu aplicación
            showSection('dashboardSection');
            
            // Limpiar formulario de login
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
            } else if (error.response.data && error.response.data.message) {
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


async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    
    // Reset error state
    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';
    
    try {
        // Crear FormData como espera la API
        const formData = new FormData();
        formData.append('user', username);
        formData.append('pwd', password);
        
        const response = await axios.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.data.status === 'OK') {
            const userData = response.data.body;
            currentUser = userData;
            authToken = userData.token;
            
            // Configurar header de autorización
            axios.defaults.headers.common['Authorization'] = authToken;
            
            // Mostrar dashboard
            showSection('dashboardSection');
            
            // Limpiar formulario de login
            document.getElementById('loginForm').reset();
        } else {
            throw new Error(response.data.message || 'Error de autenticación');
        }
        
    } catch (error) {
        console.error('Error de login:', error);
        
        let errorMessage = 'Error de conexión al servidor';
        
        if (error.response && error.response.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
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

// ===== FUNCIONES DEL MENÚ DE USUARIO =====

function toggleUserMenu() {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.toggle('active');
    });
}

function editProfile() {
    alert('Función de editar perfil en desarrollo');
    closeUserMenus();
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar datos de sesión
        currentUser = null;
        authToken = null;
        currentDocumentType = null;
        
        // Limpiar header de autorización
        delete axios.defaults.headers.common['Authorization'];
        
        // Limpiar formularios
        document.getElementById('loginForm').reset();
        if (document.getElementById('dteForm')) {
            document.getElementById('dteForm').reset();
        }
        
        // Mostrar login
        showSection('loginSection');
    }
    closeUserMenus();
}

function closeUserMenus() {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const userMenus = document.querySelectorAll('.user-menu');
    let clickedInsideMenu = false;
    
    userMenus.forEach(menu => {
        if (menu.contains(event.target)) {
            clickedInsideMenu = true;
        }
    });
    
    if (!clickedInsideMenu) {
        closeUserMenus();
    }
});

// ===== FUNCIONES DE DOCUMENTOS =====

function createDocument(type) {
    const titles = {
        'ccf': 'Comprobante de crédito fiscal',
        'factura': 'Factura',
        'declaracion': 'Declaración de renta'
    };
    
    currentDocumentType = type;
    document.getElementById('documentTitle').textContent = titles[type] || 'Documento';
    showSection('documentFormSection');
}

// ===== FUNCIONES DE PRODUCTOS =====

function addProductRow() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" name="quantity[]" value="1" min="1" step="1" onchange="calculateTotals()"></td>
        <td><input type="text" name="unit[]" placeholder="Unidad"></td>
        <td><input type="text" name="product[]" placeholder="Descripción del producto" required></td>
        <td>
            <select name="saleType[]" onchange="calculateTotals()" required>
                <option value="">Seleccionar</option>
                <option value="1">Gravado</option>
                <option value="2">Exento</option>
            </select>
        </td>
        <td><input type="number" name="price[]" step="0.01" min="0" placeholder="0.00" onchange="calculateTotals()" required></td>
        <td>
            <button type="button" onclick="removeProductRow(this)" style="background: #dc2626; color: white; border: none; border-radius: 4px; padding: 5px 8px; cursor: pointer; font-size: 12px;">×</button>
        </td>
    `;
    tbody.appendChild(newRow);
}

function removeProductRow(button) {
    const tbody = document.getElementById('productsTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    // No permitir eliminar si solo hay una fila
    if (rows.length > 1) {
        button.closest('tr').remove();
        calculateTotals();
    } else {
        alert('Debe mantener al menos un producto');
    }
}

// ===== FUNCIONES DE CÁLCULO =====

function calculateTotals() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    let subtotalGravado = 0;
    let subtotalExento = 0;
    
    rows.forEach(row => {
        const quantityInput = row.querySelector('input[name="quantity[]"]');
        const priceInput = row.querySelector('input[name="price[]"]');
        const saleTypeSelect = row.querySelector('select[name="saleType[]"]');
        
        if (quantityInput && priceInput && saleTypeSelect) {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const saleType = saleTypeSelect.value;
            const subtotal = quantity * price;
            
            if (saleType === '1') { // Gravado
                subtotalGravado += subtotal;
            } else if (saleType === '2') { // Exento
                subtotalExento += subtotal;
            }
        }
    });
    
    // Calcular IVA (13% en El Salvador)
    const ivaRate = 0.13;
    const ivaAmount = subtotalGravado * ivaRate;
    const totalAmount = subtotalGravado + ivaAmount + subtotalExento;
    
    // Actualizar la UI
    updateTotalsDisplay(subtotalGravado + subtotalExento, subtotalExento, ivaAmount, totalAmount);
}

function updateTotalsDisplay(subtotal, exempt, iva, total) {
    const subtotalElement = document.getElementById('subtotalAmount');
    const exemptElement = document.getElementById('exemptAmount');
    const ivaElement = document.getElementById('ivaAmount');
    const totalElement = document.getElementById('totalAmount');
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)}`;
    if (exemptElement) exemptElement.textContent = `${exempt.toFixed(2)}`;
    if (ivaElement) ivaElement.textContent = `${iva.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)}`;
}

// ===== FUNCIONES DE UBICACIÓN =====

// Inicializar datos de departamentos y municipios de El Salvador
departamentosYMunicipios = {
    "01": {
        nombre: "Ahuachapán",
        municipios: {
            "01": "Ahuachapán",
            "02": "Apaneca",
            "03": "Atiquizaya",
            "04": "Concepción de Ataco",
            "05": "El Refugio",
            "06": "Guaymango",
            "07": "Jujutla",
            "08": "San Francisco Menéndez",
            "09": "San Lorenzo",
            "10": "San Pedro Puxtla",
            "11": "Tacuba",
            "12": "Turín"
        }
    },
    "10": {
        nombre: "San Salvador",
        municipios: {
            "01": "Aguilares",
            "02": "Apopa",
            "03": "Ayutuxtepeque",
            "04": "Cuscatancingo",
            "05": "El Paisnal",
            "06": "Guazapa",
            "07": "Ilopango",
            "08": "Mejicanos",
            "09": "Nejapa",
            "10": "Panchimalco",
            "11": "Rosario de Mora",
            "12": "San Marcos",
            "13": "San Martín",
            "14": "San Salvador",
            "15": "Santiago Texacuangos",
            "16": "Santo Tomás",
            "17": "Soyapango",
            "18": "Tonacatepeque"
        }
    }
};

function setupLocationSelects() {
    const departmentSelect = document.querySelector('select[name="department"]');
    const municipalitySelect = document.querySelector('select[name="municipality"]');
    
    if (departmentSelect && municipalitySelect) {
        departmentSelect.addEventListener('change', function() {
            updateMunicipalities(this.value, municipalitySelect);
        });
    }
}

function updateMunicipalities(departmentCode, municipalitySelect) {
    // Limpiar municipios
    municipalitySelect.innerHTML = '<option value="">Elija una opción</option>';
    
    if (departmentCode && departamentosYMunicipios[departmentCode]) {
        const municipios = departamentosYMunicipios[departmentCode].municipios;
        
        for (const [code, name] of Object.entries(municipios)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            municipalitySelect.appendChild(option);
        }
    }
}

// ===== FUNCIONES DEL FORMULARIO DTE =====

function saveReceiverInfo() {
    showAlert('Información del receptor guardada exitosamente', 'success');
}

async function handleDTEFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitDocumentBtn');
    const alertDiv = document.getElementById('documentFormAlert');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generando documento...';
    
    try {
        const formData = collectFormData();
        console.log('Datos del formulario:', formData);
        
        // Aquí llamarías a tu API para crear el documento
        // const response = await axios.post('/dte/create', formData);
        
        // Simular éxito por ahora
        alertDiv.textContent = 'Documento generado exitosamente';
        alertDiv.className = 'alert alert-success';
        alertDiv.classList.remove('hidden');
        
        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
            document.getElementById('dteForm').reset();
            calculateTotals();
            alertDiv.classList.add('hidden');
        }, 3000);
        
    } catch (error) {
        console.error('Error al generar documento:', error);
        alertDiv.textContent = 'Error al generar el documento: ' + error.message;
        alertDiv.className = 'alert alert-error';
        alertDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generar documento';
    }
}

function collectFormData() {
    const form = document.getElementById('dteForm');
    const formData = new FormData(form);
    
    // Recopilar productos
    const products = [];
    const quantities = formData.getAll('quantity[]');
    const units = formData.getAll('unit[]');
    const productNames = formData.getAll('product[]');
    const saleTypes = formData.getAll('saleType[]');
    const prices = formData.getAll('price[]');
    
    for (let i = 0; i < quantities.length; i++) {
        if (productNames[i] && prices[i]) {
            products.push({
                quantity: parseFloat(quantities[i]) || 1,
                unit: units[i] || '',
                description: productNames[i],
                saleType: saleTypes[i],
                unitPrice: parseFloat(prices[i]) || 0
            });
        }
    }
    
    return {
        documentType: currentDocumentType,
        receiver: {
            nit: formData.get('nit'),
            nrc: formData.get('nrc'),
            name: formData.get('clientName'),
            commercialName: formData.get('commercialName'),
            economicActivity: formData.get('economicActivity'),
            department: formData.get('department'),
            municipality: formData.get('municipality'),
            address: formData.get('address'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        products: products,
        paymentMethod: formData.get('paymentMethod'),
        issuer: {
            docNumber: formData.get('issuerDocNum'),
            name: formData.get('issuerName')
        },
        receiverResponsible: {
            docNumber: formData.get('receiverDocNum'),
            name: formData.get('receiverName')
        }
    };
}

// ===== VALIDACIONES =====

function validateNIT(nit) {
    // Validación básica de NIT salvadoreño
    const nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}$/;
    return nitRegex.test(nit);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== UTILIDADES =====

function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('documentFormAlert') || 
                    document.getElementById('loginError') ||
                    createAlertElement();
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('hidden');
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

function createAlertElement() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.id = 'tempAlert';
    document.body.insertBefore(alertDiv, document.body.firstChild);
    return alertDiv;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===== INICIALIZACIÓN =====

// Auto-calcular totales cuando se modifican inputs
document.addEventListener('input', function(e) {
    if (e.target.matches('input[name="quantity[]"], input[name="price[]"]') ||
        e.target.matches('select[name="saleType[]"]')) {
        calculateTotals();
    }
});

// Validación en tiempo real de campos
document.addEventListener('input', function(e) {
    if (e.target.name === 'nit') {
        const isValid = validateNIT(e.target.value);
        e.target.style.borderColor = isValid || e.target.value === '' ? '' : '#dc2626';
    }
    
    if (e.target.name === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid || e.target.value === '' ? '' : '#dc2626';
    }
});

// Mostrar la sección de login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    showSection('loginSection');
});// Configuración de la API


// Configurar axios por defecto
axios.defaults.baseURL = API_BASE_URL;

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Función de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    
    // Reset error state
    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';
    
    try {
        // Crear FormData como espera la API
        const formData = new FormData();
        formData.append('user', username);
        formData.append('pwd', password);
        
        const response = await axios.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.data.status === 'OK') {
            const userData = response.data.body;
            currentUser = userData;
            authToken = userData.token;
            
            // Guardar datos del usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', authToken);
            
            // Configurar header de autorización
            axios.defaults.headers.common['Authorization'] = authToken;
            
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(response.data.message || 'Error de autenticación');
        }
        
    } catch (error) {
        console.error('Error de login:', error);
        
        let errorMessage = 'Error de conexión al servidor';
        
        if (error.response && error.response.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
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

// Verificar autenticación
function checkAuthentication() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (!storedToken || !storedUser) {
        // Redirigir al login si no hay token
        window.location.href = 'login.html';
        return false;
    }
    
    // Restaurar datos de sesión
    authToken = storedToken;
    currentUser = JSON.parse(storedUser);
    axios.defaults.headers.common['Authorization'] = authToken;
    
    // Actualizar UI con datos del usuario
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = currentUser.companyName || currentUser.user;
    });
    
    return true;
}

// ===== FUNCIONES DE NAVEGACIÓN =====

function navigateToPage(page) {
    window.location.href = page;
}

// ===== FUNCIONES DEL MENÚ DE USUARIO =====

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function editProfile() {
    alert('Función de editar perfil en desarrollo');
    toggleUserMenu();
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar datos de sesión
        currentUser = null;
        authToken = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('documentType');
        localStorage.removeItem('documentTitle');
        
        // Limpiar header de autorización
        delete axios.defaults.headers.common['Authorization'];
        
        // Redirigir al login
        window.location.href = 'login.html';
    }
    toggleUserMenu();
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// ===== FUNCIONES DE PRODUCTOS =====

function addProductRow() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" name="quantity[]" value="1" min="1" step="1" onchange="calculateTotals()"></td>
        <td><input type="text" name="unit[]" placeholder="Unidad"></td>
        <td><input type="text" name="product[]" placeholder="Descripción del producto" required></td>
        <td>
            <select name="saleType[]" onchange="calculateTotals()" required>
                <option value="">Seleccionar</option>
                <option value="1">Gravado</option>
                <option value="2">Exento</option>
            </select>
        </td>
        <td><input type="number" name="price[]" step="0.01" min="0" placeholder="0.00" onchange="calculateTotals()" required></td>
        <td>
            <button type="button" onclick="removeProductRow(this)" style="background: #dc2626; color: white; border: none; border-radius: 4px; padding: 5px 8px; cursor: pointer;">×</button>
        </td>
    `;
    tbody.appendChild(newRow);
}

function removeProductRow(button) {
    const tbody = document.getElementById('productsTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    // No permitir eliminar si solo hay una fila
    if (rows.length > 1) {
        button.closest('tr').remove();
        calculateTotals();
    } else {
        alert('Debe mantener al menos un producto');
    }
}

// ===== FUNCIONES DE CÁLCULO =====

function calculateTotals() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    let subtotalGravado = 0;
    let subtotalExento = 0;
    
    rows.forEach(row => {
        const quantityInput = row.querySelector('input[name="quantity[]"]');
        const priceInput = row.querySelector('input[name="price[]"]');
        const saleTypeSelect = row.querySelector('select[name="saleType[]"]');
        
        if (quantityInput && priceInput && saleTypeSelect) {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const saleType = saleTypeSelect.value;
            const subtotal = quantity * price;
            
            if (saleType === '1') { // Gravado
                subtotalGravado += subtotal;
            } else if (saleType === '2') { // Exento
                subtotalExento += subtotal;
            }
        }
    });
    
    // Calcular IVA (13% en El Salvador)
    const ivaRate = 0.13;
    const ivaAmount = subtotalGravado * ivaRate;
    const totalAmount = subtotalGravado + ivaAmount + subtotalExento;
    
    // Actualizar la UI
    updateTotalsDisplay(subtotalGravado + subtotalExento, subtotalExento, ivaAmount, totalAmount);
}

function updateTotalsDisplay(subtotal, exempt, iva, total) {
    const subtotalElement = document.getElementById('subtotalAmount');
    const exemptElement = document.getElementById('exemptAmount');
    const ivaElement = document.getElementById('ivaAmount');
    const totalElement = document.getElementById('totalAmount');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (exemptElement) exemptElement.textContent = `$${exempt.toFixed(2)}`;
    if (ivaElement) ivaElement.textContent = `$${iva.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// ===== FUNCIONES DE UBICACIÓN =====

// Datos de departamentos y municipios de El Salvador
const departamentosYMunicipios = {
    "01": { // Ahuachapán
        nombre: "Ahuachapán",
        municipios: {
            "01": "Ahuachapán",
            "02": "Apaneca",
            "03": "Atiquizaya",
            "04": "Concepción de Ataco",
            "05": "El Refugio",
            "06": "Guaymango",
            "07": "Jujutla",
            "08": "San Francisco Menéndez",
            "09": "San Lorenzo",
            "10": "San Pedro Puxtla",
            "11": "Tacuba",
            "12": "Turín"
        }
    },
    "10": { // San Salvador
        nombre: "San Salvador",
        municipios: {
            "01": "Aguilares",
            "02": "Apopa",
            "03": "Ayutuxtepeque",
            "04": "Cuscatancingo",
            "05": "El Paisnal",
            "06": "Guazapa",
            "07": "Ilopango",
            "08": "Mejicanos",
            "09": "Nejapa",
            "10": "Panchimalco",
            "11": "Rosario de Mora",
            "12": "San Marcos",
            "13": "San Martín",
            "14": "San Salvador",
            "15": "Santiago Texacuangos",
            "16": "Santo Tomás",
            "17": "Soyapango",
            "18": "Tonacatepeque"
        }
    }
    // Aquí puedes agregar más departamentos según necesites
};

// Configurar eventos para departamento/municipio
document.addEventListener('DOMContentLoaded', function() {
    const departmentSelect = document.querySelector('select[name="department"]');
    const municipalitySelect = document.querySelector('select[name="municipality"]');
    
    if (departmentSelect && municipalitySelect) {
        departmentSelect.addEventListener('change', function() {
            updateMunicipalities(this.value, municipalitySelect);
        });
    }
});

function updateMunicipalities(departmentCode, municipalitySelect) {
    // Limpiar municipios
    municipalitySelect.innerHTML = '<option value="">Elija una opción</option>';
    
    if (departmentCode && departamentosYMunicipios[departmentCode]) {
        const municipios = departamentosYMunicipios[departmentCode].municipios;
        
        for (const [code, name] of Object.entries(municipios)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            municipalitySelect.appendChild(option);
        }
    }
}

// ===== FUNCIONES DE DOCUMENTOS DTE =====

async function submitDTEDocument(formData) {
    try {
        const response = await axios.post('/dte/create', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error al crear documento DTE:', error);
        throw error;
    }
}

// ===== VALIDACIONES =====

function validateNIT(nit) {
    // Validación básica de NIT salvadoreño
    const nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}$/;
    return nitRegex.test(nit);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== UTILIDADES =====

function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('documentFormAlert') || 
                    document.getElementById('loginError') ||
                    createAlertElement();
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('hidden');
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

function createAlertElement() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    document.body.insertBefore(alertDiv, document.body.firstChild);
    return alertDiv;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===== INICIALIZACIÓN =====

// Auto-calcular totales cuando se modifican inputs
document.addEventListener('input', function(e) {
    if (e.target.matches('input[name="quantity[]"], input[name="price[]"]') ||
        e.target.matches('select[name="saleType[]"]')) {
        calculateTotals();
    }
});

// Validación en tiempo real de campos
document.addEventListener('input', function(e) {
    if (e.target.name === 'nit') {
        const isValid = validateNIT(e.target.value);
        e.target.style.borderColor = isValid || e.target.value === '' ? '' : '#dc2626';
    }
    
    if (e.target.name === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid || e.target.value === '' ? '' : '#dc2626';
    }
});