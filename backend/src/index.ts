import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(express.json());

// Rutas
// app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
    res.send('Conectando Corazones Backend');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
