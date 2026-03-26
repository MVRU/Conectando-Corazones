import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ItemTarjetaMetrica {
	etiqueta: string;
	valor: string;
	subtitulo?: string;
	unidad?: string;
	color?: [number, number, number];
}

export interface ItemDistribucion {
	etiqueta: string;
	valor: number;
	color: [number, number, number];
}

export class PdfService {
	static readonly MARGEN = 20;
	static readonly COLORES = {
		AZUL_OSCURO: [15, 23, 42] as [number, number, number],
		PIZARRA_400: [148, 163, 184] as [number, number, number],
		PIZARRA_300: [203, 213, 225] as [number, number, number],
		PIZARRA_500: [100, 116, 139] as [number, number, number],
		ESMERALDA_500: [16, 185, 129] as [number, number, number],
		AMBAR_500: [245, 158, 11] as [number, number, number],
		AZUL_500: [59, 130, 246] as [number, number, number]
	};

	static async cargarImagen(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'Anonymous';
			img.src = url;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}

	static dibujarEncabezado(
		doc: jsPDF,
		logoImg: HTMLImageElement | null,
		titulo: string,
		subtitulo: string,
		ubicacion: string,
		bio?: string,
		estaVerificado?: boolean
	): number {
		const anchoPagina = doc.internal.pageSize.getWidth();

		// Fondo
		doc.setFillColor(...this.COLORES.AZUL_OSCURO);
		doc.rect(0, 0, anchoPagina, 55, 'F');

		// Logo
		if (logoImg) {
			const anchoLogo = 25;
			const altoLogo = (logoImg.height * anchoLogo) / logoImg.width;
			doc.addImage(logoImg, 'PNG', this.MARGEN, 15, anchoLogo, altoLogo);
		}

		const tituloX = logoImg ? this.MARGEN + 30 : this.MARGEN;

		// Título
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(22);
		doc.setFont('helvetica', 'bold');
		doc.text(titulo, tituloX, 25);

		// Subtítulo
		doc.setFontSize(12);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(...this.COLORES.PIZARRA_400);
		doc.text(subtitulo, tituloX, 32);

		// Ubicación
		doc.setFontSize(10);
		doc.setTextColor(...this.COLORES.PIZARRA_300);
		doc.text(`Ubicación: ${ubicacion}`, tituloX, 38);

		let siguienteY = 44;

		if (estaVerificado !== undefined) {
			doc.setFontSize(10);
			if (estaVerificado) {
				doc.setTextColor(...this.COLORES.ESMERALDA_500);
				doc.text('✓ Cuenta Verificada', tituloX, siguienteY);
			} else {
				doc.setTextColor(234, 179, 8);
				doc.text('⚠ Verificación Pendiente', tituloX, siguienteY);
			}
			siguienteY += 6;
		}

		if (bio) {
			doc.setFontSize(9);
			doc.setFont('helvetica', 'italic');
			doc.setTextColor(...this.COLORES.PIZARRA_400);
			const lineasBio = doc.splitTextToSize(bio, anchoPagina - tituloX - this.MARGEN);
			doc.text(lineasBio.slice(0, 2), tituloX, siguienteY);
		}

		return 70;
	}

	static dibujarPieDePagina(doc: jsPDF) {
		const anchoPagina = doc.internal.pageSize.getWidth();
		const altoPagina = doc.internal.pageSize.getHeight();
		const totalPaginas = doc.getNumberOfPages();

		for (let i = 1; i <= totalPaginas; i++) {
			doc.setPage(i);

			// Línea decorativa
			doc.setDrawColor(226, 232, 240);
			doc.line(this.MARGEN, altoPagina - 20, anchoPagina - this.MARGEN, altoPagina - 20);

			doc.setFontSize(8);
			doc.setTextColor(...this.COLORES.PIZARRA_400);

			doc.text('Conectando Corazones', this.MARGEN, altoPagina - 12);
			doc.text('Juntos hacemos la diferencia', this.MARGEN, altoPagina - 8);

			const fechaStr = `Generado el: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`;
			doc.text(fechaStr, anchoPagina - this.MARGEN, altoPagina - 12, { align: 'right' });
			doc.text(`Página ${i} de ${totalPaginas}`, anchoPagina - this.MARGEN, altoPagina - 8, {
				align: 'right'
			});
		}
	}

	static dibujarTituloSeccion(doc: jsPDF, titulo: string, posY: number): number {
		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(...this.COLORES.AZUL_OSCURO);
		doc.text(titulo, this.MARGEN, posY);
		return posY + 10;
	}

	static dibujarTarjetasMetricas(
		doc: jsPDF,
		metricas: ItemTarjetaMetrica[],
		posY: number,
		columnas: number = 3
	): number {
		const anchoPagina = doc.internal.pageSize.getWidth();
		const espacio = 5;
		const anchoDisponible = anchoPagina - this.MARGEN * 2 - espacio * (columnas - 1);
		const anchoTarjeta = anchoDisponible / columnas;
		const altoTarjeta = 25;

		metricas.forEach((item, index) => {
			const x = this.MARGEN + index * (anchoTarjeta + espacio);

			// Fondo
			doc.setDrawColor(226, 232, 240);
			doc.setFillColor(248, 250, 252);
			if (item.color) {
				doc.setFillColor(255, 255, 255);
			}
			doc.roundedRect(x, posY, anchoTarjeta, altoTarjeta, 3, 3, 'FD');

			if (item.color) {
				doc.setFillColor(item.color[0], item.color[1], item.color[2]);
				doc.rect(x, posY, 2, altoTarjeta, 'F');
			}

			if (item.color) {
				doc.setFontSize(9);
				doc.setTextColor(100, 116, 139);
				doc.text(item.etiqueta, x + 8, posY + 8);

				doc.setFontSize(12);
				doc.setFont('helvetica', 'bold');
				doc.setTextColor(...this.COLORES.AZUL_OSCURO);
				doc.text(`${item.valor} ${item.unidad || ''}`, x + 8, posY + 18);
			} else {
				doc.setFontSize(12);
				doc.setFont('helvetica', 'bold');
				doc.setTextColor(...this.COLORES.AZUL_OSCURO);
				doc.text(item.valor, x + 5, posY + 10);

				doc.setFontSize(8);
				doc.setFont('helvetica', 'bold');
				doc.setTextColor(71, 85, 105);
				doc.text(item.etiqueta, x + 5, posY + 16);

				if (item.subtitulo) {
					doc.setFontSize(7);
					doc.setFont('helvetica', 'normal');
					doc.setTextColor(...this.COLORES.PIZARRA_400);
					doc.text(item.subtitulo, x + 5, posY + 21);
				}
			}
		});

		return posY + altoTarjeta + 15;
	}

	static dibujarBarraDistribucion(
		doc: jsPDF,
		items: ItemDistribucion[],
		total: number,
		posY: number
	): number {
		const anchoPagina = doc.internal.pageSize.getWidth();
		const anchoBarra = anchoPagina - this.MARGEN * 2;
		const altoBarra = 6;
		let xActual = this.MARGEN;

		// Fondo
		doc.setFillColor(241, 245, 249);
		doc.rect(this.MARGEN, posY, anchoBarra, altoBarra, 'F');

		items.forEach((d) => {
			const anchoSegmento = (d.valor / total) * anchoBarra;
			if (anchoSegmento > 0) {
				doc.setFillColor(d.color[0], d.color[1], d.color[2]);
				doc.rect(xActual, posY, anchoSegmento, altoBarra, 'F');
				xActual += anchoSegmento;
			}
		});

		// Leyenda
		posY += 10;
		let leyendaX = this.MARGEN;
		items.forEach((d) => {
			if (d.valor > 0) {
				doc.setFillColor(d.color[0], d.color[1], d.color[2]);
				doc.circle(leyendaX + 2, posY - 1, 2, 'F');
				doc.setFontSize(8);
				doc.setTextColor(100, 116, 139);
				doc.text(`${d.etiqueta} (${Math.round((d.valor / total) * 100)}%)`, leyendaX + 6, posY);
				leyendaX += 45;
			}
		});

		return posY + 15;
	}

	static dibujarGraficoBarrasSimple(
		doc: jsPDF,
		items: ItemDistribucion[],
		total: number,
		posY: number
	): number {
		const anchoPagina = doc.internal.pageSize.getWidth();

		items.forEach((item) => {
			const pct = total > 0 ? (item.valor / total) * 100 : 0;
			const anchoMaxBarra = anchoPagina - this.MARGEN * 2 - 60;
			const anchoBarra = anchoMaxBarra * (pct / 100);

			doc.setFontSize(10);
			doc.setFont('helvetica', 'bold');
			doc.setTextColor(71, 85, 105);
			doc.text(`${item.etiqueta} (${Math.round(pct)}%)`, this.MARGEN, posY);

			// Fondo de la barra
			doc.setFillColor(241, 245, 249);
			doc.rect(this.MARGEN + 45, posY - 4, anchoMaxBarra, 5, 'F');

			// Barra actual
			if (anchoBarra > 0) {
				doc.setFillColor(item.color[0], item.color[1], item.color[2]);
				doc.rect(this.MARGEN + 45, posY - 4, anchoBarra, 5, 'F');
			}
			posY += 10;
		});

		return posY + 10;
	}

	static dibujarTabla(
		doc: jsPDF,
		cabecera: string[][],
		cuerpo: string[][],
		posY: number,
		tema: 'grid' | 'striped' = 'grid'
	): number {
		autoTable(doc, {
			startY: posY,
			head: cabecera,
			body: cuerpo,
			theme: tema,
			headStyles: {
				fillColor: tema === 'grid' ? this.COLORES.AZUL_OSCURO : this.COLORES.AZUL_500,
				textColor: 255,
				fontStyle: 'bold',
				halign: 'left'
			},
			styles: {
				fontSize: 9,
				cellPadding: 4,
				overflow: 'linebreak'
			},
			columnStyles: {
				0: { fontStyle: 'bold' }
			},
			margin: { left: this.MARGEN, right: this.MARGEN },
			alternateRowStyles: {
				fillColor: [248, 250, 252]
			}
		});
		// @ts-ignore
		return doc.lastAutoTable.finalY + 15;
	}

	static verificarSaltoPagina(doc: jsPDF, posY: number, margen: number = 60): number {
		const altoPagina = doc.internal.pageSize.getHeight();
		if (posY > altoPagina - margen) {
			doc.addPage();
			return 20;
		}
		return posY;
	}
}
