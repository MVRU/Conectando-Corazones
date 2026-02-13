/**
 * Action to detect when an element enters the viewport.
 * Adds a 'visible' class to the element when it intersects.
 * Can key off specific thresholds or root margins.
 */
export function reveal(
	node: HTMLElement,
	options: { threshold?: number; rootMargin?: string; once?: boolean } = {
		threshold: 0.1,
		rootMargin: '0px',
		once: true
	}
) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('reveal-visible');
					node.dispatchEvent(new CustomEvent('reveal'));
					if (options.once !== false) {
						observer.unobserve(node);
					}
				} else {
					if (options.once === false) {
						node.classList.remove('reveal-visible');
						node.dispatchEvent(new CustomEvent('hide'));
					}
				}
			});
		},
		{
			threshold: options.threshold,
			rootMargin: options.rootMargin
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
