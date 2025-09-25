// utils.js - utilidades compartidas
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('documentFormAlert') ||
                     document.getElementById('loginError') ||
                     createAlertElement();

    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('hidden');

    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

function createAlertElement() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert hidden';
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
