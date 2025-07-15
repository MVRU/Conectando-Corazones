/*
 * Está en "data" porque es una lista de datos estáticos
    -*- No son "mocks" porque no simulan nada; son fuentes fijas de verdad (truthy constants).
    -*- Como no cambian (o muy raramente) tampoco se deberían consultar a una API constantemente.
**/

import type { Step } from '$lib/types/Step';

export const steps: Step[] = [
    {
        stepNumber: 1,
        title: 'Publicá tu necesidad',
        summary: 'Contá tu problemática y cómo pueden ayudarte.',
        details: 'Las instituciones pueden publicar problemáticas de interés social especificando las responsabilidades necesarias para que los colaboradores comprendan claramente cómo pueden ayudar.',
        image: '/img/como-funciona-1.webp'
    },
    {
        stepNumber: 2,
        title: 'Definí responsabilidades específicas',
        summary: 'Indicá lo que necesitás en detalle.',
        details: 'Cada proyecto incluye responsabilidades claras. Por ejemplo, si requerís voluntariado, especificá cuántos voluntarios necesitás. Si es una donación monetaria, indicá la cantidad exacta a recaudar.',
        image: '/img/como-funciona-2.webp'
    },
    {
        stepNumber: 3,
        title: 'Explorá y postulate',
        summary: 'Buscá proyectos y postulate para colaborar.',
        details: 'Los colaboradores interesados pueden explorar los proyectos publicados, filtrarlos según sus intereses y enviar solicitudes para ayudar. Elegí las responsabilidades que podés cumplir.',
        image: '/img/como-funciona-3.webp'
    },
    {
        stepNumber: 4,
        title: 'Aceptá o rechazá solicitudes',
        summary: 'Elegí las propuestas que mejor se adapten.',
        details: 'Las instituciones revisan las postulaciones recibidas y deciden cuáles aceptar, asegurando que las colaboraciones sean las más adecuadas para el proyecto.',
        image: '/img/como-funciona-4.webp'
    },
    {
        stepNumber: 5,
        title: 'Colaborá en equipo',
        summary: 'Trabajá junto a otros colaboradores y la institución.',
        details: 'Una vez aceptadas las postulaciones, los colaboradores acceden a un chat compartido con la institución y otros colaboradores. Coordiná esfuerzos y trabajá juntos para llevar el proyecto al éxito.',
        image: '/img/como-funciona-5.webp'
    },
    {
        stepNumber: 6,
        title: 'Finalizá y generá impacto',
        summary: 'Marcá el proyecto como completado y mostrá resultados.',
        details: 'Cuando todas las responsabilidades del proyecto son cumplidas, la institución marca el proyecto como completado y presenta documentación formal para garantizar transparencia y autenticidad.',
        image: '/img/como-funciona-6.webp'
    }
];
