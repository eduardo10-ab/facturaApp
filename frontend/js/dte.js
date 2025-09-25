// dte.js - ubicación, creación y envío de DTEs

const departamentosYMunicipios = {
    "01": { nombre: "Ahuachapán", municipios: { "01":"Ahuachapán", "02":"Apaneca", "03":"Atiquizaya", "04":"Concepción de Ataco", "05":"El Refugio", "06":"Guaymango", "07":"Jujutla", "08":"San Francisco Menéndez", "09":"San Lorenzo", "10":"San Pedro Puxtla", "11":"Tacuba", "12":"Turín" } },
    "10": { nombre: "San Salvador", municipios: { "01":"Aguilares", "02":"Apopa", "03":"Ayutuxtepeque", "04":"Cuscatancingo", "05":"El Paisnal", "06":"Guazapa", "07":"Ilopango", "08":"Mejicanos", "09":"Nejapa", "10":"Panchimalco", "11":"Rosario de Mora", "12":"San Marcos", "13":"San Martín", "14":"San Salvador", "15":"Santiago Texacuangos", "16":"Santo Tomás", "17":"Soyapango", "18":"Tonacatepeque" } }
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
    municipalitySelect.innerHTML = '<option value="">Elija una opción</option>';
    if (departmentCode && departamentosYMunicipios[departmentCode]) {
        const municipios = departamentosYMunicipios[departmentCode].municipios;
        for (const [code, name] of Object.entries(municipios)) {
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = name;
            municipalitySelect.appendChild(opt);
        }
    }
}

function createDocument(type) {
    const titles = {
        'ccf': 'Comprobante de crédito fiscal',
        'factura': 'Factura',
        'declaracion': 'Declaración de renta'
    };
    currentDocumentType = type;
    const titleEl = document.getElementById('documentTitle');
    if (titleEl) titleEl.textContent = titles[type] || 'Documento';
    showSection('documentFormSection');
}

async function handleDTEFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitDocumentBtn');
    const alertDiv = document.getElementById('documentFormAlert');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Generando documento...';

    try {
        const form = collectFormData();
        console.log('Formulario DTE ->', form);

        const response = await submitDTEDocument(form);
        showAlert('Documento generado exitosamente', 'success');

        setTimeout(() => {
            const dteForm = document.getElementById('dteForm');
            if (dteForm) dteForm.reset();
            calculateTotals();
            if (alertDiv) alertDiv.classList.add('hidden');
        }, 3000);
    } catch (error) {
        console.error('Error al generar documento:', error);
        showAlert('Error al generar el documento: ' + (error.message || 'ver consola'), 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generar documento';
    }
}

async function submitDTEDocument(formObj) {
    try {
        const response = await axios.post('/dte/create', formObj, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear documento DTE:', error);
        throw error;
    }
}

function collectFormData() {
    const form = document.getElementById('dteForm');
    const fd = new FormData(form);
    const products = [];
    const quantities = fd.getAll('quantity[]');
    const units = fd.getAll('unit[]');
    const productNames = fd.getAll('product[]');
    const saleTypes = fd.getAll('saleType[]');
    const prices = fd.getAll('price[]');

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
            nit: fd.get('nit'),
            nrc: fd.get('nrc'),
            name: fd.get('clientName'),
            commercialName: fd.get('commercialName'),
            economicActivity: fd.get('economicActivity'),
            department: fd.get('department'),
            municipality: fd.get('municipality'),
            address: fd.get('address'),
            email: fd.get('email'),
            phone: fd.get('phone')
        },
        products: products,
        paymentMethod: fd.get('paymentMethod'),
        issuer: {
            docNumber: fd.get('issuerDocNum'),
            name: fd.get('issuerName')
        },
        receiverResponsible: {
            docNumber: fd.get('receiverDocNum'),
            name: fd.get('receiverName')
        }
    };
}
