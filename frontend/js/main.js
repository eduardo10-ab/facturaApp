// main.js - inicialización central
document.addEventListener('DOMContentLoaded', function() {
    // Registrar formularios
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const dteForm = document.getElementById('dteForm');
    if (dteForm) dteForm.addEventListener('submit', handleDTEFormSubmit);

    // Selects de ubicación
    setupLocationSelects();

    // Auto-cálculo y validaciones globales
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[name="quantity[]"], input[name="price[]"], select[name="saleType[]"]')) {
            calculateTotals();
        }
        if (e.target.name === 'nit') {
            e.target.style.borderColor = validateNIT(e.target.value) || e.target.value === '' ? '' : '#dc2626';
        }
        if (e.target.name === 'email') {
            e.target.style.borderColor = validateEmail(e.target.value) || e.target.value === '' ? '' : '#dc2626';
        }
    });

    // Intentar restaurar sesión si corresponde
    try { checkAuthentication(); } catch (err) { /* no crítico */ }

    // Mostrar pantalla por defecto
    showSection('loginSection');
});
