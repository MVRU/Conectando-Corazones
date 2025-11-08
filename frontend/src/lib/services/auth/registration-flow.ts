/**
 * * DECISIÓN DE DISEÑO: se centraliza la transición entre etapas del registro para mantener la lógica de negocio desacoplada de la vista y facilitar su prueba (es distinta para colaborador e institución).
 */
export type RegistroRol = 'institucion' | 'colaborador';

export type RegistroEtapa =
        | 'select'
        | 'form'
        | 'verificando'
        | 'contacto'
        | 'direccion'
        | 'exito'
        | 'error';

export function getNextStageAfterAccountStep(rol: RegistroRol): RegistroEtapa {
        return rol === 'institucion' ? 'verificando' : 'contacto';
}