import type { ColaboracionTipoParticipacion as IColaboracionTipoParticipacion } from '../types/ColaboracionTipoParticipacion';

export class ColaboracionTipoParticipacion implements IColaboracionTipoParticipacion {
    id_colaboracion_tipo_participacion?: number;
    colaboracion_id?: number;
    participacion_permitida_id?: number;
    cantidad: number;

    constructor(data: IColaboracionTipoParticipacion) {
        this.id_colaboracion_tipo_participacion = data.id_colaboracion_tipo_participacion;
        this.colaboracion_id = data.colaboracion_id;
        this.participacion_permitida_id = data.participacion_permitida_id;
        this.cantidad = data.cantidad;
        this.validar();
    }

    private validar(): void {
        if (this.cantidad <= 0) {
            throw new Error('La cantidad del aporte debe ser mayor a cero.');
        }
    }
}
