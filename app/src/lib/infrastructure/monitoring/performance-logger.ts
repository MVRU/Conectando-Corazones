/**
 * Utilidad para logging de performance de queries
 * Ayuda a identificar queries lentas y monitorear el rendimiento
 */

interface PerformanceLog {
	operation: string;
	duration: number;
	timestamp: Date;
	metadata?: Record<string, any>;
}

class PerformanceLogger {
	private static instance: PerformanceLogger;
	private logs: PerformanceLog[] = [];
	private readonly MAX_LOGS = 100; // Mantener solo los últimos 100 logs

	private constructor() {}

	static getInstance(): PerformanceLogger {
		if (!PerformanceLogger.instance) {
			PerformanceLogger.instance = new PerformanceLogger();
		}
		return PerformanceLogger.instance;
	}

	/**
	 * Inicia el tracking de una operación
	 * @param operation Nombre de la operación
	 * @returns Función para finalizar el tracking
	 */
	startTracking(operation: string, metadata?: Record<string, any>) {
		const startTime = performance.now();

		return () => {
			const duration = performance.now() - startTime;
			this.log({
				operation,
				duration,
				timestamp: new Date(),
				metadata
			});

			// Log en consola si la operación es lenta (>1000ms)
			if (duration > 1000) {
				console.warn(
					`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`,
					metadata
				);
			}
		};
	}

	/**
	 * Wrapper para medir el tiempo de una función async
	 */
	async track<T>(
		operation: string,
		fn: () => Promise<T>,
		metadata?: Record<string, any>
	): Promise<T> {
		const endTracking = this.startTracking(operation, metadata);
		try {
			const result = await fn();
			endTracking();
			return result;
		} catch (error) {
			endTracking();
			throw error;
		}
	}

	private log(entry: PerformanceLog) {
		this.logs.push(entry);

		// Mantener solo los últimos MAX_LOGS
		if (this.logs.length > this.MAX_LOGS) {
			this.logs.shift();
		}
	}

	/**
	 * Obtiene estadísticas de performance
	 */
	getStats() {
		if (this.logs.length === 0) {
			return {
				totalOperations: 0,
				averageDuration: 0,
				slowestOperation: null,
				fastestOperation: null
			};
		}

		const durations = this.logs.map((l) => l.duration);
		const sorted = [...durations].sort((a, b) => a - b);

		return {
			totalOperations: this.logs.length,
			averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
			slowestOperation: this.logs.find((l) => l.duration === sorted[sorted.length - 1]),
			fastestOperation: this.logs.find((l) => l.duration === sorted[0]),
			p50: sorted[Math.floor(sorted.length * 0.5)],
			p95: sorted[Math.floor(sorted.length * 0.95)],
			p99: sorted[Math.floor(sorted.length * 0.99)]
		};
	}

	/**
	 * Obtiene los últimos N logs
	 */
	getRecentLogs(count: number = 10): PerformanceLog[] {
		return this.logs.slice(-count);
	}

	/**
	 * Limpia todos los logs
	 */
	clear() {
		this.logs = [];
	}
}

// Exportar instancia singleton
export const performanceLogger = PerformanceLogger.getInstance();

// Ejemplo de uso:
// const endTracking = performanceLogger.startTracking('findAllProjects');
// const projects = await repo.findAll();
// endTracking();
//
// O usando el wrapper:
// const projects = await performanceLogger.track(
//   'findAllProjects',
//   () => repo.findAll(),
//   { userId: user.id }
// );
