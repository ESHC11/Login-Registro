const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- CONEXIÓN BASE DE DATOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // Asegúrate que esto coincida con tu config
    database: 'usuario' // ¡PON EL NOMBRE REAL DE TU BD AQUÍ!
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a BD:', err);
        return;
    }
    console.log('✅ Conectado a MySQL exitosamente');
});

// --- RUTA LOGIN ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (result.length === 0) return res.json({ success: false, message: "Usuario no encontrado" });

        const usuario = result[0];
        bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (isMatch) {
                res.json({ success: true, message: "Login correcto" });
            } else {
                res.json({ success: false, message: "Contraseña incorrecta" });
            }
        });
    });
});

// --- RUTA REGISTRO BLINDADA ---
app.post('/register', (req, res) => {
    const { nombre, email, password } = req.body;

    // 1. Validar que lleguen los datos
    if (!nombre || !email || !password) {
        return res.json({ success: false, message: "Faltan datos" });
    }

    // 2. Verificar si ya existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, data) => {
        if (err) return res.status(500).json({ error: "Error comprobando usuario" });
        if (data.length > 0) return res.json({ success: false, message: "Correo ya registrado" });

        // 3. Encriptar
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: "Error encriptando" });

            // 4. Guardar
            const sqlInsert = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
            db.query(sqlInsert, [nombre, email, hash], (err, result) => {
                if (err) return res.status(500).json({ error: "Error guardando en BD" });
                
                res.json({ success: true, message: "Usuario registrado" });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en el puerto 3000');
});