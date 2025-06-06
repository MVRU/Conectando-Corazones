// * Utilidades de validación comunes para formularios
// -*- Centraliza reglas como validación de email y verificación de mayoría de edad.

export const isValidEmail = (email: string): boolean => {
    const regex = /^[^@]+@[^@]+\.[^@]+$/;
    return regex.test(email.trim());
};

export const isAdult = (date: string, age = 18): boolean => {
    const birth = new Date(date);
    if (Number.isNaN(birth.getTime())) return false;
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
    return years >= age;
};
