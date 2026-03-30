<script lang="ts">
	let {
		percent = 0,
		color = 'blue' as 'blue' | 'green' | 'purple'
	} = $props<{
		percent?: number;
		color?: 'blue' | 'green' | 'purple';
	}>();

	const track = 'bg-slate-100';

	let gradient = $derived(
		color === 'green'
			? 'from-emerald-300 via-emerald-400 to-emerald-500'
			: color === 'purple'
				? 'from-violet-300 via-violet-400 to-violet-500'
				: 'from-sky-300 via-sky-400 to-sky-500'
	);

	let show = $state(false);
	let root: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!root) return;

		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					show = true;
					obs.disconnect(); // dispara solo la primera vez que aparece en pantalla
				}
			},
			{ threshold: 0.25 }
		);
		obs.observe(root);

		return () => {
			obs.disconnect();
		};
	});
</script>

<div
	bind:this={root}
	class={`relative h-2.5 w-full overflow-hidden rounded-full ${track} shadow-inner`}
	role="progressbar"
	aria-valuenow={percent}
	aria-valuemin="0"
	aria-valuemax="100"
>
	<div
		class={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}
		        shadow-[0_0_6px_1px_rgba(56,189,248,0.35)]`}
		style={`width:${percent}%; transition:width 1.1s cubic-bezier(.4,0,.2,1) ${show ? '0s' : '.0s'};
		        width:${show ? percent + '%' : '0%'};`}
	></div>
</div>
