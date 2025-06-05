// Acá creamos un servicio para consumir la API de Renaper y Arca

import axios from 'axios';

export const renaperAPI = axios.create({
    baseURL: 'https://api.renaper.gob.ar',
    timeout: 10000,
});

export const arcaAPI = axios.create({
    baseURL: 'https://api.arca.gob.ar',
    timeout: 10000,
});
