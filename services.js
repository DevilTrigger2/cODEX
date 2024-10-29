const express = require("express"); 
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");  // Importar CORS

const app = express();
const PORT = 3000;

// Habilitar CORS y permitir el acceso desde cualquier origen
app.use(cors({
    origin: "http://127.0.0.1:5500", // Agrega el origen específico de tu cliente
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "observatorio"
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint de login
app.post("/login", (req, res) => {
    const { usuarios, contrasena } = req.body;

    // Asegúrate de que los valores de usuarios y contrasena no sean undefined
    if (!usuarios || !contrasena) {
        res.status(400).json({ success: false, message: "Usuario o contraseña no proporcionados" });
        return;
    }

    const query = "SELECT rol FROM usuarios WHERE usuarios = ? AND contrasena = ?";
    db.query(query, [usuarios, contrasena], (err, results) => {
        if (err) {
            console.error("Error en la consulta a la base de datos:", err);  // Muestra el error en la consola del servidor
            res.status(500).json({ success: false, message: "Error en el servidor" });
            return;
        }

        if (results.length > 0) {
            res.json({ success: true, rol: results[0].rol });
        } else {
            res.json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
