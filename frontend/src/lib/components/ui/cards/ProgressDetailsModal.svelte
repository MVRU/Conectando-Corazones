<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let tipo: 'estimado' | 'recaudado' = 'estimado';
	export let open: boolean = false;

	const dispatch = createEventDispatcher();
	let modalElement: HTMLDivElement;

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			dispatch('close');
		}
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (modalElement && e.target === modalElement) {
			dispatch('close');
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

{#if open}
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6"
		role="dialog"
		aria-modal="true"
		tabindex="0"
		on:click={handleClickOutside}
		on:keydown={handleKeyDown}
	>
		<div
			class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200 sm:max-w-xl sm:p-8"
		>
			<!-- Botón cerrar -->
			<button
				class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				on:click={() => dispatch('close')}
				aria-label="Cerrar modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<!-- Contenido -->
			{#if tipo === 'estimado'}
				<div class="space-y-5">
					<h3 class="flex items-center gap-2 text-xl font-semibold text-emerald-600">
						¿Qué es un compromiso de ayuda?
					</h3>
					<p class="text-sm leading-relaxed text-gray-700">
						Un <strong>compromiso de ayuda</strong> es una promesa voluntaria de colaborar con un proyecto
						solidario. Representa intenciones (aún no concretadas) de donar materiales, dinero o tiempo
						por parte de una persona u organización.
					</p>
					<div
						class="rounded-md border-l-4 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-gray-600"
					>
						<p class="font-bold">Ejemplos:</p>
						<ul class="mt-1 list-inside list-disc space-y-1">
							<li>Un usuario promete donar 10 cuadernos la semana próxima.</li>
							<li>Una empresa se compromete a enviar alimentos no perecederos.</li>
							<li>Un voluntario ofrece su tiempo para un evento futuro.</li>
						</ul>
					</div>
					<p class="text-sm text-gray-500">
						💡 Estos compromisos son valiosos, pero aún no pueden usarse hasta que se hagan
						efectivos.
					</p>
				</div>
			{:else}
				<div class="space-y-5">
					<h3 class="flex items-center gap-2 text-xl font-semibold text-blue-600">
						¿Qué es una colaboración efectiva recibida?
					</h3>
					<p class="text-sm leading-relaxed text-gray-700">
						Una <strong>colaboración efectiva</strong> es una donación o ayuda ya entregada y validada
						por la institución. Representa recursos reales y disponibles que impactan directamente en
						el proyecto.
					</p>
					<div
						class="rounded-md border-l-4 border-blue-300 bg-blue-50 px-4 py-3 text-sm text-gray-600"
					>
						<p class="font-bold">Ejemplos:</p>
						<ul class="mt-1 list-inside list-disc space-y-1">
							<li>Se recibieron 5 colchones donados por una empresa.</li>
							<li>Una persona transfirió $10.000 como aporte al proyecto.</li>
							<li>Un voluntario ya participó en una jornada comunitaria.</li>
						</ul>
					</div>
					<p class="text-sm text-gray-500">
						✅ Estas colaboraciones ya están disponibles y fortalecen el avance del proyecto.
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
