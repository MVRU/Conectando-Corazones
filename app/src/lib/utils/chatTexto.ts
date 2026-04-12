export function formatearCantidadMensajes(cantidad: number): string {
	return `${cantidad} ${cantidad === 1 ? 'mensaje' : 'mensajes'}`;
}
