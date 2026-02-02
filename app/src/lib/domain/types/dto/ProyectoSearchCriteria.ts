export interface ProyectoSearchCriteria {
	query?: string;
	estado?: string;
	categoriaIds?: number[];
	limit?: number;
	offset?: number;
}
