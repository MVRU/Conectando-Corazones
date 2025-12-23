/**
 * Utilidades para exportar datos a CSV
 */

/**
 * Convierte un array de objetos a formato CSV
 */
export function convertirACSV(
	datos: Record<string, unknown>[],
	columnas: Array<{ clave: string; etiqueta: string }>
): string {
	if (datos.length === 0) return '';

	// Encabezados
	const encabezados = columnas.map((col) => col.etiqueta).join(',');
	
	// Filas de datos
	const filas = datos.map((dato) => {
		return columnas
			.map((col) => {
				const valor = dato[col.clave];
				// Escapar comillas y envolver en comillas si contiene comas o comillas
				if (valor === null || valor === undefined) return '';
				const valorStr = String(valor);
				if (valorStr.includes(',') || valorStr.includes('"') || valorStr.includes('\n')) {
					return `"${valorStr.replace(/"/g, '""')}"`;
				}
				return valorStr;
			})
			.join(',');
	});

	return [encabezados, ...filas].join('\n');
}

/**
 * Descarga un archivo CSV
 */
export function descargarCSV(contenido: string, nombreArchivo: string): void {
	const blob = new Blob(['\ufeff' + contenido], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = nombreArchivo;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Exporta usuarios a CSV
 */
export function exportarUsuarios(usuarios: Array<Record<string, unknown>>): void {
	const columnas: Array<{ clave: string; etiqueta: string }> = [
		{ clave: 'id_usuario', etiqueta: 'ID' },
		{ clave: 'username', etiqueta: 'Usuario' },
		{ clave: 'nombre', etiqueta: 'Nombre' },
		{ clave: 'apellido', etiqueta: 'Apellido' },
		{ clave: 'rol', etiqueta: 'Rol' },
		{ clave: 'estado', etiqueta: 'Estado' },
		{ clave: 'created_at', etiqueta: 'Fecha Registro' }
	];

	const datosFormateados: Record<string, unknown>[] = usuarios.map((u) => ({
		id_usuario: u.id_usuario ?? '',
		username: u.username ?? '',
		nombre: u.nombre ?? '',
		apellido: u.apellido ?? '',
		rol: u.rol ?? '',
		estado: u.estado ?? '',
		created_at: u.created_at instanceof Date ? u.created_at.toLocaleDateString('es-AR') : (u.created_at ?? '')
	}));

	const csv = convertirACSV(datosFormateados, columnas);
	const fecha = new Date().toISOString().split('T')[0];
	descargarCSV(csv, `usuarios_${fecha}.csv`);
}

/**
 * Exporta proyectos a CSV
 */
export function exportarProyectos(proyectos: Array<Record<string, unknown>>): void {
	const columnas: Array<{ clave: string; etiqueta: string }> = [
		{ clave: 'id_proyecto', etiqueta: 'ID' },
		{ clave: 'titulo', etiqueta: 'Título' },
		{ clave: 'descripcion', etiqueta: 'Descripción' },
		{ clave: 'estado', etiqueta: 'Estado' },
		{ clave: 'institucion', etiqueta: 'Institución' },
		{ clave: 'created_at', etiqueta: 'Fecha Creación' },
		{ clave: 'fecha_fin_tentativa', etiqueta: 'Fecha Fin Tentativa' }
	];

	const datosFormateados: Record<string, unknown>[] = proyectos.map((p) => {
		let estadoStr = 'N/A';
		if (p.estado) {
			if (typeof p.estado === 'object' && p.estado !== null && 'descripcion' in p.estado) {
				estadoStr = String((p.estado as { descripcion: unknown }).descripcion);
			} else if (typeof p.estado === 'string') {
				estadoStr = p.estado;
			}
		}

		let institucionStr = 'N/A';
		if (p.institucion) {
			if (typeof p.institucion === 'object' && p.institucion !== null && 'nombre_legal' in p.institucion) {
				institucionStr = String((p.institucion as { nombre_legal: unknown }).nombre_legal);
			}
		}

		return {
			id_proyecto: p.id_proyecto ?? '',
			titulo: p.titulo ?? '',
			descripcion: p.descripcion ?? '',
			estado: estadoStr,
			institucion: institucionStr,
			created_at: p.created_at instanceof Date ? p.created_at.toLocaleDateString('es-AR') : (p.created_at ?? ''),
			fecha_fin_tentativa: p.fecha_fin_tentativa instanceof Date
				? p.fecha_fin_tentativa.toLocaleDateString('es-AR')
				: (p.fecha_fin_tentativa ?? '')
		};
	});

	const csv = convertirACSV(datosFormateados, columnas);
	const fecha = new Date().toISOString().split('T')[0];
	descargarCSV(csv, `proyectos_${fecha}.csv`);
}
