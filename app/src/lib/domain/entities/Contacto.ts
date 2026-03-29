export class Contacto {
	id_contacto?: number;
	tipo_contacto: string;
	valor: string;
	etiqueta?: string | null;
	usuario_id?: number | null;

	constructor(data: Partial<Contacto> & Pick<Contacto, 'tipo_contacto' | 'valor'>) {
		this.id_contacto = data.id_contacto;
		this.tipo_contacto = data.tipo_contacto;
		this.valor = data.valor;
		this.etiqueta = data.etiqueta ?? undefined;
		this.usuario_id = data.usuario_id ?? undefined;
		this.validarInvariantes();
	}

	private validarInvariantes() {
		if (!this.valor || this.valor.trim() === '') {
			throw new Error('El valor del contacto es obligatorio.');
		}
		if (!this.tipo_contacto || this.tipo_contacto.trim() === '') {
			throw new Error('El tipo de contacto es obligatorio.');
		}
	}
}
