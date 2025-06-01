import type { Project } from '$lib/models/Project';

export const projects: Project[] = [
    {
        id: 1,
        titulo: 'Un libro, un sueño',
        descripcion:
            'Una escuela rural necesita libros para su biblioteca escolar. Con tu ayuda, podemos proporcionar materiales educativos que inspiren a los niños a soñar más allá de su entorno.',
        imagen: '/img/proyectos-1.jpg',
        actual: 180,
        objetivo: 200,
        unidad: 'materiales',
        especie: 'libros',
        deadline: '2025-09-30',
        institucion: 'Escuela Nº 123',
        ubicacion: 'Rosario, Santa Fe'
    },
    {
        id: 2,
        titulo: 'Comedores con alma',
        descripcion:
            'Un comedor comunitario en una zona urbana marginal requiere alimentos no perecederos para alimentar a más de 50 familias semanales. Tu contribución garantizará que nadie pase hambre.',
        imagen: '/img/proyectos-2.jpg',
        actual: 18_000,
        objetivo: 32_000,
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
        imagen: '/img/proyectos-3.jpg',
        actual: 24,
        objetivo: 40,
        unidad: 'voluntarios',
        deadline: '2025-07-15',
        institucion: 'Fundación Siempre',
        ubicacion: 'Rosario, Santa Fe'
    }
];