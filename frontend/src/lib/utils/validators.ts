import { provinces } from "$lib/data/provinces";
import { getProvinceByCity } from '$lib/utils/helpers';

/**
 * ! Mensajes de error comunes para validaciones
 */

export const ERROR_MESSAGES = {
    required: 'Este campo es obligatorio',
    emailInvalid: 'Por favor, ingresá un correo electrónico válido',
    passwordRequirements:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
    usernameInvalid:
        'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos, guiones bajos o guiones',
    cuitInvalid: 'El CUIT es inválido',
    cuilInvalid: 'El CUIL es inválido',
    passwordMismatch: 'Las contraseñas no coinciden',
    ageRequirement: 'Debés tener al menos 18 años',
    documentTypeRequired: 'Por favor, especificá el tipo de documento',
    specifyInstitutionType: 'Debe especificar el tipo de institución',
    specifyDocument: 'Debe especificar el documento',
    nameInvalid: 'Nombre inválido. Solo se permiten letras y espacios.',
    lastNameInvalid: 'Apellido inválido. Solo se permiten letras y espacios.',
    dniInvalid: 'DNI inválido. Debe ser un número entre 7 y 8 dígitos.',
    addressStreetInvalid: 'Calle inválida. Ingresá una dirección válida.',
    addressNumberInvalid: 'Número inválido. Debe ser un número positivo.',
    floorInvalid: 'Piso inválido. Puede ser un número o "PB".',
    cityInvalid: 'Ciudad inválida. Ingresá un nombre válido.',
    provinceInvalid: 'Provincia inválida. Seleccioná una opción.',
    cityNotInProvince: 'La ciudad seleccionada no pertenece a la provincia elegida.',
    specifyOtherContact: 'Debe especificar el tipo de contacto',
    phoneInvalid: 'Número de teléfono inválido',
    urlInvalid: 'URL inválida',
    contactDuplicate: 'Ya existe un método de contacto con ese tipo y valor',
};

/**
 * ! Funciones de validación
 */

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
        //  /[!@#$%^&*(),.?":{}|<>]/.test(password) Ya no se requiere caracter especial
    );
}

export function isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9._-]{3,30}$/.test(username);
}

export function isValidCuit(cuit: string): boolean {
    if (!cuit) return false;
    if (!/^\d{11}$/.test(cuit)) return false;
    const prefix = cuit.slice(0, 2);
    const number = cuit.slice(2, 10);
    const check = cuit.slice(10);
    const digits = prefix + number;
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * weights[i];
    }
    const mod = sum % 11;
    const calculatedCheckDigit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;
    return check === calculatedCheckDigit.toString();
}

export function isValidCuil(cuil: string): boolean {
    if (!cuil) return false;
    if (!/^\d{11}$/.test(cuil)) return false;
    const prefix = cuil.slice(0, 2);
    const number = cuil.slice(2, 10);
    const check = cuil.slice(10);
    const digits = prefix + number;
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * weights[i];
    }
    const mod = sum % 11;
    const calculatedCheckDigit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;
    return check === calculatedCheckDigit.toString();
}

export function isAdult(date: string): boolean {
    if (!date) return false;
    const birth = new Date(date);
    if (isNaN(birth.getTime())) return false;
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const d = today.getDate() - birth.getDate();

    if (birth > today) return false;

    return age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
}

export function isValidName(name: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim());
}

export function isValidLastName(lastName: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName.trim());
}

export function isValidDni(dni: string): boolean {
    const dniNum = parseInt(dni, 10);
    return /^\d{7,8}$/.test(dni) && dniNum >= 1000000 && dniNum <= 99999999;
}

export function isValidSocialReason(name: string): boolean {
    return name.trim().length >= 3 && name.trim().length <= 100;
}

export function isValidStreet(street: string): boolean {
    return street.trim().length >= 3;
}

export function isValidStreetNumber(number: string): boolean {
    return /^\d{1,5}$/.test(number);
}

export function isValidFloor(floor: string): boolean {
    return floor === '' || /^(\d+|PB)$/i.test(floor);
}

export function isValidCity(city: string): boolean {
    return city.trim().length >= 2;
}

export function isValidProvince(province: string): boolean {
    return provinces.some((p) => p.name === province);
}

export function isValidProvinceById(id: number): boolean {
    return provinces.some((p) => p.id === id);
}

export function isValidProvinceByISO(isoCode: string): boolean {
    return provinces.some((p) => p.isoCode === isoCode);
}

/**
 * -!- Valida si una ciudad pertenece a una provincia específica.
 */
export function isValidCityInProvince(city: string, provinceName: string): boolean {
    if (!city || !provinceName) return false;

    const province = getProvinceByCity(city);
    return (
        province?.name.trim().toLowerCase() === provinceName.trim().toLowerCase()
    );
}

/**
 * -!- Valida un número de teléfono con prefijo internacional.
 */
export function isValidInternationalPhone(phone: string): boolean {
    if (!phone || !phone.trim()) return false;

    const phoneRegex = /^\+?\d{1,3}[\s\-]?\d{1,4}[\s\-]?\d{3}[\s\-]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, '')); // Limpia espacios y formateadores
}

export function isValidWeb(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?([\w\-])+\.{1}[\w\-]+(\.[\w\-]+)*(:[0-9]+)?(\/.*)?$/;
    return urlRegex.test(url);
}