<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { Usuario, Administrador, Institucion, Colaborador } from '$lib/types/Usuario';

	const usuariosArray = Object.values(mockUsuarios as MockUsuarios) as Usuario[];

	let usuarioDetalle: Usuario | undefined;
	let editandoRol = false;
	let editandoEstado = false;

	$: {
		const id = Number($page.params.id);
		usuarioDetalle = usuariosArray.find((u) => u.id_usuario === id);
	}

	function cambiarRol(nuevoRol: Usuario['rol']) {
		if (!usuarioDetalle) return;
		usuarioDetalle = { ...usuarioDetalle, rol: nuevoRol };
		editandoRol = false;
		// TODO: Aquí se haría la llamada al backend para actualizar
	}

	function cambiarEstado(nuevoEstado: string) {
		if (!usuarioDetalle) return;
		usuarioDetalle = { ...usuarioDetalle, estado: nuevoEstado };
		editandoEstado = false;
		// TODO: Aquí se haría la llamada al backend para actualizar
	}

	function formatearFecha(fecha?: Date): string {
		if (!fecha) return 'No especificada';
		return new Date(fecha).toLocaleDateString('es-AR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function calcularEdad(fechaNacimiento?: Date): string {
		if (!fechaNacimiento) return 'No especificada';
		const hoy = new Date();
		const nacimiento = new Date(fechaNacimiento);
		let edad = hoy.getFullYear() - nacimiento.getFullYear();
		const mes = hoy.getMonth() - nacimiento.getMonth();
		if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
			edad--;
		}
		return `${edad} años`;
	}

	// Mock de historial de actividades (en producción vendría del backend)
	const historialActividades = [
		{
			fecha: new Date(),
			accion: 'Usuario creado',
			detalle: 'Cuenta registrada en la plataforma',
			usuario: 'Sistema'
		},
		{
			fecha: new Date(Date.now() - 86400000),
			accion: 'Actualización de perfil',
			detalle: 'Se actualizó la información de contacto',
			usuario: usuarioDetalle?.username || 'Usuario'
		},
		{
			fecha: new Date(Date.now() - 172800000),
			accion: 'Inicio de sesión',
			detalle: 'Acceso exitoso desde dispositivo móvil',
			usuario: usuarioDetalle?.username || 'Usuario'
		}
	];
</script>

<svelte:head>
	<title>Detalle de usuario - Panel admin</title>
</svelte:head>

{#if !usuarioDetalle}
	<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
		<p class="text-sm font-medium text-red-800">Usuario no encontrado</p>
		<Button
			label="Volver a usuarios"
			variant="secondary"
			size="sm"
			type="button"
			on:click={() => goto('/admin/usuarios')}
		/>
	</div>
{:else}
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				{#if usuarioDetalle.url_foto}
					<img
						src={usuarioDetalle.url_foto}
						alt="{usuarioDetalle.nombre} {usuarioDetalle.apellido}"
						class="h-16 w-16 rounded-full object-cover"
					/>
				{:else}
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-600">
						{usuarioDetalle.nombre.charAt(0)}{usuarioDetalle.apellido.charAt(0)}
					</div>
				{/if}
				<div>
					<Badge text={usuarioDetalle.rol} />
					<h1 class="mt-2 text-2xl font-bold text-gray-900">
						{usuarioDetalle.nombre} {usuarioDetalle.apellido}
					</h1>
					<p class="mt-1 text-sm text-gray-600">@{usuarioDetalle.username}</p>
				</div>
			</div>
			<div class="flex gap-2">
				<Button
					label="Editar usuario"
					variant="primary"
					size="sm"
					type="button"
					on:click={() => goto(`/admin/usuarios/${usuarioDetalle?.id_usuario}/editar`)}
				/>
				<Button
					label="Volver"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => history.back()}
				/>
			</div>
		</div>

		<!-- Información principal -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Información básica -->
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Información básica</h2>
				<dl class="space-y-4 text-sm">
					<div>
						<dt class="font-medium text-gray-500">Estado</dt>
						<dd class="mt-1">
							{#if editandoEstado}
								<select
									class="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									bind:value={usuarioDetalle.estado}
									on:change={(e) => cambiarEstado((e.currentTarget as HTMLSelectElement).value)}
								>
									<option value="activo">Activo</option>
									<option value="inactivo">Inactivo</option>
									<option value="pendiente">Pendiente</option>
									<option value="suspendido">Suspendido</option>
								</select>
							{:else}
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
										usuarioDetalle.estado === 'activo'
											? 'bg-emerald-50 text-emerald-700'
											: usuarioDetalle.estado === 'pendiente'
												? 'bg-yellow-50 text-yellow-700'
												: usuarioDetalle.estado === 'suspendido'
													? 'bg-red-50 text-red-700'
													: 'bg-gray-100 text-gray-600'
									}`}
								>
									{usuarioDetalle.estado}
								</span>
								<button
									type="button"
									class="ml-2 text-xs text-blue-600 hover:underline"
									on:click={() => (editandoEstado = true)}
								>
									Editar
								</button>
							{/if}
						</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Rol</dt>
						<dd class="mt-1">
							{#if editandoRol}
								<select
									class="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									bind:value={usuarioDetalle.rol}
									on:change={(e) =>
										cambiarRol((e.currentTarget as HTMLSelectElement).value as Usuario['rol'])}
								>
									<option value="administrador">Administrador</option>
									<option value="institucion">Institución</option>
									<option value="colaborador">Colaborador</option>
								</select>
							{:else}
								<span class="text-gray-900">{usuarioDetalle.rol}</span>
								<button
									type="button"
									class="ml-2 text-xs text-blue-600 hover:underline"
									on:click={() => (editandoRol = true)}
								>
									Editar
								</button>
							{/if}
						</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Fecha de nacimiento</dt>
						<dd class="mt-1 text-gray-900">
							{formatearFecha(usuarioDetalle.fecha_nacimiento)} ({calcularEdad(usuarioDetalle.fecha_nacimiento)})
						</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Fecha de registro</dt>
						<dd class="mt-1 text-gray-900">{formatearFecha(usuarioDetalle.created_at)}</dd>
					</div>

					{#if (usuarioDetalle as Institucion).nombre_legal}
						<div>
							<dt class="font-medium text-gray-500">Nombre legal</dt>
							<dd class="mt-1 text-gray-900">{(usuarioDetalle as Institucion).nombre_legal}</dd>
						</div>
						<div>
							<dt class="font-medium text-gray-500">Tipo de institución</dt>
							<dd class="mt-1 text-gray-900">{(usuarioDetalle as Institucion).tipo_institucion}</dd>
						</div>
					{/if}

					{#if (usuarioDetalle as Colaborador).tipo_colaborador}
						<div>
							<dt class="font-medium text-gray-500">Tipo de colaborador</dt>
							<dd class="mt-1 text-gray-900">{(usuarioDetalle as Colaborador).tipo_colaborador}</dd>
						</div>
					{/if}
				</dl>
			</section>

			<!-- Contacto y ubicación -->
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Contacto y ubicación</h2>

				{#if usuarioDetalle.contactos && usuarioDetalle.contactos.length > 0}
					<div class="mb-6">
						<dt class="mb-2 font-medium text-gray-500">Contactos</dt>
						<dd class="space-y-2">
							{#each usuarioDetalle.contactos as contacto}
								<div class="flex items-center gap-2 text-sm">
									<span
										class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700"
									>
										{contacto.tipo_contacto}
									</span>
									<span class="text-gray-900">{contacto.valor}</span>
									{#if contacto.etiqueta}
										<span class="text-xs text-gray-500">({contacto.etiqueta})</span>
									{/if}
								</div>
							{/each}
						</dd>
					</div>
				{/if}

				{#if usuarioDetalle.direccion}
					<div>
						<dt class="mb-2 font-medium text-gray-500">Dirección</dt>
						<dd class="text-sm text-gray-900">
							<div>
								{usuarioDetalle.direccion.calle} {usuarioDetalle.direccion.numero}
								{#if usuarioDetalle.direccion.piso}
									, Piso {usuarioDetalle.direccion.piso}
								{/if}
								{#if usuarioDetalle.direccion.departamento}
									, Depto. {usuarioDetalle.direccion.departamento}
								{/if}
							</div>
							{#if usuarioDetalle.direccion.localidad}
								<div class="mt-1 text-gray-600">
									{usuarioDetalle.direccion.localidad.nombre}
									{#if usuarioDetalle.direccion.localidad.provincia}
										, {usuarioDetalle.direccion.localidad.provincia}
									{/if}
								</div>
							{/if}
							{#if usuarioDetalle.direccion.referencia}
								<div class="mt-1 text-xs text-gray-500">{usuarioDetalle.direccion.referencia}</div>
							{/if}
						</dd>
					</div>
				{:else}
					<p class="text-sm text-gray-500">No hay dirección registrada</p>
				{/if}
			</section>
		</div>

		<!-- Consentimientos -->
		{#if usuarioDetalle.consentimientos && usuarioDetalle.consentimientos.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Consentimientos</h2>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each usuarioDetalle.consentimientos as consentimiento}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-gray-900">{consentimiento.tipo}</span>
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700"
								>
									Aceptado
								</span>
							</div>
							<p class="mt-1 text-xs text-gray-600">Versión {consentimiento.version}</p>
							<p class="mt-1 text-xs text-gray-500">
								{formatearFecha(consentimiento.created_at)}
							</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Historial de actividades -->
		<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Historial de actividades</h2>
			<div class="space-y-4">
				{#each historialActividades as actividad}
					<div class="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
						<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
							{actividad.accion.charAt(0)}
						</div>
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-gray-900">{actividad.accion}</p>
								<p class="text-xs text-gray-500">{formatearFecha(actividad.fecha)}</p>
							</div>
							<p class="mt-1 text-xs text-gray-600">{actividad.detalle}</p>
							<p class="mt-1 text-xs text-gray-500">Por: {actividad.usuario}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Acciones administrativas -->
		<section class="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-red-900">Acciones administrativas</h2>
			<div class="flex flex-wrap gap-3">
				<Button
					label={usuarioDetalle.estado === 'activo' ? 'Suspender usuario' : 'Activar usuario'}
					variant="secondary"
					size="sm"
					type="button"
					on:click={() =>
						cambiarEstado(usuarioDetalle?.estado === 'activo' ? 'suspendido' : 'activo')}
				/>
				<Button
					label="Restablecer contraseña"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => alert('Funcionalidad pendiente: restablecer contraseña')}
				/>
				<Button
					label="Eliminar usuario"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => {
						if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
							alert('Funcionalidad pendiente: eliminar usuario');
						}
					}}
				/>
			</div>
		</section>
	</div>
{/if}
