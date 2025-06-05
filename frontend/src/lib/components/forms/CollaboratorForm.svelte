<!--
* Componente: CollaboratorForm
        -*- Descripción: formulario de registro para colaboradores (personas u organizaciones).
        -*- Permite indicar el tipo de colaborador y datos mínimos para creación de cuenta.
        -*- Mantiene validaciones básicas para ejemplo.
-->
<script lang="ts">
        import Button from '../ui/Button.svelte';
        let sending = false;
        let errors: string[] = [];
        let tipo: 'persona' | 'organizacion' = 'persona';

        function handleSubmit(event: Event) {
                event.preventDefault();
                const data = new FormData(event.target as HTMLFormElement);
                const colaborador = {
                        nombre: (data.get('nombre') || '').toString().trim(),
                        email: (data.get('email') || '').toString().trim(),
                        identificacion: (data.get('identificacion') || '').toString().trim(),
                        password: (data.get('password') || '').toString(),
                        repassword: (data.get('repassword') || '').toString(),
                        tipo
                };
                errors = [];
                if (!colaborador.nombre) errors.push('El nombre es obligatorio');
                if (!colaborador.email) errors.push('El email es obligatorio');
                if (!colaborador.identificacion) errors.push('El documento es obligatorio');
                if (colaborador.password !== colaborador.repassword) {
                        errors.push('Las contraseñas no coinciden');
                }
                if (errors.length > 0) return;
                sending = true;
                // Simulación de envío. TODO: conectar con backend
                setTimeout(() => {
                        sending = false;
                        console.log('Colaborador registrado', colaborador);
                }, 1000);
        }
</script>

<form on:submit={handleSubmit} class="space-y-4">
        <div>
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de colaborador *</label>
                <select id="tipo" bind:value={tipo} class="w-full rounded-md border border-gray-300 px-3 py-2">
                        <option value="persona">Persona</option>
                        <option value="organizacion">Organización / ONG</option>
                </select>
        </div>
        <div>
                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre completo o Razón social *</label>
                <input id="nombre" name="nombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email *</label>
                <input id="email" name="email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="identificacion" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">{tipo === 'persona' ? 'DNI' : 'CUIT'} *</label>
                <input id="identificacion" name="identificacion" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
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
