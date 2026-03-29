/**
 * Lista de palabras que no deben capitalizarse a menos que sean la primera palabra
 */
const LOWERCASE_CONNECTORS = [
	'de',
	'del',
	'da',
	'do',
	'dos',
	'la',
	'las',
	'lo',
	'los',
	'le',
	'les',
	'y',
	'e',
	'o',
	'u',
	'a',
	'con',
	'sin',
	'por',
	'para',
	'al'
];

/**
 * Normaliza un nombre con capitalización adecuada (title case) mientras preserva los acentos
 *
 * Reglas:
 * - Elimina espacios al inicio y al final
 * - Normaliza múltiples espacios a un solo espacio
 * - La primera letra de cada palabra se pone en mayúscula, el resto en minúscula
 * - Los conectores comunes (de, del, la, los, etc.) se mantienen en minúscula a menos que sean la primera palabra
 * - Se preservan los acentos y caracteres especiales
 *
 * @param text - Texto a normalizar (puede ser null/undefined)
 * @returns Texto normalizado o valor original si es inválido
 */
export function normalizeName(text: string | null | undefined): string | null | undefined {
	if (!text) return text;
	if (typeof text !== 'string') return text;

	// Elimina espacios al inicio y al final, y normaliza múltiples espacios a uno solo
	const trimmed = text.trim().replace(/\s+/g, ' ');

	if (!trimmed) return text;

	// Divide en palabras
	const words = trimmed.split(' ');

	// Capitaliza cada palabra, aplicando las reglas de los conectores
	const normalized = words.map((word, index) => {
		if (!word) return word;

		const lowerWord = word.toLowerCase();

		// La primera palabra siempre se capitaliza
		if (index === 0) {
			return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
		}

		// Verifica si es un conector que debe permanecer en minúscula
		if (LOWERCASE_CONNECTORS.includes(lowerWord)) {
			return lowerWord;
		}

		// Palabra regular: capitaliza la primera letra
		return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
	});

	return normalized.join(' ');
}
