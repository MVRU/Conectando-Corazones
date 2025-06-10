export interface InViewParams {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    onChange?: (visible: boolean) => void;
}

/**
 * Acción para detectar cuando un elemento entra o sale de la vista.
 * Permite disparar animaciones sólo cuando sea necesario.
 */
export function inView(
    node: HTMLElement,
    { threshold = 0.1, rootMargin = '0px', once = false, onChange }: InViewParams = {}
) {
    const observer = new IntersectionObserver(
        ([entry]) => {
            const visible = entry.isIntersecting;
            onChange?.(visible);
            if (visible && once) observer.unobserve(node);
        },
        { threshold, rootMargin }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
}

