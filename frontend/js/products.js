// products.js - filas de producto, cálculos y validaciones

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
        <td><button type="button" onclick="removeProductRow(this)" style="background:#dc2626;color:white;border:none;border-radius:4px;padding:5px 8px;cursor:pointer;">×</button></td>
    `;
    tbody.appendChild(newRow);
}

function removeProductRow(button) {
    const tbody = document.getElementById('productsTableBody');
    if (tbody.querySelectorAll('tr').length > 1) {
        button.closest('tr').remove();
        calculateTotals();
    } else {
        alert('Debe mantener al menos un producto');
    }
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

            if (saleType === '1') subtotalGravado += subtotal;
            else if (saleType === '2') subtotalExento += subtotal;
        }
    });

    const iva = subtotalGravado * 0.13;
    const total = subtotalGravado + iva + subtotalExento;

    updateTotalsDisplay(subtotalGravado + subtotalExento, subtotalExento, iva, total);
}

function updateTotalsDisplay(subtotal, exempt, iva, total) {
    const subtotalElement = document.getElementById('subtotalAmount');
    const exemptElement = document.getElementById('exemptAmount');
    const ivaElement = document.getElementById('ivaAmount');
    const totalElement = document.getElementById('totalAmount');

    if (subtotalElement) subtotalElement.textContent = (typeof formatCurrency === 'function') ? formatCurrency(subtotal) : `$${subtotal.toFixed(2)}`;
    if (exemptElement) exemptElement.textContent = (typeof formatCurrency === 'function') ? formatCurrency(exempt) : `$${exempt.toFixed(2)}`;
    if (ivaElement) ivaElement.textContent = (typeof formatCurrency === 'function') ? formatCurrency(iva) : `$${iva.toFixed(2)}`;
    if (totalElement) totalElement.textContent = (typeof formatCurrency === 'function') ? formatCurrency(total) : `$${total.toFixed(2)}`;
}

// Validaciones
function validateNIT(nit) {
    return /^\d{4}-\d{6}-\d{3}-\d{1}$/.test(nit);
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validación en tiempo real y auto-cálculo (si aún no lo hace main.js)
document.addEventListener('input', function(e) {
    if (e.target.name === 'nit') {
        e.target.style.borderColor = validateNIT(e.target.value) || e.target.value === '' ? '' : '#dc2626';
    }
    if (e.target.name === 'email') {
        e.target.style.borderColor = validateEmail(e.target.value) || e.target.value === '' ? '' : '#dc2626';
    }
    if (e.target.matches('input[name="quantity[]"], input[name="price[]"], select[name="saleType[]"]')) {
        calculateTotals();
    }
});
