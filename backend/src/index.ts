import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import proyectosRoutes from './routes/proyectos';
import categoriasRoutes from './routes/categorias';
import tiposParticipacionRoutes from './routes/tipos-participacion';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas API
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/tipos-participacion', tiposParticipacionRoutes);

// Ruta de bienvenida
app.get('/', (_req, res) => {
    res.json({
        message: 'Conectando Corazones Backend API',
        version: '1.0.0',
        endpoints: {
            proyectos: '/api/proyectos',
            categorias: '/api/categorias',
            tiposParticipacion: '/api/tipos-participacion'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`📚 API disponible en http://localhost:${PORT}/api`);
});