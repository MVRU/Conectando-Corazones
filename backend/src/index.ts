import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import morgan from 'morgan';
import { connectDB } from './config/db';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000; // TO-DO: configurar el puerto

connectDB();

// app.use(cors());
app.use(helmet());
// app.use(morgan('dev')); // TO-DO: configurar el logger
app.use(express.json());

// Rutas
// app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
    res.send('Le damos la bienvenida a Conectando Corazones Backend');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});