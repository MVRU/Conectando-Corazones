// Rutas para proyectos - Backend Express
import { Router } from 'express';
import prisma from '../config/db';

const router = Router();

// GET /api/proyectos - Obtener todos los proyectos
router.get('/', async (req, res) => {
    try {
        const proyectos = await prisma.proyecto.findMany({
            include: {
                estado: true,
                institucion: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                        nombre_legal: true,
                        tipo_institucion: true
                    }
                },
                categorias: {
                    include: {
                        categoria: true
                    }
                },
                participaciones_permitidas: {
                    include: {
                        tipo_participacion: true
                    }
                },
                ubicaciones: {
                    include: {
                        ubicacion: {
                            include: {
                                direccion: {
                                    include: {
                                        localidad: {
                                            include: {
                                                provincia: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.json({
            success: true,
            data: proyectos
        });
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/proyectos/:id - Obtener un proyecto específico
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de proyecto inválido'
            });
        }

        const proyecto = await prisma.proyecto.findUnique({
            where: { id_proyecto: id },
            include: {
                estado: true,
                institucion: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                        nombre_legal: true,
                        tipo_institucion: true
                    }
                },
                categorias: {
                    include: {
                        categoria: true
                    }
                },
                participaciones_permitidas: {
                    include: {
                        tipo_participacion: true
                    }
                },
                ubicaciones: {
                    include: {
                        ubicacion: {
                            include: {
                                direccion: {
                                    include: {
                                        localidad: {
                                            include: {
                                                provincia: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                colaboraciones: {
                    include: {
                        colaborador: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true,
                                tipo_colaborador: true
                            }
                        }
                    }
                },
                evidencias: {
                    include: {
                        archivos: true
                    }
                },
                solicitudes_finalizacion: {
                    include: {
                        evidencias: {
                            include: {
                                evidencia: true
                            }
                        }
                    }
                }
            }
        });

        if (!proyecto) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        res.json({
            success: true,
            data: proyecto
        });
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/proyectos - Crear un nuevo proyecto
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        
        // Validación básica
        if (!body.titulo || !body.descripcion || !body.fecha_fin_tentativa || !body.institucion_id) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        const proyecto = await prisma.proyecto.create({
            data: {
                titulo: body.titulo,
                descripcion: body.descripcion,
                url_portada: body.url_portada,
                fecha_cierre_postulaciones: body.fecha_cierre_postulaciones ? new Date(body.fecha_cierre_postulaciones) : null,
                fecha_fin_tentativa: new Date(body.fecha_fin_tentativa),
                beneficiarios: body.beneficiarios,
                id_chat_firebase: body.id_chat_firebase,
                estado_id: body.estado_id || 1, // Estado por defecto
                institucion_id: body.institucion_id,
                categorias: body.categoria_ids ? {
                    create: body.categoria_ids.map((categoriaId: number) => ({
                        categoria: {
                            connect: { id_categoria: categoriaId }
                        }
                    }))
                } : undefined,
                participaciones_permitidas: body.participaciones_permitidas ? {
                    create: body.participaciones_permitidas.map((pp: any) => ({
                        id_tipo_participacion: pp.id_tipo_participacion,
                        objetivo: pp.objetivo,
                        actual: pp.actual || 0,
                        unidad_medida: pp.unidad_medida,
                        especie: pp.especie
                    }))
                } : undefined
            },
            include: {
                estado: true,
                institucion: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                        nombre_legal: true,
                        tipo_institucion: true
                    }
                },
                categorias: {
                    include: {
                        categoria: true
                    }
                },
                participaciones_permitidas: {
                    include: {
                        tipo_participacion: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: proyecto
        });
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// PUT /api/proyectos/:id - Actualizar un proyecto
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de proyecto inválido'
            });
        }

        const body = req.body;

        // Verificar que el proyecto existe
        const proyectoExistente = await prisma.proyecto.findUnique({
            where: { id_proyecto: id }
        });

        if (!proyectoExistente) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        const proyecto = await prisma.proyecto.update({
            where: { id_proyecto: id },
            data: {
                titulo: body.titulo,
                descripcion: body.descripcion,
                url_portada: body.url_portada,
                fecha_cierre_postulaciones: body.fecha_cierre_postulaciones ? new Date(body.fecha_cierre_postulaciones) : null,
                fecha_fin_tentativa: body.fecha_fin_tentativa ? new Date(body.fecha_fin_tentativa) : undefined,
                beneficiarios: body.beneficiarios,
                id_chat_firebase: body.id_chat_firebase,
                estado_id: body.estado_id,
                institucion_id: body.institucion_id
            },
            include: {
                estado: true,
                institucion: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                        nombre_legal: true,
                        tipo_institucion: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: proyecto
        });
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// DELETE /api/proyectos/:id - Eliminar un proyecto
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de proyecto inválido'
            });
        }

        // Verificar que el proyecto existe
        const proyectoExistente = await prisma.proyecto.findUnique({
            where: { id_proyecto: id }
        });

        if (!proyectoExistente) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        await prisma.proyecto.delete({
            where: { id_proyecto: id }
        });

        res.json({
            success: true,
            message: 'Proyecto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

export default router;
