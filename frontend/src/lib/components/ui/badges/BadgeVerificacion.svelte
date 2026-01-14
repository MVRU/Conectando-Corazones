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

	export let estado: EstadoVerificacionDisplay;

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
	};

	$: config = badgeConfig[estado];
	
	// Textos cortos para mobile
	const textosMobile = {
		sin_verificacion: 'Sin verificar',
		verificacion_pendiente: 'Pendiente',
		verificado_email_institucional: 'Email',
		verificado_documental: 'Documental',
		verificado_renaper: 'RENAPER'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium {config.color}"
	title={config.label}
>
	<Icon src={config.icon} class="h-4 w-4" />
	<span class="hidden sm:inline">{config.label}</span>
	<span class="sm:hidden">{textosMobile[estado]}</span>
</span>