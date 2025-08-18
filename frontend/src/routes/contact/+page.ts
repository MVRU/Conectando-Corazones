import type { PageLoad } from './$types';

const tipoToAsunto: Record<string, string> = {
    sugerencia: 'feedback',
    soporte: 'soporte-tecnico',
    denuncia: 'denuncia'
};

export const load: PageLoad = ({ url }) => {
    const tipo = url.searchParams.get('tipo') ?? '';
    return {
        preselectedAsunto: tipoToAsunto[tipo] ?? ''
    };
};