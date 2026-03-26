<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import {
		Clock,
		CheckCircle2,
		XCircle,
		Search,
		Calendar,
		Building2,
		ArrowRight,
		MapPin,
		Globe,
		ImageIcon,
		ChevronDown
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let data: PageData;

	let activeTab: 'pendiente' | 'aprobada' | 'rechazada' = 'pendiente';
	let searchTerm = '';

	$: filteredColaboraciones = data.colaboraciones.filter((c) => {
		const matchesTab = c.estado === activeTab;
		const matchesSearch =
			c.proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.proyecto.institucion.nombre_legal.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const tabs = [
		{
			id: 'pendiente',
			label: 'Pendientes',
			icon: Clock,
			activeClass: 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5',
			inactiveClass: 'text-gray-500 hover:text-amber-600 hover:bg-white/50'
		},
		{
			id: 'aprobada',
			label: 'Aprobadas',
			icon: CheckCircle2,
			activeClass: 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5',
			inactiveClass: 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
		},
		{
			id: 'rechazada',
			label: 'Rechazadas',
			icon: XCircle,
			activeClass: 'bg-white text-rose-600 shadow-sm ring-1 ring-black/5',
			inactiveClass: 'text-gray-500 hover:text-rose-600 hover:bg-white/50'
		}
	];

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('es-AR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="min-h-screen w-full bg-gray-50/50 pb-12">
	<!-- Sección de Encabezado (Centrada) -->
	<div class="bg-white px-4 pt-10 pb-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl text-center">
			<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
				Solicitudes de colaboración
			</h1>
			<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
				Gestioná tus postulaciones y revisá el estado de tus participaciones en proyectos.
			</p>

			<div class="mx-auto mt-8 max-w-xl">
				<div class="group relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-blue-500"
					>
						<Search class="h-5 w-5" />
					</div>
					<input
						type="text"
						bind:value={searchTerm}
						class="block w-full rounded-full border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-gray-900 placeholder-gray-400 shadow-sm transition-all hover:bg-white hover:shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500 sm:text-sm"
						placeholder="Buscar por proyecto o institución..."
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Menú Desplegable Mobile (< sm) -->
		<div class="mb-8 sm:hidden">
			<label for="tabs" class="sr-only">Seleccionar estado</label>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
				>
					<svelte:component
						this={tabs.find((t) => t.id === activeTab)?.icon}
						class="h-5 w-5 text-gray-400"
					/>
				</div>
				<select
					id="tabs"
					name="tabs"
					bind:value={activeTab}
					class="block w-full appearance-none rounded-2xl border-0 bg-white py-3 pr-10 pl-10 text-gray-900 shadow-sm ring-1 ring-gray-200 ring-inset focus:ring-2 focus:ring-blue-500 focus:ring-inset sm:text-sm sm:leading-6"
				>
					{#each tabs as tab}
						<option value={tab.id}>{tab.label}</option>
					{/each}
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
				>
					<ChevronDown class="h-5 w-5 text-gray-400" />
				</div>
			</div>
			<!-- Contador de solicitudes Mobile -->
			{#if data.colaboraciones}
				<div class="mt-2 flex justify-end px-1">
					<span class="text-xs font-medium text-gray-500">
						Mostrando {data.colaboraciones.filter((c) => c.estado === activeTab).length} solicitudes
					</span>
				</div>
			{/if}
		</div>

		<!-- Tabs de Escritorio (Pills) (>= sm) -->
		<div class="mb-10 hidden justify-center sm:flex">
			<div class="inline-flex rounded-full bg-gray-100/80 p-1.5 shadow-inner backdrop-blur-sm">
				{#each tabs as tab}
					<button
						class="relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none
                        {activeTab === tab.id ? tab.activeClass : tab.inactiveClass}"
						on:click={() => (activeTab = tab.id as any)}
					>
						<svelte:component this={tab.icon} class="h-4 w-4" />
						{tab.label}
						{#if data.colaboraciones}
							<span
								class="ml-1.5 rounded-full px-2 py-0.5 text-xs font-bold
                                {activeTab === tab.id
									? 'bg-gray-100 mix-blend-multiply'
									: 'bg-gray-200 text-gray-600'}"
							>
								{data.colaboraciones.filter((c) => c.estado === tab.id).length}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		{#if filteredColaboraciones.length > 0}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
				{#each filteredColaboraciones as colab, i (colab.id_colaboracion)}
					<div
						in:fly={{ y: 20, duration: 400, delay: i * 50 }}
						class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500/20"
					>
						<div class="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
							<img
								src={colab.proyecto.url_portada}
								alt={colab.proyecto.titulo}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60"
							></div>

							<!-- Etiqueta de Estado (Arriba a la izquierda) -->
							<div class="absolute top-3 left-3">
								{#if colab.estado === 'pendiente'}
									<span
										class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
									>
										<Clock class="h-3 w-3" />
										Pendiente
									</span>
								{:else if colab.estado === 'aprobada'}
									<span
										class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
									>
										<CheckCircle2 class="h-3 w-3" />
										Aprobada
									</span>
								{:else}
									<span
										class="inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
									>
										<XCircle class="h-3 w-3" />
										Rechazada
									</span>
								{/if}
							</div>

							<!-- Etiqueta de Fecha (Abajo a la derecha) -->
							<div class="absolute right-3 bottom-3">
								<span
									class="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md"
								>
									<Calendar class="mr-1.5 h-3 w-3" />
									{formatDate(colab.created_at)}
								</span>
							</div>
						</div>

						<div class="flex flex-1 flex-col p-5">
							<div class="flex-1">
								<h3
									class="mt-1 line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600"
									title={colab.proyecto.titulo}
								>
									{colab.proyecto.titulo}
								</h3>
								<div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
									<div
										class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400"
									>
										<Building2 class="h-3.5 w-3.5" />
									</div>
									<span class="line-clamp-1 font-medium text-gray-700">
										{colab.proyecto.institucion.nombre_legal}
									</span>
								</div>

								{#if colab.mensaje}
									<div
										class="relative mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 italic"
									>
										<span class="absolute top-2 left-2 font-serif text-2xl text-gray-300">"</span>
										<p class="relative z-10 line-clamp-2 px-1">{colab.mensaje}</p>
									</div>
								{:else if colab.justificacion}
									<div
										class="relative mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 italic"
									>
										<p class="relative z-10 line-clamp-2 font-medium">
											Motivo: {colab.justificacion}
										</p>
									</div>
								{/if}
							</div>

							<div class="mt-6 border-t border-gray-100 pt-4">
								<Button
									label="Ver proyecto"
									href="/proyectos/{colab.proyecto.id}"
									size="sm"
									customClass="w-full"
								>
									<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div
				in:fade={{ duration: 300 }}
				class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center"
			>
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<Search class="h-8 w-8 text-gray-400" />
				</div>
				<h3 class="mt-4 text-lg font-semibold text-gray-900">No hay solicitudes</h3>
				<p class="mt-2 max-w-sm text-gray-500">
					No se encontraron colaboraciones en estado <span class="font-medium text-gray-900"
						>{activeTab}</span
					>
					{searchTerm ? 'que coincidan con tu búsqueda.' : '.'}
				</p>
				{#if activeTab !== 'pendiente' || searchTerm}
					<button
						class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
						on:click={() => {
							searchTerm = '';
							activeTab = 'pendiente';
						}}
					>
						<XCircle class="h-4 w-4" />
						Limpiar filtros
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
