<script lang="ts">
	import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/types/Estado';
	import {
		CheckCircle2,
		Clock,
		AlertCircle,
		FileCheck,
		XCircle,
		HelpCircle
	} from 'lucide-svelte';

	export let estado: EstadoDescripcion | undefined = 'en_curso';

	const CONFIG = {
		en_curso: {
			color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
			icon: Clock
		},
		pendiente_solicitud_cierre: {
			color: 'bg-amber-100 text-amber-700 border-amber-200',
			icon: AlertCircle
		},
		en_revision: {
			color: 'bg-blue-100 text-blue-700 border-blue-200',
			icon: FileCheck
		},
		en_auditoria: {
			color: 'bg-purple-100 text-purple-700 border-purple-200',
			icon: FileCheck
		},
		completado: {
			color: 'bg-gray-100 text-gray-700 border-gray-200',
			icon: CheckCircle2
		},
		cancelado: {
			color: 'bg-red-100 text-red-700 border-red-200',
			icon: XCircle
		}
	};

	$: config = CONFIG[estado ?? 'en_curso'] || CONFIG.en_curso;
	$: label = ESTADO_LABELS[estado ?? 'en_curso'] || 'Desconocido';
</script>

<span
	class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border {config.color}"
>
	<svelte:component this={config.icon} class="w-3.5 h-3.5" />
	{label}
</span>
