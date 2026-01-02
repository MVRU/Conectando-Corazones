/**
 * Factory functions para crear datos de prueba consistentes
 * Facilita la creación de objetos de test con valores por defecto
 */

/**
 * Crea un usuario de prueba con valores por defecto
 * @param overrides Propiedades a sobrescribir
 */
export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
    return {
        username: 'testuser',
        email: 'test@example.com',
        nombre: 'Test',
        apellido: 'User',
        rol: 'colaborador',
        ...overrides
    };
}

/**
 * Crea una fecha de nacimiento para una edad específica
 * @param age Edad deseada en años
 * @returns Fecha de nacimiento que resulta en la edad especificada
 */
export function createBirthdateForAge(age: number): Date {
    const today = new Date();
    return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
}

/**
 * Crea una fecha que cumple años hoy
 * @param age Edad que cumple hoy
 */
export function createBirthdayToday(age: number): Date {
    const today = new Date();
    return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
}

/**
 * Crea credenciales de prueba válidas
 */
export function createValidCredentials(overrides: Partial<TestCredentials> = {}): TestCredentials {
    return {
        username: 'validuser123',
        email: 'valid@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!',
        ...overrides
    };
}

/**
 * Crea datos de institución de prueba
 */
export function createTestInstitution(overrides: Partial<TestInstitution> = {}): TestInstitution {
    return {
        nombreLegal: 'Fundación Test',
        tipoInstitucion: 'fundacion',
        conFinesDeLucro: false,
        ...overrides
    };
}

// Types
export interface TestUser {
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: 'colaborador' | 'institucion';
}

export interface TestCredentials {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface TestInstitution {
    nombreLegal: string;
    tipoInstitucion: string;
    conFinesDeLucro: boolean;
}
