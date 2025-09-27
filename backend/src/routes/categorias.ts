// Rutas para categorías - Backend Express
import { Router } from 'express';
import prisma from '../config/db';

const router = Router();

// GET /api/categorias - Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await prisma.categoria.findMany({
            orderBy: {
                descripcion: 'asc'
            }
        });

        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/categorias - Crear una nueva categoría
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        
        if (!body.descripcion) {
            return res.status(400).json({
                success: false,
                error: 'La descripción es requerida'
            });
        }

        const categoria = await prisma.categoria.create({
            data: {
                descripcion: body.descripcion
            }
        });

        res.status(201).json({
            success: true,
            data: categoria
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

export default router;
