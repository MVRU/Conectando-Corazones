<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { isAuthenticated, isLoading } from '$lib/stores/auth';
	import VistaPerfil from '$lib/components/feature/perfil/VistaPerfil.svelte';
	import type { PageData } from './$types';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	let { data } = $props<{ data: PageData }>();

	const {
		perfilUsuario,
		proyectos,
		resenas,
		categorias,
		tiposParticipacion,
		esMiPerfil,
		proyectoContexto
	} = $derived.by(() => data);

	// Redirección si es mi perfil y no está autenticado
	$effect(() => {
		if (esMiPerfil && !$isLoading && !$isAuthenticated) {
			goto('/iniciar-sesion');
		}
	});

	// Breadcrumbs contextuales
	$effect(() => {
		const from = page.url.searchParams.get('from');
		const nombrePerfil = perfilUsuario
			? perfilUsuario.rol === 'institucion'
				? (perfilUsuario as { nombre_legal?: string; nombre: string }).nombre_legal || perfilUsuario.nombre
				: (perfilUsuario as { razon_social?: string; nombre: string; apellido: string }).razon_social || `${perfilUsuario.nombre} ${perfilUsuario.apellido}`
			: 'Perfil';

		if (from === 'solicitudes') {
			if (proyectoContexto) {
				setBreadcrumbs([
					BREADCRUMB_ROUTES.proyectos,
					{
						label: proyectoContexto.titulo,
						href: `/proyectos/${proyectoContexto.id_proyecto}`
					},
					{
						label: 'Solicitudes',
						href: `/institucion/solicitudes-colaboracion?proyecto=${proyectoContexto.id_proyecto}`
					},
					{ label: nombrePerfil }
				]);
			} else {
				setBreadcrumbs([
					{ label: 'Mi Panel', href: '/institucion/mi-panel' },
					{ label: 'Solicitudes', href: '/institucion/solicitudes-colaboracion' },
					{ label: nombrePerfil }
				]);
			}
		} else if (from === 'proyecto' && proyectoContexto) {
			setBreadcrumbs([
				BREADCRUMB_ROUTES.proyectos,
				{
					label: proyectoContexto.titulo,
					href: `/proyectos/${proyectoContexto.id_proyecto}`
				},
				{ label: nombrePerfil }
			]);
		} else {
			setBreadcrumbs([BREADCRUMB_ROUTES.personas, { label: nombrePerfil }]);
		}
	});
</script>

<svelte:head>
	<title>
		{perfilUsuario
			? perfilUsuario.rol === 'institucion'
				? (perfilUsuario as { nombre_legal?: string; nombre: string }).nombre_legal || perfilUsuario.nombre
				: `${perfilUsuario.nombre} ${perfilUsuario.apellido}`
			: 'Perfil'} - Conectando Corazones
	</title>
</svelte:head>

{#if perfilUsuario}
	<VistaPerfil
		{perfilUsuario}
		{esMiPerfil}
		{proyectos}
		{resenas}
		{categorias}
		{tiposParticipacion}
	/>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<h2 class="text-xl font-semibold text-gray-900">Cargando perfil...</h2>
		</div>
	</div>
{/if}
