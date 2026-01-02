/**
 * Enfoca y desplaza suavemente al primer campo marcado como error.
 * @param selector Selector CSS que identifica campos con error visual.
 */
export function enfocarPrimerCampoConError(selector = '.border-red-400, .ring-red-400'): void {
        const primerError = document.querySelector(selector);
        if (!(primerError instanceof HTMLElement)) return;
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primerError.focus?.();
}