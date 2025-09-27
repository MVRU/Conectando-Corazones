// Rutas para tipos de participación - Backend Express
import { Router } from 'express';
import prisma from '../config/db';

const router = Router();

// GET /api/tipos-participacion - Obtener todos los tipos de participación
router.get('/', async (req, res) => {
    try {
        const tiposParticipacion = await prisma.tipoParticipacion.findMany({
            orderBy: {
                descripcion: 'asc'
            }
        });

        res.json({
            success: true,
            data: tiposParticipacion
        });
    } catch (error) {
        console.error('Error al obtener tipos de participación:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/tipos-participacion - Crear un nuevo tipo de participación
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        
        if (!body.descripcion) {
            return res.status(400).json({
                success: false,
                error: 'La descripción es requerida'
            });
        }

        const tipoParticipacion = await prisma.tipoParticipacion.create({
            data: {
                descripcion: body.descripcion
            }
        });

        res.status(201).json({
            success: true,
            data: tipoParticipacion
        });
    } catch (error) {
        console.error('Error al crear tipo de participación:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

export default router;
