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
			dotColor: 'bg-slate-400 dark:bg-slate-300',
			bgColor: 'bg-slate-50 dark:bg-slate-400/10',
			textColor: 'text-slate-600 dark:text-slate-300',
			borderColor: 'border-slate-200 dark:border-slate-400/20'
		},
		en_curso: {
			dotColor: 'bg-green-500 dark:bg-green-400',
			bgColor: 'bg-green-50 dark:bg-green-500/10',
			textColor: 'text-green-700 dark:text-green-300',
			borderColor: 'border-green-200 dark:border-green-500/20'
		},
		en_revision: {
			dotColor: 'bg-yellow-500 dark:bg-yellow-400',
			bgColor: 'bg-yellow-50 dark:bg-yellow-500/10',
			textColor: 'text-yellow-700 dark:text-yellow-300',
			borderColor: 'border-yellow-200 dark:border-yellow-500/20'
		},
		completado: {
			dotColor: 'bg-blue-500 dark:bg-blue-400',
			bgColor: 'bg-blue-50 dark:bg-blue-500/10',
			textColor: 'text-blue-700 dark:text-blue-300',
			borderColor: 'border-blue-200 dark:border-blue-500/20'
		},
		cancelado: {
			dotColor: 'bg-rose-500 dark:bg-rose-400',
			bgColor: 'bg-rose-50 dark:bg-rose-500/10',
			textColor: 'text-rose-700 dark:text-rose-300',
			borderColor: 'border-rose-200 dark:border-rose-500/20'
		},
		en_auditoria: {
			dotColor: 'bg-orange-500 dark:bg-orange-400',
			bgColor: 'bg-orange-50 dark:bg-orange-500/10',
			textColor: 'text-orange-700 dark:text-orange-300',
			borderColor: 'border-orange-200 dark:border-orange-500/20'
		},
		pendiente_solicitud_cierre: {
			dotColor: 'bg-purple-500 dark:bg-purple-400',
			bgColor: 'bg-purple-50 dark:bg-purple-500/10',
			textColor: 'text-purple-700 dark:text-purple-300',
			borderColor: 'border-purple-200 dark:border-purple-500/20'
		}
	};

	let config = $derived(estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.en_curso);
</script>

<div class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium {config.bgColor} {config.textColor} shadow-sm border {config.borderColor} backdrop-blur-sm transition-colors">
	<span class="h-1.5 w-1.5 rounded-full {config.dotColor} shadow-sm"></span>
	{ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS]}
</div>
