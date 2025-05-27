// Este es el servicio para enviar emails utilizando SendGrid

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // TODO: agregar la API KEY de SendGrid a las variables de entorno

export const sendWelcomeEmail = async (to: string) => { // Ejemplo de email de bienvenida tras el registro
    await sgMail.send({
        to,
        from: process.env.SENDGRID_SENDER!,
        subject: '¡Bienvenido a Conectando Corazones!',
        html: '<strong>Gracias por registrarte.</strong>',
    });
};
