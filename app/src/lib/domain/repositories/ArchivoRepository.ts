import { Archivo } from '../entities/Archivo';

export interface ArchivoRepository {
	create(archivo: Archivo): Promise<Archivo>;
	update(id: number, data: Partial<Archivo>): Promise<Archivo>;
	delete(id: number): Promise<void>;
	findById(id: number): Promise<Archivo | null>;
}
