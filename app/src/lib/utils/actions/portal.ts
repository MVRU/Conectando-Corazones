/**
 * Acción de Svelte para teletransportar un elemento a otro lugar del DOM (por defecto, body).
 * Útil para modales, tooltips y menús flotantes que necesitan escapar de su contexto de apilamiento (stacking context).
 */
export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
	let targetNode: Element | null;

	function update(newTarget: HTMLElement | string) {
		targetNode = typeof newTarget === 'string' ? document.querySelector(newTarget) : newTarget;
		if (targetNode) {
			targetNode.appendChild(node);
		}
	}

	function destroy() {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	update(target);

	return {
		update,
		destroy
	};
}
