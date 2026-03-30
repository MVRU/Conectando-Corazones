<script lang="ts">
	import {
		ShieldCheck,
		Clock,
		ShieldExclamation,
		CheckBadge,
		UserCircle
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { EstadoVerificacionDisplay } from '$lib/utils/util-verificacion';

	let { estado = $bindable(), href = null, textoAccion = null } = $props<{
		estado: EstadoVerificacionDisplay;
		href?: string | null;
		textoAccion?: string | null;
	}>();

	const badgeConfig = {
		sin_verificacion: {
			color: 'bg-gray-100 text-gray-600 border-gray-200',
			icon: UserCircle,
			label: 'Sin verificación'
		},
		verificacion_pendiente: {
			color: 'bg-amber-100 text-amber-700 border-amber-200',
			icon: Clock,
			label: 'Verificación pendiente'
		},
		verificacion_rechazada: {
			color: 'bg-rose-100 text-rose-700 border-rose-200',
			icon: ShieldExclamation,
			label: 'Verificación rechazada'
		},
		verificado_email_institucional: {
			color: 'bg-blue-100 text-blue-700 border-blue-200',
			icon: CheckBadge,
			label: 'Verificado por email institucional'
		},
		verificado_documental: {
			color: 'bg-green-100 text-green-700 border-green-200',
			icon: ShieldCheck,
			label: 'Verificado por revisión documental'
		},
		verificado_renaper: {
			color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
			icon: ShieldExclamation,
			label: 'Verificado por RENAPER/SID'
		}
	} as const;

	type EstadoKey = keyof typeof badgeConfig;

	let config = $derived(badgeConfig[estado as EstadoKey]);
	let labelMostrado = $derived(textoAccion ?? config.label);

	// Textos cortos para mobile
	const textosMobile: Record<EstadoKey, string> = {
		sin_verificacion: 'Sin verificar',
		verificacion_pendiente: 'Pendiente',
		verificacion_rechazada: 'Rechazada',
		verificado_email_institucional: 'Email',
		verificado_documental: 'Documental',
		verificado_renaper: 'RENAPER'
	};
</script>

{#if href}
	<a
		href={href}
		class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium {config.color} transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
		title={`${labelMostrado} - Ir a gestión`}
		aria-label={`${labelMostrado}. Ir a gestionar verificación`}
	>
		<Icon src={config.icon} class="h-4 w-4" />
		<span class="hidden sm:inline">{labelMostrado}</span>
		<span class="sm:hidden">{textoAccion ?? textosMobile[estado]}</span>
	</a>
{:else}
	<span
		class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium {config.color}"
		title={labelMostrado}
	>
		<Icon src={config.icon} class="h-4 w-4" />
		<span class="hidden sm:inline">{labelMostrado}</span>
		<span class="sm:hidden">{textoAccion ?? textosMobile[estado]}</span>
	</span>
{/if}
