import type { Province } from '$lib/types/Province';
import { provinces } from './provinces';

export interface City {
	codigo_postal: string;
	name: string;
	province_id: number;
}

// Ciudades principales por provincia (muestra representativa)
const cities: City[] = [
	// CABA
	{ codigo_postal: 'C1001', name: 'Centro', province_id: 0 },
	{ codigo_postal: 'C1002', name: 'San Nicolás', province_id: 0 },
	{ codigo_postal: 'C1003', name: 'Puerto Madero', province_id: 0 },
	{ codigo_postal: 'C1004', name: 'San Telmo', province_id: 0 },
	{ codigo_postal: 'C1005', name: 'Montserrat', province_id: 0 },
	{ codigo_postal: 'C1006', name: 'La Boca', province_id: 0 },
	{ codigo_postal: 'C1007', name: 'Barracas', province_id: 0 },
	{ codigo_postal: 'C1008', name: 'Parque Patricios', province_id: 0 },
	{ codigo_postal: 'C1009', name: 'Constitución', province_id: 0 },
	{ codigo_postal: 'C1010', name: 'Recoleta', province_id: 0 },
	{ codigo_postal: 'C1011', name: 'Retiro', province_id: 0 },
	{ codigo_postal: 'C1012', name: 'Palermo', province_id: 0 },
	{ codigo_postal: 'C1013', name: 'Belgrano', province_id: 0 },
	{ codigo_postal: 'C1014', name: 'Núñez', province_id: 0 },
	{ codigo_postal: 'C1015', name: 'Villa Urquiza', province_id: 0 },

	// Buenos Aires
	{ codigo_postal: '1900', name: 'La Plata', province_id: 1 },
	{ codigo_postal: '7600', name: 'Mar del Plata', province_id: 1 },
	{ codigo_postal: '8000', name: 'Bahía Blanca', province_id: 1 },
	{ codigo_postal: '1704', name: 'Ramos Mejía', province_id: 1 },
	{ codigo_postal: '1714', name: 'Ituzaingó', province_id: 1 },
	{ codigo_postal: '1722', name: 'Merlo', province_id: 1 },
	{ codigo_postal: '1752', name: 'Lomas del Mirador', province_id: 1 },
	{ codigo_postal: '1802', name: 'Ezeiza', province_id: 1 },
	{ codigo_postal: '1812', name: 'Cañuelas', province_id: 1 },
	{ codigo_postal: '1832', name: 'Lomas de Zamora', province_id: 1 },
	{ codigo_postal: '1842', name: 'Monte Grande', province_id: 1 },
	{ codigo_postal: '1852', name: 'Burzaco', province_id: 1 },
	{ codigo_postal: '1862', name: 'Guernica', province_id: 1 },
	{ codigo_postal: '1872', name: 'Sarandí', province_id: 1 },
	{ codigo_postal: '1882', name: 'San Francisco Solano', province_id: 1 },

	// Catamarca
	{ codigo_postal: '4700', name: 'San Fernando del Valle de Catamarca', province_id: 2 },
	{ codigo_postal: '4701', name: 'Fray Mamerto Esquiú', province_id: 2 },
	{ codigo_postal: '4702', name: 'Valle Viejo', province_id: 2 },
	{ codigo_postal: '4705', name: 'Andalgalá', province_id: 2 },
	{ codigo_postal: '4707', name: 'Belén', province_id: 2 },
	{ codigo_postal: '4709', name: 'Santa María', province_id: 2 },
	{ codigo_postal: '4711', name: 'Tinogasta', province_id: 2 },

	// Córdoba
	{ codigo_postal: '5000', name: 'Córdoba', province_id: 3 },
	{ codigo_postal: '5001', name: 'Nueva Córdoba', province_id: 3 },
	{ codigo_postal: '5002', name: 'Centro', province_id: 3 },
	{ codigo_postal: '5003', name: 'San Vicente', province_id: 3 },
	{ codigo_postal: '5004', name: 'Alberdi', province_id: 3 },
	{ codigo_postal: '5800', name: 'Río Cuarto', province_id: 3 },
	{ codigo_postal: '5900', name: 'Villa María', province_id: 3 },
	{ codigo_postal: '5850', name: 'San Francisco', province_id: 3 },
	{ codigo_postal: '5220', name: 'Jesús María', province_id: 3 },
	{ codigo_postal: '5109', name: 'Villa Carlos Paz', province_id: 3 },

	// Corrientes
	{ codigo_postal: '3400', name: 'Corrientes', province_id: 4 },
	{ codigo_postal: '3401', name: 'Capital', province_id: 4 },
	{ codigo_postal: '3450', name: 'Goya', province_id: 4 },
	{ codigo_postal: '3460', name: 'Mercedes', province_id: 4 },
	{ codigo_postal: '3470', name: 'Curuzú Cuatiá', province_id: 4 },
	{ codigo_postal: '3500', name: 'Paso de los Libres', province_id: 4 },

	// Entre Ríos
	{ codigo_postal: '3100', name: 'Paraná', province_id: 5 },
	{ codigo_postal: '3200', name: 'Concordia', province_id: 5 },
	{ codigo_postal: '2800', name: 'Gualeguaychú', province_id: 5 },
	{ codigo_postal: '3260', name: 'Concepción del Uruguay', province_id: 5 },
	{ codigo_postal: '3070', name: 'San Salvador', province_id: 5 },

	// Jujuy
	{ codigo_postal: '4600', name: 'San Salvador de Jujuy', province_id: 6 },
	{ codigo_postal: '4601', name: 'Alto Comedero', province_id: 6 },
	{ codigo_postal: '4602', name: 'Palpalá', province_id: 6 },
	{ codigo_postal: '4640', name: 'Libertador General San Martín', province_id: 6 },
	{ codigo_postal: '4650', name: 'San Pedro', province_id: 6 },

	// Mendoza
	{ codigo_postal: '5500', name: 'Mendoza', province_id: 7 },
	{ codigo_postal: '5501', name: 'Ciudad', province_id: 7 },
	{ codigo_postal: '5519', name: 'Guaymallén', province_id: 7 },
	{ codigo_postal: '5513', name: 'Godoy Cruz', province_id: 7 },
	{ codigo_postal: '5507', name: 'Las Heras', province_id: 7 },
	{ codigo_postal: '5600', name: 'San Rafael', province_id: 7 },

	// La Rioja
	{ codigo_postal: '5300', name: 'La Rioja', province_id: 8 },
	{ codigo_postal: '5360', name: 'Chilecito', province_id: 8 },
	{ codigo_postal: '5380', name: 'Aimogasta', province_id: 8 },

	// Salta
	{ codigo_postal: '4400', name: 'Salta', province_id: 9 },
	{ codigo_postal: '4401', name: 'Capital', province_id: 9 },
	{ codigo_postal: '4560', name: 'Tartagal', province_id: 9 },
	{ codigo_postal: '4530', name: 'Orán', province_id: 9 },
	{ codigo_postal: '4200', name: 'Metán', province_id: 9 },

	// San Juan
	{ codigo_postal: '5400', name: 'San Juan', province_id: 10 },
	{ codigo_postal: '5401', name: 'Capital', province_id: 10 },
	{ codigo_postal: '5427', name: 'Chimbas', province_id: 10 },
	{ codigo_postal: '5425', name: 'Rivadavia', province_id: 10 },

	// San Luis
	{ codigo_postal: '5700', name: 'San Luis', province_id: 11 },
	{ codigo_postal: '5730', name: 'Villa Mercedes', province_id: 11 },
	{ codigo_postal: '5750', name: 'Merlo', province_id: 11 },

	// Santa Fe
	{ codigo_postal: '3000', name: 'Santa Fe', province_id: 12 },
	{ codigo_postal: '2000', name: 'Rosario', province_id: 12 },
	{ codigo_postal: '2300', name: 'Rafaela', province_id: 12 },
	{ codigo_postal: '3080', name: 'Esperanza', province_id: 12 },
	{ codigo_postal: '2400', name: 'San Francisco', province_id: 12 },

	// Santiago del Estero
	{ codigo_postal: '4200', name: 'Santiago del Estero', province_id: 13 },
	{ codigo_postal: '4206', name: 'La Banda', province_id: 13 },
	{ codigo_postal: '4220', name: 'Termas de Río Hondo', province_id: 13 },

	// Tucumán
	{ codigo_postal: '4000', name: 'San Miguel de Tucumán', province_id: 14 },
	{ codigo_postal: '4001', name: 'Centro', province_id: 14 },
	{ codigo_postal: '4107', name: 'Yerba Buena', province_id: 14 },
	{ codigo_postal: '4142', name: 'Tafí Viejo', province_id: 14 },

	// Chaco
	{ codigo_postal: '3500', name: 'Resistencia', province_id: 15 },
	{ codigo_postal: '3501', name: 'Barranqueras', province_id: 15 },
	{ codigo_postal: '3600', name: 'Presidencia Roque Sáenz Peña', province_id: 15 },

	// Chubut
	{ codigo_postal: '9000', name: 'Comodoro Rivadavia', province_id: 16 },
	{ codigo_postal: '9120', name: 'Puerto Madryn', province_id: 16 },
	{ codigo_postal: '9100', name: 'Trelew', province_id: 16 },
	{ codigo_postal: '9103', name: 'Rawson', province_id: 16 },
	{ codigo_postal: '9200', name: 'Esquel', province_id: 16 },

	// Formosa
	{ codigo_postal: '3600', name: 'Formosa', province_id: 17 },
	{ codigo_postal: '3630', name: 'Clorinda', province_id: 17 },

	// Misiones
	{ codigo_postal: '3300', name: 'Posadas', province_id: 18 },
	{ codigo_postal: '3370', name: 'Puerto Iguazú', province_id: 18 },
	{ codigo_postal: '3360', name: 'Oberá', province_id: 18 },

	// Neuquén
	{ codigo_postal: '8300', name: 'Neuquén', province_id: 19 },
	{ codigo_postal: '8400', name: 'San Carlos de Bariloche', province_id: 19 },
	{ codigo_postal: '8324', name: 'Cipolletti', province_id: 19 },

	// La Pampa
	{ codigo_postal: '6300', name: 'Santa Rosa', province_id: 20 },
	{ codigo_postal: '6360', name: 'General Pico', province_id: 20 },

	// Río Negro
	{ codigo_postal: '8500', name: 'Viedma', province_id: 21 },
	{ codigo_postal: '8400', name: 'San Carlos de Bariloche', province_id: 21 },
	{ codigo_postal: '8332', name: 'General Roca', province_id: 21 },

	// Santa Cruz
	{ codigo_postal: '9400', name: 'Río Gallegos', province_id: 22 },
	{ codigo_postal: '9200', name: 'Caleta Olivia', province_id: 22 },

	// Tierra del Fuego
	{ codigo_postal: '9410', name: 'Ushuaia', province_id: 23 },
	{ codigo_postal: '9420', name: 'Río Grande', province_id: 23 }
];

export function getAllProvinces(): Province[] {
	return provinces;
}

export function getCitiesByProvince(provinceId: number): City[] {
	return cities.filter(city => city.province_id === provinceId);
}

export function getCityByCode(codigoPostal: string): City | undefined {
	return cities.find(city => city.codigo_postal === codigoPostal);
}

export { cities };
export type { City };
