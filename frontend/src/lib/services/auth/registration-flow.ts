/**
 * * DECISIÓN DE DISEÑO: se centraliza la transición entre etapas del registro para mantener la lógica de negocio desacoplada de la vista y facilitar su prueba (es distinta para colaborador e institución).
 */
export type RegistroRol = 'institucion' | 'colaborador';

export type RegistroEtapa =
        | 'seleccion'
        | 'formulario'
        | 'verificacion'
        | 'contacto'
        | 'direccion'
        | 'exito'
        | 'error';

export function obtenerSiguienteEtapaCuenta(rol: RegistroRol): RegistroEtapa {
        return rol === 'institucion' ? 'verificacion' : 'contacto';
}