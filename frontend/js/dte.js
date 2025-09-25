// dte.js - ubicación, creación y envío de DTEs - NAVEGACIÓN ENTRE PÁGINAS

const departamentosYMunicipios = {
    "01": { nombre: "Ahuachapán", municipios: { "01":"Ahuachapán", "02":"Apaneca", "03":"Atiquizaya", "04":"Concepción de Ataco", "05":"El Refugio", "06":"Guaymango", "07":"Jujutla", "08":"San Francisco Menéndez", "09":"San Lorenzo", "10":"San Pedro Puxtla", "11":"Tacuba", "12":"Turín" } },
    "02": { nombre: "Cabañas", municipios: { "01":"Cinquera", "02":"Dolores", "03":"Guacotecti", "04":"Ilobasco", "05":"Jutiapa", "06":"San Isidro", "07":"Sensuntepeque", "08":"Tejutepeque", "09":"Victoria" } },
    "03": { nombre: "Chalatenango", municipios: { "01":"Agua Caliente", "02":"Arcatao", "03":"Azacualpa", "04":"Citalá", "05":"Comalapa", "06":"Concepción Quezaltepeque", "07":"Chalatenango", "08":"Dulce Nombre de María", "09":"El Carrizal", "10":"El Paraíso", "11":"La Laguna", "12":"La Palma", "13":"La Reina", "14":"Las Vueltas", "15":"Nombre de Jesús", "16":"Nueva Concepción", "17":"Nueva Trinidad", "18":"Ojos de Agua", "19":"Potonico", "20":"San Antonio de la Cruz", "21":"San Antonio Los Ranchos", "22":"San Fernando", "23":"San Francisco Lempa", "24":"San Francisco Morazán", "25":"San Ignacio", "26":"San Isidro Labrador", "27":"San Luis del Carmen", "28":"San Miguel de Mercedes", "29":"San Rafael", "30":"Santa Rita", "31":"Tejutla" } },
    "04": { nombre: "Cuscatlán", municipios: { "01":"Candelaria", "02":"Cojutepeque", "03":"El Carmen", "04":"El Rosario", "05":"Monte San Juan", "06":"Oratorio de Concepción", "07":"San Bartolomé Perulapía", "08":"San Cristóbal", "09":"San José Guayabal", "10":"San Pedro Perulapán", "11":"San Rafael Cedros", "12":"San Ramón", "13":"Santa Cruz Analquito", "14":"Santa Cruz Michapa", "15":"Suchitoto", "16":"Tenancingo" } },
    "05": { nombre: "La Libertad", municipios: { "01":"Antiguo Cuscatlán", "02":"Ciudad Arce", "03":"Colón", "04":"Comasagua", "05":"Chiltiupán", "06":"Huizúcar", "07":"Jayaque", "08":"Jicalapa", "09":"La Libertad", "10":"Santa Tecla", "11":"Nuevo Cuscatlán", "12":"San Juan Opico", "13":"Quezaltepeque", "14":"Sacacoyo", "15":"San José Villanueva", "16":"San Matías", "17":"San Pablo Tacachico", "18":"Tamanique", "19":"Talnique", "20":"Teotepeque", "21":"Tepecoyo", "22":"Zaragoza" } },
    "06": { nombre: "La Paz", municipios: { "01":"Cuyultitán", "02":"El Rosario", "03":"Jerusalén", "04":"Mercedes La Ceiba", "05":"Olocuilta", "06":"Paraíso de Osorio", "07":"San Antonio Masahuat", "08":"San Emigdio", "09":"San Francisco Chinameca", "10":"San Juan Nonualco", "11":"San Juan Talpa", "12":"San Juan Tepezontes", "13":"San Luis La Herradura", "14":"San Luis Talpa", "15":"San Miguel Tepezontes", "16":"San Pedro Masahuat", "17":"San Pedro Nonualco", "18":"San Rafael Obrajuelo", "19":"Santa María Ostuma", "20":"Santiago Nonualco", "21":"Tapalhuaca", "22":"Zacatecoluca" } },
    "07": { nombre: "La Unión", municipios: { "01":"Anamorós", "02":"Bolívar", "03":"Concepción de Oriente", "04":"Conchagua", "05":"El Carmen", "06":"El Sauce", "07":"Intipucá", "08":"La Unión", "09":"Lilí", "10":"Meanguera del Golfo", "11":"Nueva Esparta", "12":"Pasaquina", "13":"Polorós", "14":"San Alejo", "15":"San José", "16":"Santa Rosa de Lima", "17":"Yayantique", "18":"Yucuaiquín" } },
    "08": { nombre: "Morazán", municipios: { "01":"Arambala", "02":"Cacaopera", "03":"Chilanga", "04":"Corinto", "05":"Delicias de Concepción", "06":"El Divisadero", "07":"El Rosario", "08":"Gualococti", "09":"Guatajiagua", "10":"Joateca", "11":"Jocoaitique", "12":"Jocoro", "13":"Lolotiquillo", "14":"Meanguera", "15":"Osicala", "16":"Perquín", "17":"San Carlos", "18":"San Fernando", "19":"San Francisco Gotera", "20":"San Isidro", "21":"San Simón", "22":"Sensembra", "23":"Sociedad", "24":"Torola", "25":"Yamabal", "26":"Yoloaiquín" } },
    "09": { nombre: "San Miguel", municipios: { "01":"Carolina", "02":"Ciudad Barrios", "03":"Comacarán", "04":"Chapeltique", "05":"Chinameca", "06":"Chirilagua", "07":"El Tránsito", "08":"Lolotique", "09":"Moncagua", "10":"Nueva Guadalupe", "11":"Nuevo Edén de San Juan", "12":"Quelepa", "13":"San Antonio del Mosco", "14":"San Gerardo", "15":"San Jorge", "16":"San Luis de la Reina", "17":"San Miguel", "18":"San Rafael Oriente", "19":"Sesori", "20":"Uluazapa" } },
    "10": { nombre: "San Salvador", municipios: { "01":"Aguilares", "02":"Apopa", "03":"Ayutuxtepeque", "04":"Cuscatancingo", "05":"El Paisnal", "06":"Guazapa", "07":"Ilopango", "08":"Mejicanos", "09":"Nejapa", "10":"Panchimalco", "11":"Rosario de Mora", "12":"San Marcos", "13":"San Martín", "14":"San Salvador", "15":"Santiago Texacuangos", "16":"Santo Tomás", "17":"Soyapango", "18":"Tonacatepeque" } },
    "11": { nombre: "San Vicente", municipios: { "01":"Apastepeque", "02":"Guadalupe", "03":"San Cayetano Istepeque", "04":"San Esteban Catarina", "05":"San Ildefonso", "06":"San Lorenzo", "07":"San Sebastián", "08":"San Vicente", "09":"Santa Clara", "10":"Santo Domingo", "11":"Tecoluca", "12":"Tepetitán", "13":"Verapaz" } },
    "12": { nombre: "Santa Ana", municipios: { "01":"Candelaria de la Frontera", "02":"Coatepeque", "03":"Chalchuapa", "04":"El Congo", "05":"El Porvenir", "06":"Masahuat", "07":"Metapán", "08":"San Antonio Pajonal", "09":"San Sebastián Salitrillo", "10":"Santa Ana", "11":"Santa Rosa Guachipilín", "12":"Santiago de la Frontera", "13":"Texistepeque" } },
    "13": { nombre: "Sonsonate", municipios: { "01":"Acajutla", "02":"Armenia", "03":"Caluco", "04":"Cuisnahuat", "05":"Santa Isabel Ishuatán", "06":"Izalco", "07":"Juayúa", "08":"Nahuizalco", "09":"Nahulingo", "10":"Salcoatitán", "11":"San Antonio del Monte", "12":"San Julián", "13":"Santa Catarina Masahuat", "14":"Santo Domingo de Guzmán", "15":"Sonsonate", "16":"Sonzacate" } },
    "14": { nombre: "Usulután", municipios: { "01":"Alegría", "02":"Berlín", "03":"California", "04":"Concepción Batres", "05":"El Triunfo", "06":"Ereguayquín", "07":"Estanzuelas", "08":"Jiquilisco", "09":"Jucuapa", "10":"Jucuarán", "11":"Mercedes Umaña", "12":"Nueva Granada", "13":"Ozatlán", "14":"Puerto El Triunfo", "15":"San Agustín", "16":"San Buenaventura", "17":"San Dionisio", "18":"San Francisco Javier", "19":"Santa Elena", "20":"Santa María", "21":"Santiago de María", "22":"Tecapán", "23":"Usulután" } }
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

// FUNCIÓN MODIFICADA para navegación entre páginas
function createDocument(type) {
    const titles = {
        'ccf': 'Comprobante de crédito fiscal',
        'factura': 'Factura',
        'declaracion': 'Declaración de renta'
    };
    
    // Guardar información para la siguiente página
    localStorage.setItem('selectedDocumentType', type);
    localStorage.setItem('documentTitle', titles[type] || 'Documento');
    
    // Navegar a la página del formulario
    navigateToPage('formulario.html');
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

    // Obtener el tipo de documento del localStorage
    const documentType = localStorage.getItem('selectedDocumentType') || currentDocumentType;

    return {
        documentType: documentType,
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