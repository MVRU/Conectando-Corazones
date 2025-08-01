<script lang="ts">
	import { onMount } from 'svelte';
	import { authActions, user as userStore } from '$lib/stores/auth';
	import type { User, InstitucionUser, ColaboradorUser } from '$lib/types/User.ts';
	import Loader from '$lib/components/feedback/Loader.svelte';

	let user: User | null = null;
	let institucionUser: InstitucionUser | null = null;
	let colaboradorUser: ColaboradorUser | null = null;

	onMount(async () => {
		await authActions.login('escuela@esperanza.edu.ar', '123456');
	});

	$: if ($userStore) {
		user = $userStore;

		if (user?.role === 'institucion') {
			institucionUser = user as InstitucionUser;
		} else if (user?.role === 'colaborador') {
			colaboradorUser = user as ColaboradorUser;
		}
	}
</script>

<div class="mx-auto max-w-6xl px-4 py-10">
	{#if !user}
		<Loader loading />
	{:else}
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
			<!-- ENCABEZADO -->
			<div class="relative bg-gradient-to-br from-slate-50 to-white p-8 md:p-12">
				<div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
					<div class="flex flex-col items-center gap-6 md:flex-row md:items-center">
						<div class="relative h-24 w-24">
							<img
								src={user.profile ?? '/users/escuela-esperanza.jpg'}
								alt="Foto de perfil"
								class="h-full w-full rounded-full border-2 border-slate-200 object-cover shadow-sm"
							/>
							<span
								class="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white
		{user.verificationStatus === 'verificado'
									? 'bg-green-500'
									: user.verificationStatus === 'pendiente'
										? 'bg-yellow-400'
										: 'bg-red-500'}"
							></span>
						</div>

						<div class="text-center md:text-left">
							<h1 class="text-3xl font-bold tracking-tight text-slate-800">{user.nombre}</h1>
							<p class="mt-1 text-sm text-gray-500">{user.email}</p>
							<span
								class="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 shadow-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3.5 w-3.5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
								{user.verificationStatus}
							</span>
						</div>
					</div>
				</div>

				<!-- Separador suave -->
				<div
					class="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-slate-100 to-transparent"
				></div>
			</div>

			<!-- DATOS -->
			<div class="relative z-10 grid grid-cols-1 gap-6 bg-slate-50/50 px-8 py-14 md:grid-cols-12">
				<!-- COLUMNA 1 -->
				<div class="space-y-4 text-slate-800 md:col-span-6">
					<p class="text-sm text-gray-500">Teléfono</p>
					<p class="font-medium">{user.telefono}</p>

					{#if institucionUser}
						<p class="mt-6 text-sm text-gray-500">Razón social</p>
						<p class="font-medium">{institucionUser.razonSocial}</p>

						<p class="text-sm text-gray-500">CUIT</p>
						<p class="font-medium">{institucionUser.cuit ?? 'No especificado'}</p>

						<p class="text-sm text-gray-500">Tipo de institución</p>
						<p class="font-medium capitalize">{institucionUser.tipoInstitucion}</p>

						<p class="text-sm text-gray-500">Capacidad beneficiarios</p>
						<p class="font-medium">{institucionUser.capacidadBeneficiarios}</p>

						<p class="text-sm text-gray-500">Sitio web</p>
						<a
							href={'https://' + institucionUser.sitioWeb}
							class="text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{institucionUser.sitioWeb ?? 'No disponible'}
						</a>
					{/if}
				</div>

				<!-- COLUMNA 2 -->
				<div class="space-y-4 text-slate-800 md:col-span-6">
					{#if institucionUser}
						<p class="text-sm text-gray-500">Dirección</p>
						<p class="font-medium">
							{institucionUser.direccion.calle}
							{institucionUser.direccion.numero}, {institucionUser.direccion.ciudad}, {institucionUser
								.direccion.provincia} ({institucionUser.direccion.codigoPostal})
						</p>
					{/if}

					{#if colaboradorUser}
						<p class="text-sm text-gray-500">Tipo de colaborador</p>
						<p class="font-medium capitalize">{colaboradorUser.tipoColaborador}</p>

						{#if colaboradorUser.tipoColaborador === 'empresa'}
							<div class="space-y-1">
								<p class="text-sm text-gray-500">Empresa</p>
								<p class="font-medium">{colaboradorUser.empresa?.razonSocial}</p>
								<p>
									{colaboradorUser.empresa?.rubro} · {colaboradorUser.empresa?.empleados} empleados
								</p>
							</div>
						{:else if colaboradorUser.tipoColaborador === 'persona'}
							<p class="text-sm text-gray-500">DNI / Nacimiento</p>
							<p class="font-medium">
								{colaboradorUser.persona?.dni} / {colaboradorUser.persona?.fechaNacimiento.toLocaleDateString()}
							</p>
							<p>Género: {colaboradorUser.persona?.genero}</p>
						{:else if colaboradorUser.tipoColaborador === 'ong'}
							<p class="text-sm text-gray-500">ONG</p>
							<p class="font-medium">{colaboradorUser.ong?.razonSocial}</p>
							<p>{colaboradorUser.ong?.mision}</p>
							<p>Fundada en {colaboradorUser.ong?.añoFundacion}</p>
						{/if}

						{#if colaboradorUser.direccion}
							<p class="mt-4 text-sm text-gray-500">Dirección</p>
							<p class="font-medium">
								{colaboradorUser.direccion.calle}
								{colaboradorUser.direccion.numero}, {colaboradorUser.direccion.ciudad}, {colaboradorUser
									.direccion.provincia} ({colaboradorUser.direccion.codigoPostal})
							</p>
						{/if}

						<p class="mt-6 text-sm text-gray-500">Preferencias</p>
						<p>
							Categorías: <span class="font-medium"
								>{colaboradorUser.preferencias.categorias.join(', ')}</span
							>
						</p>
						<p>
							Provincias: <span class="font-medium"
								>{colaboradorUser.preferencias.provincias.join(', ')}</span
							>
						</p>
						<p>
							Notificaciones: <span class="font-medium"
								>{colaboradorUser.preferencias.notificaciones ? 'Sí' : 'No'}</span
							>
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
