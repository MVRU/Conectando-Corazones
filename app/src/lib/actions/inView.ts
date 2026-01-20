/**
 * * Interfaz de parámetros para la acción `inView`.
 *
 *  -*- @property threshold: porcentaje de visibilidad requerido para considerar el elemento "en vista" (0 a 1). Por defecto: 0.1 (10%).
 *  -*- @property rootMargin: margen alrededor del viewport para el cálculo de intersección. Por defecto: '0px'.
 *  -*- @property once: si es true, la acción solo se dispara la primera vez que el elemento entra en vista y luego deja de observar. Por defecto: false.
 *  -*- @property onChange: callback que se ejecuta cada vez que cambia el estado de visibilidad del elemento (true = visible, false = no visible).
 */

export interface InViewParams {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
	onChange?: (visible: boolean) => void;
}

/**
 * ! Acción Svelte para detectar si un elemento está en el viewport (visible para el usuario).
 */

export function inView(
	node: HTMLElement,
	{ threshold = 0.1, rootMargin = '0px', once = false, onChange }: InViewParams = {}
) {
	const observer = new IntersectionObserver(
		([entry]) => {
			const visible = entry.isIntersecting;
			// Llama al callback si está definido
			onChange?.(visible);
			// Si solo queremos observar una vez y ya es visible, deja de observar
			if (visible && once) observer.unobserve(node);
		},
		{ threshold, rootMargin }
	);
	// Comienza a observar el nodo
	observer.observe(node);

	// Limpia el observer cuando el nodo se desmonta
	return { destroy: () => observer.disconnect() };
}
