<!--
* Página: Contacto
	-*- Descripción: Información de contacto del equipo y formulario para consultas
	-*- Funcionalidad: Datos del equipo, formulario de contacto y información institucional

TODO:
	- [ ] Conectar formulario con backend
	- [ ] Agregar validación de campos
	- [ ] Implementar envío de emails
	- [ ] Agregar reCAPTCHA para seguridad
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	let formularioEnviado = false;
	let enviandoFormulario = false;
	let validationErrors: string[] = [];

	// Establecer breadcrumbs al montar la página
	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Contacto' }]);
	});

	// Información del equipo
	const equipoCreadores = [
		{
			nombre: 'Tomás García',
			rol: 'Desarrollador Principal & Founder',
			especialidad: 'Full Stack Developer',
			email: 'tomas.garcia@conectandocorazones.org',
			descripcion:
				'Estudiante de Ingeniería en Sistemas de Información en UTN FRRo. Especializado en desarrollo web moderno y tecnologías de la información.'
		},
		{
			nombre: 'Equipo de Desarrollo',
			rol: 'Colaboradores Técnicos',
			especialidad: 'Desarrollo & Diseño',
			email: 'dev@conectandocorazones.org',
			descripcion:
				'Grupo de estudiantes y profesionales comprometidos con el desarrollo de soluciones tecnológicas para el bien social.'
		}
	];

	// Función para enviar formulario
	async function enviarFormulario(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const datos = {
			nombre: (formData.get('nombre') || '').toString().trim(),
			email: (formData.get('email') || '').toString().trim(),
			asunto: (formData.get('asunto') || '').toString().trim(),
			mensaje: (formData.get('mensaje') || '').toString().trim()
		};

		// Validar campos
		validationErrors = [];
		if (!datos.nombre) validationErrors.push('El nombre es requerido');
		if (!datos.email) validationErrors.push('El email es requerido');
		if (!datos.asunto) validationErrors.push('El asunto es requerido');
		if (!datos.mensaje) validationErrors.push('El mensaje es requerido');

		if (validationErrors.length > 0) {
			return;
		}

		enviandoFormulario = true;

		// TODO: Enviar datos al backend
		console.log('Datos del formulario:', datos);
		setTimeout(() => {
			enviandoFormulario = false;
			formularioEnviado = true;

			// Resetear después de 5 segundos
			setTimeout(() => {
				formularioEnviado = false;
			}, 5000);
		}, 2000);
	}
</script>

<svelte:head>
	<title>Contacto - Conectando Corazones</title>
	<meta
		name="description"
		content="Contacta con el equipo de Conectando Corazones. Información sobre los creadores y administradores del sistema."
	/>
</svelte:head>

<main class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-8">
		<!-- Header de la página -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-[rgb(var(--base-color))]">Contacto</h1>
			<p class="mx-auto max-w-3xl text-lg text-gray-600">
				Conocé al equipo detrás de Conectando Corazones y ponte en contacto con nosotros para
				consultas, sugerencias o colaboraciones.
			</p>
		</div>

		<div class="grid gap-12 lg:grid-cols-2">
			<!-- Sección del equipo -->
			<div class="space-y-8">
				<div class="rounded-2xl bg-white p-8 shadow-lg">
					<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
						🚀 Nuestro Equipo
					</h2>

					<div class="space-y-6">
						{#each equipoCreadores as miembro}
							<div
								class="rounded-r-lg border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-6"
							>
								<div class="mb-3 flex items-start justify-between">
									<div>
										<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">
											{miembro.nombre}
										</h3>
										<p class="font-medium text-[rgb(var(--color-primary))]">
											{miembro.rol}
										</p>
										<p class="text-sm text-gray-600">
											{miembro.especialidad}
										</p>
									</div>
								</div>

								<p class="mb-4 text-gray-700">
									{miembro.descripcion}
								</p>

								<div class="flex flex-wrap gap-4 text-sm">
									<a
										href="mailto:{miembro.email}"
										class="flex items-center gap-2 text-[rgb(var(--color-primary))] hover:underline"
									>
										📧 {miembro.email}
									</a>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Información institucional -->
				<div class="rounded-2xl bg-white p-8 shadow-lg">
					<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
						🎓 Información Académica
					</h2>

					<div class="space-y-4">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Institución</h4>
								<p class="text-gray-700">Universidad Tecnológica Nacional</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Facultad</h4>
								<p class="text-gray-700">Facultad Regional Rosario (UTN FRRo)</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Carrera</h4>
								<p class="text-gray-700">Ingeniería en Sistemas de Información</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Año</h4>
								<p class="text-gray-700">2024</p>
							</div>
						</div>

						<div class="mt-6 rounded-lg bg-gray-50 p-4">
							<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Acerca del Proyecto</h4>
							<p class="text-gray-700">
								Conectando Corazones es desarrollado como Proyecto Final de Carrera de Ingeniería en
								Sistemas de Información. El objetivo es crear una plataforma tecnológica que
								facilite la conexión entre donantes y organizaciones benéficas, promoviendo la
								transparencia y trazabilidad en cada proyecto social.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Formulario de contacto -->
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
					📩 Envianos un Mensaje
				</h2>

				{#if validationErrors.length > 0}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
						<p class="mb-2 font-medium text-red-700">Por favor corrige los siguientes errores:</p>
						<ul class="list-inside list-disc text-sm text-red-600">
							{#each validationErrors as error}
								<li>{error}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if formularioEnviado}
					<div class="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
						<p class="font-medium text-green-700">
							✅ ¡Mensaje enviado correctamente! Te responderemos a la brevedad.
						</p>
					</div>
				{:else}
					<form on:submit={enviarFormulario} class="space-y-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label
									for="nombre"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Nombre completo *
								</label>
								<input
									id="nombre"
									name="nombre"
									type="text"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="Tu nombre completo"
								/>
							</div>

							<div>
								<label
									for="email"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Email *
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="tu.email@ejemplo.com"
								/>
							</div>
						</div>

						<div>
							<label
								for="asunto"
								class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
							>
								Asunto *
							</label>
							<select
								id="asunto"
								name="asunto"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
							>
								<option value="">Seleccionar asunto</option>
								<option value="consulta-general">Consulta general</option>
								<option value="soporte-tecnico">Soporte técnico</option>
								<option value="colaboracion">Propuesta de colaboración</option>
								<option value="institucion">Soy una institución</option>
								<option value="feedback">Feedback del sistema</option>
								<option value="otro">Otro</option>
							</select>
						</div>

						<div>
							<label
								for="mensaje"
								class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
							>
								Mensaje *
							</label>
							<textarea
								id="mensaje"
								name="mensaje"
								required
								rows="6"
								class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
								placeholder="Escribí tu mensaje aquí..."
							></textarea>
						</div>

						<button
							type="submit"
							disabled={enviandoFormulario}
							class="w-full rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if enviandoFormulario}
								Enviando mensaje...
							{:else}
								Enviar mensaje
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Información adicional -->
		<div class="mt-12 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 text-center text-2xl font-semibold text-[rgb(var(--base-color))]">
				📍 Información de Contacto
			</h2>

			<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
				<div>
					<div class="mb-4 text-4xl">🏛️</div>
					<h3 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Institución</h3>
					<p class="text-gray-600">Universidad Tecnológica Nacional</p>
					<p class="text-gray-600">Facultad Regional Rosario</p>
					<p class="mt-2 text-sm text-gray-500">Zeballos 1341, Rosario, Santa Fe</p>
				</div>

				<div>
					<div class="mb-4 text-4xl">💻</div>
					<h3 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Soporte Técnico</h3>
					<p class="text-gray-600">Lun - Vie: 9:00 - 18:00</p>
					<p class="text-gray-600">soporte@conectandocorazones.org</p>
					<p class="mt-2 text-sm text-gray-500">Tiempo de respuesta: 24-48 hs</p>
				</div>

				<div>
					<div class="mb-4 text-4xl">🤝</div>
					<h3 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Colaboraciones</h3>
					<p class="text-gray-600">¿Querés ser parte del proyecto?</p>
					<p class="text-gray-600">colabora@conectandocorazones.org</p>
					<p class="mt-2 text-sm text-gray-500">Siempre buscamos nuevos talentos</p>
				</div>
			</div>
		</div>

		<!-- Call to action -->
		<div class="mt-12 text-center">
			<div class="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
				<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">
					¿Tenés una idea o sugerencia?
				</h2>
				<p class="mx-auto mb-6 max-w-2xl text-gray-600">
					Conectando Corazones está en constante evolución. Tu feedback es fundamental para mejorar
					la plataforma y crear un impacto positivo más grande en nuestra comunidad.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button label="Ver proyectos activos" href="/projects" disabled={false} />
				</div>
			</div>
		</div>
	</div>
</main>
