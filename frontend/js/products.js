// products.js - filas de producto, cálculos y validaciones - NAVEGACIÓN ENTRE PÁGINAS

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
        <td><button type="button" onclick="removeProductRow(this)" class="remove-product-btn" title="Eliminar producto">×</button></td>
    `;
    tbody.appendChild(newRow);
    
    // Agregar event listeners para validación en tiempo real
    addProductValidationListeners(newRow);
}

function removeProductRow(button) {
    const tbody = document.getElementById('productsTableBody');
    if (tbody.querySelectorAll('tr').length > 1) {
        button.closest('tr').remove();
        calculateTotals();
    } else {
        showAlert('Debe mantener al menos un producto', 'error');
    }
}

function addProductValidationListeners(row) {
    const inputs = row.querySelectorAll('input[name="quantity[]"], input[name="price[]"]');
    const select = row.querySelector('select[name="saleType[]"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
        input.addEventListener('blur', validateProductField);
    });
    
    if (select) {
        select.addEventListener('change', calculateTotals);
    }
}

function validateProductField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    if (field.name === 'quantity[]') {
        const quantity = parseFloat(value);
        if (isNaN(quantity) || quantity <= 0) {
            field.style.borderColor = '#dc2626';
            return false;
        }
    }
    
    if (field.name === 'price[]') {
        const price = parseFloat(value);
        if (isNaN(price) || price < 0) {
            field.style.borderColor = '#dc2626';
            return false;
        }
    }
    
    field.style.borderColor = '';
    return true;
}

function calculateTotals() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    let subtotalGravado = 0, subtotalExento = 0;

    rows.forEach(row => {
        const quantityInput = row.querySelector('input[name="quantity[]"]');
        const priceInput = row.querySelector('input[name="price[]"]');
        const saleTypeSelect = row.querySelector('select[name="saleType[]"]');

        if (quantityInput && priceInput && saleTypeSelect) {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const saleType = saleTypeSelect.value;
            const subtotal = quantity * price;

            if (saleType === '1') {
                subtotalGravado += subtotal;
            } else if (saleType === '2') {
                subtotalExento += subtotal;
            }
        }
    });

    const iva = subtotalGravado * 0.13;
    const total = subtotalGravado + iva + subtotalExento;

    updateTotalsDisplay(subtotalGravado + subtotalExento, subtotalExento, iva, total);
}

function updateTotalsDisplay(subtotal, exempt, iva, total) {
    const elements = {
        subtotalAmount: document.getElementById('subtotalAmount'),
        exemptAmount: document.getElementById('exemptAmount'),
        ivaAmount: document.getElementById('ivaAmount'),
        totalAmount: document.getElementById('totalAmount')
    };

    if (elements.subtotalAmount) {
        elements.subtotalAmount.textContent = formatCurrency(subtotal);
    }
    if (elements.exemptAmount) {
        elements.exemptAmount.textContent = formatCurrency(exempt);
    }
    if (elements.ivaAmount) {
        elements.ivaAmount.textContent = formatCurrency(iva);
    }
    if (elements.totalAmount) {
        elements.totalAmount.textContent = formatCurrency(total);
    }
}

// Validaciones mejoradas
function validateNIT(nit) {
    if (!nit) return true; // Permitir campo vacío
    return /^\d{4}-\d{6}-\d{3}-\d{1}$/.test(nit);
}

function validateNRC(nrc) {
    if (!nrc) return true; // Permitir campo vacío
    return /^\d+$/.test(nrc) && nrc.length >= 8 && nrc.length <= 15;
}

function validateEmail(email) {
    if (!email) return true; // Permitir campo vacío
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    if (!phone) return true; // Permitir campo vacío
    return /^\d{4}-\d{4}$/.test(phone);
}

// Función para validar todo el formulario de productos
function validateProductsForm() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    let isValid = true;
    let hasProducts = false;
    
    rows.forEach(row => {
        const productInput = row.querySelector('input[name="product[]"]');
        const priceInput = row.querySelector('input[name="price[]"]');
        const saleTypeSelect = row.querySelector('select[name="saleType[]"]');
        const quantityInput = row.querySelector('input[name="quantity[]"]');
        
        if (productInput && productInput.value.trim()) {
            hasProducts = true;
            
            // Validar que tenga precio
            if (!priceInput.value || parseFloat(priceInput.value) < 0) {
                priceInput.style.borderColor = '#dc2626';
                isValid = false;
            }
            
            // Validar que tenga tipo de venta
            if (!saleTypeSelect.value) {
                saleTypeSelect.style.borderColor = '#dc2626';
                isValid = false;
            }
            
            // Validar cantidad
            if (!quantityInput.value || parseFloat(quantityInput.value) <= 0) {
                quantityInput.style.borderColor = '#dc2626';
                isValid = false;
            }
        }
    });
    
    if (!hasProducts) {
        showAlert('Debe agregar al menos un producto', 'error');
        return false;
    }
    
    if (!isValid) {
        showAlert('Complete todos los datos requeridos de los productos', 'error');
    }
    
    return isValid;
}

// Función para limpiar validaciones visuales
function clearFieldValidation(field) {
    field.style.borderColor = '';
}

// Inicializar validaciones para productos existentes
function initializeProductValidations() {
    const existingRows = document.querySelectorAll('#productsTableBody tr');
    existingRows.forEach(row => {
        addProductValidationListeners(row);
    });
}

// Auto-inicialización cuando se carga la página del formulario
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'formulario.html') {
        // Inicializar validaciones en productos existentes
        setTimeout(initializeProductValidations, 100);
        
        // Configurar el botón de agregar producto
        const addProductBtn = document.querySelector('.add-product-btn');
        if (addProductBtn) {
            addProductBtn.onclick = addProductRow;
        }
        
        // Calcular totales iniciales
        setTimeout(calculateTotals, 200);
    }
});

// Validación en tiempo real global para campos del formulario
document.addEventListener('input', function(e) {
    // Validaciones específicas por campo
    if (e.target.name === 'nit') {
        const isValid = validateNIT(e.target.value);
        e.target.style.borderColor = isValid ? '' : '#dc2626';
        if (!isValid && e.target.value) {
            e.target.title = 'Formato: 0000-000000-000-0';
        }
    }
    
    if (e.target.name === 'nrc') {
        const isValid = validateNRC(e.target.value);
        e.target.style.borderColor = isValid ? '' : '#dc2626';
    }
    
    if (e.target.name === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid ? '' : '#dc2626';
    }
    
    if (e.target.name === 'phone') {
        const isValid = validatePhone(e.target.value);
        e.target.style.borderColor = isValid ? '' : '#dc2626';
        if (!isValid && e.target.value) {
            e.target.title = 'Formato: 0000-0000';
        }
    }
    
    // Auto-cálculo para productos
    if (e.target.matches('input[name="quantity[]"], input[name="price[]"], select[name="saleType[]"]')) {
        calculateTotals();
    }
});