# Tests

Estructura centralizada de tests para el proyecto Conectando Corazones.

## 📁 Estructura

```
tests/
├── unit/              # Tests unitarios (funciones puras, lógica de negocio)
│   ├── utils/         # Tests de utilidades (validaciones, helpers)
│   ├── stores/        # Tests de Svelte stores
│   └── actions/       # Tests de Svelte actions
├── integration/       # Tests de integración (flujos completos)
│   └── auth/          # Tests de flujos de autenticación
├── component/         # Tests de componentes Svelte
│   └── ui/            # Tests de componentes de UI
└── __helpers__/       # Utilidades compartidas para tests
    ├── test-utils.ts  # Helpers de testing (render, wait, etc.)
    └── factories.ts   # Factory functions para datos de prueba
```

## 🚀 Ejecutar tests

### Todos los tests
```bash
npm run test:unit
```

### Solo tests unitarios
```bash
npm run test:unit -- tests/unit
```

### Solo tests de componentes
```bash
npm run test:unit -- tests/component
```

### Solo tests de integración
```bash
npm run test:unit -- tests/integration
```

### Con coverage
```bash
npm run test:unit -- --coverage
```

### En modo watch (desarrollo)
```bash
npm run test:unit -- --watch
```

### Ejecutar un archivo específico
```bash
npm run test:unit -- tests/unit/utils/validaciones.test.ts
```

## 📝 Convenciones

### Naming
- **Archivos de test**: `*.test.ts` (consistente para todos los tipos)
- **Helpers**: sin sufijo `.test` (ej: `test-utils.ts`, `factories.ts`)
- **Nombres descriptivos**: `validaciones.test.ts`, `Image.test.ts`

### Organización
- **Unit tests**: funciones puras, lógica de negocio sin dependencias externas
- **Integration tests**: flujos completos que involucran múltiples módulos
- **Component tests**: tests de componentes Svelte con interacción de usuario

### Imports
- **Código fuente**: usar alias `$lib` para imports absolutos
  ```typescript
  import { validarUsername } from '$lib/utils/validaciones';
  ```
- **Helpers de test**: usar alias `@tests` o path relativo
  ```typescript
  import { createTestUser } from '@tests/__helpers__/factories';
  ```

### Estructura de tests
```typescript
import { describe, it, expect } from 'vitest';

describe('NombreDelModulo', () => {
    describe('Funcionalidad específica', () => {
        it('debe hacer algo específico', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = funcionATestear(input);
            
            // Assert
            expect(result).toBe('expected');
        });
    });
});
```

## 🛠️ Helpers disponibles

### test-utils.ts
- `renderComponent()` - wrapper para render de Svelte Testing Library
- `flushPromises()` - esperar resolución de promesas
- `wait(ms)` - esperar tiempo específico
- Re-exports de `@testing-library/svelte`: `screen`, `fireEvent`, `waitFor`

### factories.ts
- `createTestUser()` - crear usuario de prueba
- `createBirthdateForAge(age)` - crear fecha de nacimiento para edad específica
- `createBirthdayToday(age)` - crear fecha que cumple años hoy
- `createValidCredentials()` - crear credenciales válidas
- `createTestInstitution()` - crear datos de institución

## 📊 Coverage

El coverage se genera en la carpeta `coverage/` después de ejecutar:
```bash
npm run test:unit -- --coverage
```

Puedes ver el reporte HTML en `coverage/index.html`

## 💡 Best practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Nombres descriptivos**: los tests deben leerse como documentación
3. **Un concepto por test**: cada test debe verificar una sola cosa
4. **Usar factories**: para datos de prueba consistentes
5. **Evitar lógica compleja**: los tests deben ser simples y directos
6. **Tests independientes**: cada test debe poder ejecutarse solo

## 🔍 Debugging

Para debuggear un test específico:
```bash
npm run test:unit -- --reporter=verbose tests/unit/utils/validaciones.test.ts
```

Para ver output detallado:
```bash
npm run test:unit -- --reporter=verbose
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)