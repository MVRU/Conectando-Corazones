<script lang="ts">
	import type { EstadoDescripcion } from '$lib/domain/types/Estado';
	import { ESTADO_LABELS } from '$lib/domain/types/Estado';

	let { estado } = $props<{
		estado: EstadoDescripcion;
	}>();

	const estadoConfig: Record<
		EstadoDescripcion,
		{ dotColor: string; bgColor: string; textColor: string; borderColor: string }
	> = {
		borrador: {
			dotColor: 'bg-slate-400',
			bgColor: 'bg-slate-50',
			textColor: 'text-slate-600',
			borderColor: 'border-slate-200'
		},
		en_curso: {
			dotColor: 'bg-green-500',
			bgColor: 'bg-green-50',
			textColor: 'text-green-700',
			borderColor: 'border-green-200'
		},
		en_revision: {
			dotColor: 'bg-yellow-500',
			bgColor: 'bg-yellow-50',
			textColor: 'text-yellow-700',
			borderColor: 'border-yellow-200'
		},
		completado: {
			dotColor: 'bg-blue-500',
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-700',
			borderColor: 'border-blue-200'
		},
		cancelado: {
			dotColor: 'bg-gray-400',
			bgColor: 'bg-gray-50',
			textColor: 'text-gray-600',
			borderColor: 'border-gray-200'
		},
		en_auditoria: {
			dotColor: 'bg-orange-500',
			bgColor: 'bg-orange-50',
			textColor: 'text-orange-700',
			borderColor: 'border-orange-200'
		},
		pendiente_solicitud_cierre: {
			dotColor: 'bg-purple-500',
			bgColor: 'bg-purple-50',
			textColor: 'text-purple-700',
			borderColor: 'border-purple-200'
		}
	};

	let config = $derived(estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.en_curso);
</script>

<div class="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold {config.bgColor} {config.textColor} shadow-sm border {config.borderColor}">
	<span class="h-1.5 w-1.5 rounded-full {config.dotColor} shadow-sm"></span>
	{ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS]}
</div>
