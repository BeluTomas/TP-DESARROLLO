import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './router';
import * as dotenv from 'dotenv';

dotenv.config(); 

// CONEXIÓN A LA BASE DE DATOS
mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;

const dbUrL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_udemy";

mongoose.connect(dbUrL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ CONECTADO A LA BASE DE DATOS"))
    .catch(err => console.error("❌ Error al conectar a la base de datos:", err));

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(path.resolve(), 'public')));

// Rutas
app.use('/api/', router);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Iniciar el servidor
const server = app.listen(app.get('port'), () => {
    console.log(`🚀 SERVIDOR EJECUTÁNDOSE EN EL PUERTO ${PORT}`);
});

// Manejo de error de puerto en uso
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} está en uso. Intenta usar otro puerto.`);
    } else {
        console.error('❌ Error en el servidor:', err);
    }
});