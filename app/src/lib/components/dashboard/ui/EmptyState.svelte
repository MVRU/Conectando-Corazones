<script lang="ts">
	import { HeartOff } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		message?: string;
		description?: string;
		icon?: any;
	}

	let { 
		message = "No hay datos disponibles", 
		description = "Aún no se ha registrado información en esta sección.",
		icon: Icon = HeartOff 
	}: Props = $props();
</script>

<div 
	class="flex flex-col items-center justify-center py-12 px-6 text-center"
	in:fly={{ y: 10, duration: 400 }}
>
	<div class="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 text-slate-500 shadow-inner">
		<Icon size={48} strokeWidth={1.5} />
	</div>
	
	<h3 class="mb-2 text-lg font-semibold text-slate-200">
		{message}
	</h3>
	
	<p class="max-w-xs text-sm leading-relaxed text-slate-400">
		{description}
	</p>
</div>
