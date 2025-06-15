import type { Project } from '$lib/types/Project';

export const projects: Project[] = [
    {
        id: 1,
        titulo: 'Un libro, un sueño',
        descripcion:
            'Una escuela rural necesita libros para su biblioteca escolar. Con tu ayuda, podemos proporcionar materiales educativos que inspiren a los niños a soñar más allá de su entorno.',
        imagen: '/img/proyectos-1.webp',
        actual: 180,
        objetivo: 200,
        unidad: 'materiales',
        especie: 'libros',
        deadline: '2025-09-30',
        institucion: 'Escuela Esperanza',
        ubicacion: 'Rosario, Santa Fe'
    },
    {
        id: 2,
        titulo: 'Comedores con alma',
        descripcion:
            'Un comedor comunitario en una zona urbana marginal requiere alimentos no perecederos para alimentar a más de 50 familias semanales. Tu contribución garantizará que nadie pase hambre.',
        imagen: '/img/proyectos-2.webp',
        actual: 180000,
        objetivo: 320000,
        unidad: 'dinero',
        deadline: '2025-06-25',
        institucion: 'Comedor Los Pinos',
        ubicacion: 'La Plata, Buenos Aires'
    },
    {
        id: 3,
        titulo: 'Hogar de sonrisas',
        descripcion:
            'Un hogar de niños con discapacidades necesita voluntarios para organizar talleres artísticos y recreativos. Tu tiempo y talento pueden marcar una diferencia significativa en sus vidas.',
        imagen: '/img/proyectos-3.webp',
        actual: 0,
        objetivo: 20,
        unidad: 'voluntarios',
        deadline: '2025-07-15',
        institucion: 'Fundación Siempre',
        ubicacion: 'Rosario, Santa Fe'
    }
];