<!--
* Componente: InstitutionForm
        -*- Descripción: formulario de registro para instituciones que crean proyectos solidarios.
        -*- Funcionalidad: captura datos básicos para el alta inicial. Se deja preparado para conectar con backend.

? CUESTIONES ABIERTAS:
        -?- Falta integrar validaciones avanzadas y conexión real con API.
-->
<script lang="ts">
        import Button from '../ui/Button.svelte';
        let sending = false;
        let errors: string[] = [];

        function handleSubmit(event: Event) {
                event.preventDefault();
                const data = new FormData(event.target as HTMLFormElement);
                const institution = {
                        nombre: (data.get('nombre') || '').toString().trim(),
                        email: (data.get('email') || '').toString().trim(),
                        cuit: (data.get('cuit') || '').toString().trim(),
                        password: (data.get('password') || '').toString(),
                        repassword: (data.get('repassword') || '').toString()
                };
                errors = [];
                if (!institution.nombre) errors.push('El nombre es obligatorio');
                if (!institution.email) errors.push('El email es obligatorio');
                if (!institution.cuit) errors.push('El CUIT es obligatorio');
                if (institution.password !== institution.repassword) {
                        errors.push('Las contraseñas no coinciden');
                }
                if (errors.length > 0) return;
                sending = true;
                // Simulación de envío. TODO: conectar con backend
                setTimeout(() => {
                        sending = false;
                        console.log('Institución registrada', institution);
                }, 1000);
        }
</script>

<form on:submit={handleSubmit} class="space-y-4">
        <div>
                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de la institución *</label>
                <input id="nombre" name="nombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email *</label>
                <input id="email" name="email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT *</label>
                <input id="cuit" name="cuit" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
                <div>
                        <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña *</label>
                        <input id="password" name="password" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                        <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña *</label>
                        <input id="repassword" name="repassword" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
        </div>
        {#if errors.length > 0}
                <ul class="text-sm text-red-600">
                        {#each errors as err}
                                <li>{err}</li>
                        {/each}
                </ul>
        {/if}
        <Button label="Crear cuenta" disabled={sending} customClass="w-full" />
</form>
