/**
 * Serializamos entidades de dominio a objetos planos (POJOs) para que sean compatibles con SvelteKit.
 *
 * SvelteKit requiere que los datos retornados desde las funciones `load` sean serializables.
 * Las instancias de clases no son serializables por defecto, por lo que necesitamos convertirlas
 * a objetos planos.
 *
 * @param data - Cualquier dato que necesite ser serializado
 * @returns El dato serializado como POJO
 */
export function serializeDomainEntity<T>(data: T): T {
	try {
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		console.error('Error serializing domain entity:', error);
		// Si falla la serialización, intentamos retornar el dato original
		// Esto puede causar errores de serialización en SvelteKit, pero es mejor
		// que perder completamente los datos
		return data;
	}
}

/**
 * Serializa un array de entidades de dominio.
 * Filtra cualquier elemento que falle al serializarse.
 *
 * @param entities - Array de entidades a serializar
 * @returns Array de entidades serializadas
 */
export function serializeEntityArray<T>(entities: T[]): T[] {
	return entities
		.map((entity) => {
			try {
				return JSON.parse(JSON.stringify(entity));
			} catch (error) {
				console.error('Error serializing entity in array:', error);
				return null;
			}
		})
		.filter((entity): entity is T => entity !== null);
}
