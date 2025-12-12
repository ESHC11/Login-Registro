const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');

const btnIrARegistro = document.querySelector('.btn-register'); 
const btnVolver = document.getElementById('btnVolver'); 

// --- 1. LÓGICA VISUAL ---
btnIrARegistro.addEventListener('click', () => {
    loginForm.style.display = 'none';      
    registerForm.style.display = 'block';  
    formTitle.innerText = "Crea tu cuenta"; 
});

btnVolver.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    formTitle.innerText = "Inicia sesión aquí";
});

// --- 2. LÓGICA DE REGISTRO ---
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let nombre = document.getElementById('regNombre').value;
    let email = document.getElementById('regEmail').value;
    let password = document.getElementById('regPassword').value;

    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ');
    const emailLimpio = email.trim().replace(/\s+/g, '');

    if(nombreLimpio === "" || emailLimpio === "" || password === "") {
        alert("Por favor, no envíes campos vacíos o solo con espacios.");
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreLimpio, email: emailLimpio, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("¡Cuenta creada! Ahora inicia sesión.");
            btnVolver.click(); 
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// --- 3. LÓGICA DE LOGIN ---
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    const emailLimpio = email.trim().replace(/\s+/g, '');

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpio, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // SI EL LOGIN ES CORRECTO:
            alert("¡Bienvenido! " + data.message);
            window.location.href = "bienvenida.html";
        } else {
            // SI HAY ERROR (Contraseña mal o usuario no existe):
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// --- VALIDACIÓN EN TIEMPO REAL (Mientras escriben) ---

// 1. PARA EL NOMBRE (Evitar dobles espacios)
const inputNombre = document.getElementById('regNombre');

if (inputNombre) {
    inputNombre.addEventListener('input', function() {
        // Si empieza con espacio, lo borra
        if (this.value.startsWith(' ')) {
            this.value = this.value.trimStart();
        }
        // Si hay dos espacios seguidos, los convierte en uno
        this.value = this.value.replace(/\s{2,}/g, ' ');
    });
}

// 2. PARA CORREO Y CONTRASEÑA (Prohibir espacios totalmente)
const inputsSinEspacios = [
    document.getElementById('loginEmail'),
    document.getElementById('loginPassword'),
    document.getElementById('regEmail'),
    document.getElementById('regPassword')
];

inputsSinEspacios.forEach(input => {
    if (input) {
        input.addEventListener('input', function() {
            // Reemplaza cualquier espacio por "nada" inmediatamente
            this.value = this.value.replace(/\s/g, '');
        });
    }
});