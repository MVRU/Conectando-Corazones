import { browser } from '$app/environment';

export interface ChatOutboxEntry {
	clientId: string;
	contenido: string;
	createdAt: string;
}

function getOutboxKey(proyectoId: number, usuarioId: number): string {
	return `cc-chat-outbox:v1:${usuarioId}:${proyectoId}`;
}

export function readChatOutbox(proyectoId: number, usuarioId: number): ChatOutboxEntry[] {
	if (!browser) {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(getOutboxKey(proyectoId, usuarioId));
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw) as ChatOutboxEntry[];
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.filter(
			(entry) =>
				typeof entry?.clientId === 'string' &&
				typeof entry?.contenido === 'string' &&
				typeof entry?.createdAt === 'string'
		);
	} catch {
		return [];
	}
}

export function writeChatOutbox(
	proyectoId: number,
	usuarioId: number,
	entries: ChatOutboxEntry[]
): void {
	if (!browser) {
		return;
	}

	if (entries.length === 0) {
		window.localStorage.removeItem(getOutboxKey(proyectoId, usuarioId));
		return;
	}

	window.localStorage.setItem(getOutboxKey(proyectoId, usuarioId), JSON.stringify(entries));
}

export function upsertChatOutboxEntry(
	proyectoId: number,
	usuarioId: number,
	entry: ChatOutboxEntry
): ChatOutboxEntry[] {
	const actuales = readChatOutbox(proyectoId, usuarioId);
	const sinDuplicado = actuales.filter((actual) => actual.clientId !== entry.clientId);
	const actualizados = [...sinDuplicado, entry].sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);

	writeChatOutbox(proyectoId, usuarioId, actualizados);
	return actualizados;
}

export function removeChatOutboxEntry(
	proyectoId: number,
	usuarioId: number,
	clientId: string
): ChatOutboxEntry[] {
	const actualizados = readChatOutbox(proyectoId, usuarioId).filter(
		(entry) => entry.clientId !== clientId
	);

	writeChatOutbox(proyectoId, usuarioId, actualizados);
	return actualizados;
}
