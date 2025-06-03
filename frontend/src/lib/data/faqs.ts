import type { Faq } from '$lib/models/Faq';

export const faqs: Faq[] = [
    {
        question: '¿Quién puede registrarse en la plataforma?',
        answer:
            'Cualquier institución que necesite ayuda o cualquier colaborador (persona u organización) interesado en brindarla.'
    },
    {
        question: '¿Cómo se seleccionan los colaboradores para un proyecto?',
        answer:
            'Las instituciones revisan las postulaciones recibidas y eligen a los interesados que mejor se alinean con sus necesidades.'
    },
    {
        question: '¿Es gratuito el uso de la plataforma?',
        answer: 'Sí, el registro y uso de la plataforma son completamente gratuitos.'
    },
    {
        question: '¿Qué tipo de ayuda puedo ofrecer?',
        answer:
            'Podés ofrecer recursos materiales, financiamiento, voluntariado u otros tipos de apoyo según el proyecto.'
    }
];