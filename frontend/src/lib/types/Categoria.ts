// * DECISIÓN DE DISEÑO
// -*-  Se usa number porque el id es INTEGER autoincremental por defecto
// -*-  El id_categoria se marca como opcional (?) para posibles flujos de creación

export interface Categoria {
	id_categoria?: number;
	descripcion: string;
}
