import type { Step } from '$lib/models/Step';

export const steps: Step[] = [
    {
        stepNumber: 1,
        title: 'Publicá tu necesidad',
        description:
            'Las instituciones pueden publicar problemáticas de interés social especificando las responsabilidades necesarias para que las organizaciones comprendan claramente cómo pueden ayudar.',
        image: '/img/como-funciona-1.jpg'
    },
    {
        stepNumber: 2,
        title: 'Definí responsabilidades específicas',
        description:
            'Cada proyecto incluye responsabilidades claras. Por ejemplo, si requerís voluntariado, especificá cuántos voluntarios necesitás. Si es una donación monetaria, indicá la cantidad exacta y la moneda.',
        image: '/img/como-funciona-2.jpg'
    },
    {
        stepNumber: 3,
        title: 'Explorá y postulate',
        description:
            'Las organizaciones interesadas pueden explorar los proyectos publicados, filtrarlos según sus intereses y enviar solicitudes para colaborar. Elegí las responsabilidades que podés cumplir.',
        image: '/img/como-funciona-3.jpg'
    },
    {
        stepNumber: 4,
        title: 'Aceptá o rechazá solicitudes',
        description:
            'Las instituciones revisan las solicitudes recibidas de las organizaciones y deciden cuáles aceptar, asegurando que las colaboraciones sean las más adecuadas para el proyecto.',
        image: '/img/como-funciona-4.jpg'
    },
    {
        stepNumber: 5,
        title: 'Colaborá en equipo',
        description:
            'Una vez aceptadas las solicitudes, las organizaciones acceden a un chat compartido con la institución y otras organizaciones. Coordiná esfuerzos y trabajá juntos para llevar el proyecto al éxito.',
        image: '/img/como-funciona-5.jpg'
    },
    {
        stepNumber: 6,
        title: 'Finalizá y generá impacto',
        description:
            'Cuando todas las responsabilidades del proyecto son cumplidas, la institución marca el proyecto como completado y presenta documentación formal para garantizar transparencia y autenticidad.',
        image: '/img/como-funciona-6.jpg'
    }
];
