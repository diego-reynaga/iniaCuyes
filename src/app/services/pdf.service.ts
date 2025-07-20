import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cuy, Galpon, RazaCuy, SexoCuy, EstadoSalud, OrigenCuy } from '../models/cuy.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  // Configuración del PDF con logo y encabezado
  private configurarPDF(doc: jsPDF, titulo: string): void {
    // Título principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INIA - Instituto Nacional de Innovación Agraria', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Sistema de Gestión de Cuyes', 105, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, 105, 45, { align: 'center' });
    
    // Fecha de generación
    const fecha = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${fecha}`, 20, 55);
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
  }

  // Generar PDF con lista completa de cuyes
  generarReporteCuyes(cuyes: Cuy[]): void {
    const doc = new jsPDF();
    this.configurarPDF(doc, 'Reporte General de Cuyes');

    // Preparar datos para la tabla
    const tableData = cuyes.map(cuy => [
      cuy.numeroIdentificacion,
      cuy.nombre || 'Sin nombre',
      cuy.raza,
      cuy.sexo,
      this.calcularEdad(cuy.fechaNacimiento),
      `${cuy.peso} kg`,
      cuy.galpon,
      cuy.estadoSalud,
      new Date(cuy.fechaRegistro).toLocaleDateString('es-PE')
    ]);

    // Configurar tabla
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Raza', 'Sexo', 'Edad', 'Peso', 'Galpón', 'Estado', 'F. Registro']],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 10, right: 10 }
    });

    // Estadísticas al final
    this.agregarEstadisticas(doc, cuyes);

    // Guardar el PDF
    doc.save(`reporte-cuyes-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Generar PDF de un cuy específico
  generarFichaCuy(cuy: Cuy, padre?: Cuy, madre?: Cuy): void {
    const doc = new jsPDF();
    this.configurarPDF(doc, `Ficha Individual - ${cuy.numeroIdentificacion}`);

    let yPosition = 80;

    // Información básica
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN BÁSICA', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const infoBasica = [
      ['Número de Identificación:', cuy.numeroIdentificacion],
      ['Nombre:', cuy.nombre || 'Sin nombre'],
      ['Raza:', cuy.raza],
      ['Sexo:', cuy.sexo],
      ['Fecha de Nacimiento:', new Date(cuy.fechaNacimiento).toLocaleDateString('es-PE')],
      ['Edad:', this.calcularEdad(cuy.fechaNacimiento)],
      ['Peso:', `${cuy.peso} kg`],
      ['Color:', cuy.color],
      ['Galpón:', cuy.galpon],
      ['Origen:', cuy.origen],
      ['Estado de Salud:', cuy.estadoSalud]
    ];

    infoBasica.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Genealogía
    if (cuy.genealogia || padre || madre) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('GENEALOGÍA', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      if (padre) {
        doc.setFont('helvetica', 'bold');
        doc.text('Padre:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${padre.numeroIdentificacion} - ${padre.nombre || 'Sin nombre'}`, 50, yPosition);
        yPosition += 8;
      }

      if (madre) {
        doc.setFont('helvetica', 'bold');
        doc.text('Madre:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${madre.numeroIdentificacion} - ${madre.nombre || 'Sin nombre'}`, 50, yPosition);
        yPosition += 8;
      }

      if (cuy.genealogia) {
        doc.setFont('helvetica', 'bold');
        doc.text('Generación:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(cuy.genealogia.generacion.toString(), 70, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'bold');
        doc.text('Pureza:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${cuy.genealogia.pureza}%`, 50, yPosition);
        yPosition += 8;
      }

      yPosition += 10;
    }

    // Información de producción (solo para hembras)
    if (cuy.sexo === SexoCuy.HEMBRA && cuy.produccion) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DE PRODUCCIÓN', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      const infoProduccion = [
        ['Número de Camadas:', cuy.produccion.camadas?.toString() || '0'],
        ['Total de Crías:', cuy.produccion.cantidadCrias?.toString() || '0'],
        ['Última Camada:', cuy.produccion.ultimaCamada ? 
          new Date(cuy.produccion.ultimaCamada).toLocaleDateString('es-PE') : 'No registrada']
      ];

      infoProduccion.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
    }

    // Observaciones
    if (cuy.observaciones) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const observaciones = doc.splitTextToSize(cuy.observaciones, 170);
      doc.text(observaciones, 20, yPosition);
    }

    // Guardar el PDF
    doc.save(`ficha-cuy-${cuy.numeroIdentificacion}.pdf`);
  }

  // Generar reporte de producción
  generarReporteProduccion(cuyes: Cuy[]): void {
    const doc = new jsPDF();
    this.configurarPDF(doc, 'Reporte de Producción');

    const hembras = cuyes.filter(cuy => cuy.sexo === SexoCuy.HEMBRA);
    
    // Preparar datos para la tabla
    const tableData = hembras.map(cuy => [
      cuy.numeroIdentificacion,
      cuy.nombre || 'Sin nombre',
      cuy.raza,
      this.calcularEdad(cuy.fechaNacimiento),
      cuy.produccion?.camadas?.toString() || '0',
      cuy.produccion?.cantidadCrias?.toString() || '0',
      cuy.produccion?.ultimaCamada ? 
        new Date(cuy.produccion.ultimaCamada).toLocaleDateString('es-PE') : 'No registrada',
      cuy.estadoSalud
    ]);

    autoTable(doc, {
      head: [['ID', 'Nombre', 'Raza', 'Edad', 'Camadas', 'Crías', 'Última Camada', 'Estado']],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [231, 76, 60],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 10, right: 10 }
    });

    // Estadísticas de producción
    const totalCamadas = hembras.reduce((sum, cuy) => sum + (cuy.produccion?.camadas || 0), 0);
    const totalCrias = hembras.reduce((sum, cuy) => sum + (cuy.produccion?.cantidadCrias || 0), 0);
    const promedioCriasPortCamada = totalCamadas > 0 ? (totalCrias / totalCamadas).toFixed(2) : '0';

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADÍSTICAS DE PRODUCCIÓN', 20, finalY + 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de hembras reproductoras: ${hembras.length}`, 20, finalY + 35);
    doc.text(`Total de camadas: ${totalCamadas}`, 20, finalY + 45);
    doc.text(`Total de crías: ${totalCrias}`, 20, finalY + 55);
    doc.text(`Promedio de crías por camada: ${promedioCriasPortCamada}`, 20, finalY + 65);

    doc.save(`reporte-produccion-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Generar reporte por raza
  generarReportePorRaza(cuyes: Cuy[]): void {
    const doc = new jsPDF();
    this.configurarPDF(doc, 'Reporte por Raza');

    let yPosition = 70;

    // Agrupar por raza
    const cuyesPorRaza = this.agruparPorRaza(cuyes);

    Object.entries(cuyesPorRaza).forEach(([raza, cuyesRaza]) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`RAZA: ${raza}`, 20, yPosition);
      yPosition += 10;

      const tableData = cuyesRaza.map(cuy => [
        cuy.numeroIdentificacion,
        cuy.nombre || 'Sin nombre',
        cuy.sexo,
        this.calcularEdad(cuy.fechaNacimiento),
        `${cuy.peso} kg`,
        cuy.galpon,
        cuy.estadoSalud
      ]);

      autoTable(doc, {
        head: [['ID', 'Nombre', 'Sexo', 'Edad', 'Peso', 'Galpón', 'Estado']],
        body: tableData,
        startY: yPosition,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [46, 204, 113],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Estadísticas por raza
      const machos = cuyesRaza.filter(cuy => cuy.sexo === SexoCuy.MACHO).length;
      const hembras = cuyesRaza.filter(cuy => cuy.sexo === SexoCuy.HEMBRA).length;
      const pesoPromedio = (cuyesRaza.reduce((sum, cuy) => sum + cuy.peso, 0) / cuyesRaza.length).toFixed(2);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total: ${cuyesRaza.length} | Machos: ${machos} | Hembras: ${hembras} | Peso promedio: ${pesoPromedio} kg`, 20, yPosition);
      yPosition += 20;

      // Nueva página si es necesario
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`reporte-por-raza-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Generar reporte de galpones
  generarReporteGalpones(galpones: Galpon[], cuyes: Cuy[]): void {
    const doc = new jsPDF();
    this.configurarPDF(doc, 'Reporte de Galpones');

    const tableData = galpones.map(galpon => {
      const cuyesEnGalpon = cuyes.filter(cuy => cuy.galpon === galpon.nombre);
      const ocupacion = ((cuyesEnGalpon.length / galpon.capacidad) * 100).toFixed(1);
      
      return [
        galpon.nombre,
        galpon.tipo,
        galpon.capacidad.toString(),
        cuyesEnGalpon.length.toString(),
        `${ocupacion}%`,
        galpon.ubicacion,
        galpon.activo ? 'Activo' : 'Inactivo'
      ];
    });

    autoTable(doc, {
      head: [['Nombre', 'Tipo', 'Capacidad', 'Ocupados', 'Ocupación', 'Ubicación', 'Estado']],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [142, 68, 173],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 10, right: 10 }
    });

    doc.save(`reporte-galpones-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Métodos auxiliares
  private calcularEdad(fechaNacimiento: Date): string {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const diffMs = hoy.getTime() - nacimiento.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30);
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(diffDays / 365);
      const mesesRestantes = Math.floor((diffDays % 365) / 30);
      return `${años} ${años === 1 ? 'año' : 'años'}${mesesRestantes > 0 ? ` ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`;
    }
  }

  private agregarEstadisticas(doc: jsPDF, cuyes: Cuy[]): void {
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADÍSTICAS GENERALES', 20, finalY + 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const total = cuyes.length;
    const machos = cuyes.filter(cuy => cuy.sexo === SexoCuy.MACHO).length;
    const hembras = cuyes.filter(cuy => cuy.sexo === SexoCuy.HEMBRA).length;
    const pesoPromedio = (cuyes.reduce((sum, cuy) => sum + cuy.peso, 0) / total).toFixed(2);
    
    const razas = Object.values(RazaCuy);
    const distribucionRazas = razas.map(raza => ({
      raza,
      cantidad: cuyes.filter(cuy => cuy.raza === raza).length
    }));

    let yPos = finalY + 35;
    doc.text(`Total de cuyes: ${total}`, 20, yPos);
    doc.text(`Machos: ${machos} (${((machos / total) * 100).toFixed(1)}%)`, 20, yPos + 10);
    doc.text(`Hembras: ${hembras} (${((hembras / total) * 100).toFixed(1)}%)`, 20, yPos + 20);
    doc.text(`Peso promedio: ${pesoPromedio} kg`, 20, yPos + 30);
    
    doc.text('Distribución por razas:', 20, yPos + 45);
    distribucionRazas.forEach((item, index) => {
      if (item.cantidad > 0) {
        doc.text(`• ${item.raza}: ${item.cantidad}`, 30, yPos + 55 + (index * 8));
      }
    });
  }

  private agruparPorRaza(cuyes: Cuy[]): { [key: string]: Cuy[] } {
    return cuyes.reduce((grupos, cuy) => {
      const raza = cuy.raza;
      if (!grupos[raza]) {
        grupos[raza] = [];
      }
      grupos[raza].push(cuy);
      return grupos;
    }, {} as { [key: string]: Cuy[] });
  }
}
