// Acá creamos un servicio para consumir la API de Renaper

import axios from 'axios';

export const renaperAPI = axios.create({
    baseURL: 'https://api.renaper.gob.ar',
    timeout: 10000,
});
