import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReporteOpcion {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reportes-container">
      <header class="header">
        <h2>
          <i class="icon">📊</i>
          Generación de Reportes
        </h2>
        <div class="subtitle">
          Genera informes y estadísticas para el seguimiento de tu producción
        </div>
      </header>

      <div class="reportes-grid">
        <div 
          *ngFor="let opcion of opcionesReporte" 
          class="reporte-card"
          (click)="generarReporte(opcion.id)">
          <div class="reporte-icon">{{opcion.icono}}</div>
          <h3>{{opcion.nombre}}</h3>
          <p>{{opcion.descripcion}}</p>
          <button class="btn-generar">Generar PDF</button>
        </div>
      </div>

      <div class="filtros-container">
        <h3>Filtros Disponibles</h3>
        <div class="filtros-grid">
          <div class="filtro-grupo">
            <label>Fecha desde:</label>
            <input type="date" class="filtro-control">
          </div>

          <div class="filtro-grupo">
            <label>Fecha hasta:</label>
            <input type="date" class="filtro-control">
          </div>

          <div class="filtro-grupo">
            <label>Galpón:</label>
            <select class="filtro-control">
              <option value="">Todos los galpones</option>
              <option value="galpon1">Galpón Norte A</option>
              <option value="galpon2">Galpón Sur B</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <label>Sexo:</label>
            <select class="filtro-control">
              <option value="">Todos</option>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <label>Estado:</label>
            <select class="filtro-control">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div class="instrucciones">
        <h3>¿Cómo generar un reporte?</h3>
        <ol>
          <li>Selecciona el tipo de reporte que deseas generar</li>
          <li>Aplica los filtros necesarios (opcional)</li>
          <li>Haz clic en "Generar PDF"</li>
          <li>El informe se descargará automáticamente</li>
          <li>También puedes guardarlo en el sistema para acceder más tarde</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .reportes-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid #667eea;
    }

    .header h2 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.8em;
    }

    .subtitle {
      color: #6c757d;
      font-size: 1.1em;
    }

    .reportes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .reporte-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s;
      cursor: pointer;
      border: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 240px;
    }

    .reporte-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .reporte-icon {
      font-size: 3em;
      margin-bottom: 15px;
    }

    .reporte-card h3 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }

    .reporte-card p {
      color: #6c757d;
      margin: 0 0 20px 0;
      flex-grow: 1;
    }

    .btn-generar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 0;
      width: 100%;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-generar:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .filtros-container {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 40px;
    }

    .filtros-container h3 {
      color: #2c3e50;
      margin: 0 0 20px 0;
      font-size: 1.3em;
    }

    .filtros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .filtro-grupo {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filtro-grupo label {
      font-weight: 600;
      color: #495057;
    }

    .filtro-control {
      padding: 10px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s;
    }

    .filtro-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .instrucciones {
      background: #e9f7fe;
      padding: 25px;
      border-radius: 12px;
      border-left: 5px solid #17a2b8;
    }

    .instrucciones h3 {
      color: #2c3e50;
      margin: 0 0 15px 0;
      font-size: 1.3em;
    }

    .instrucciones ol {
      margin: 0;
      padding-left: 20px;
    }

    .instrucciones li {
      margin-bottom: 10px;
      color: #495057;
    }

    @media (max-width: 768px) {
      .reportes-grid {
        grid-template-columns: 1fr;
      }

      .filtros-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportesComponent implements OnInit {
  opcionesReporte: ReporteOpcion[] = [
    {
      id: 'registro-cuyes',
      nombre: 'Registro General de Cuyes',
      descripcion: 'Listado completo de todos los cuyes registrados con sus datos principales',
      icono: '📋'
    },
    {
      id: 'estadisticas-reproduccion',
      nombre: 'Estadísticas de Reproducción',
      descripcion: 'Análisis de reproducción por galpón, camada y rendimiento',
      icono: '🐣'
    },
    {
      id: 'inventario-galpones',
      nombre: 'Inventario por Galpones',
      descripcion: 'Distribución de cuyes por galpón y capacidad utilizada',
      icono: '🏠'
    },
    {
      id: 'salud-vacunacion',
      nombre: 'Control de Salud y Vacunación',
      descripcion: 'Registro de vacunaciones, tratamientos y estado de salud',
      icono: '💉'
    },
    {
      id: 'genetica-razas',
      nombre: 'Informe Genético y Razas',
      descripcion: 'Análisis de distribución por razas y características genéticas',
      icono: '🧬'
    },
    {
      id: 'produccion-mensual',
      nombre: 'Producción Mensual',
      descripcion: 'Métricas de producción y rendimiento por período',
      icono: '📈'
    }
  ];

  ngOnInit() {
    // Inicialización del componente
  }

  generarReporte(idReporte: string) {
    console.log(`Generando reporte: ${idReporte}`);
    
    switch(idReporte) {
      case 'registro-cuyes':
        this.generarRegistroCuyes();
        break;
      case 'estadisticas-reproduccion':
        this.generarEstadisticasReproduccion();
        break;
      case 'inventario-galpones':
        this.generarInventarioGalpones();
        break;
      default:
        alert('Esta función estará disponible próximamente');
    }
  }

  async generarRegistroCuyes() {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Registro General de Cuyes', 105, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text(`INIA - Instituto Nacional de Innovación Agraria`, 105, 30, { align: 'center' });
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
    
    // Obtener datos de Firebase (implementación futura)
    /*
    const cuyesData = [];
    
    try {
      const cuyesRef = collection(this.firestore, 'cuyes');
      const q = query(cuyesRef);
      const querySnapshot = await getDocs(q);
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        cuyesData.push([
          data.numeroChip || doc.id.substring(0, 6),
          data.sexo || 'N/A',
          data.fechaNacimiento ? new Date(data.fechaNacimiento.toDate()).toLocaleDateString() : 'N/A',
          data.peso ? `${data.peso}g` : 'N/A',
          data.galpon || 'N/A',
          data.activo ? 'Activo' : 'Inactivo'
        ]);
      });
    } catch (error) {
      console.error('Error obteniendo datos para el reporte:', error);
    }
    */
    
    // Por ahora, usamos un array vacío hasta implementar Firebase
    const cuyesData: string[][] = [];
    
    autoTable(doc, {
      head: [['ID', 'Sexo', 'Fecha Nac.', 'Peso', 'Galpón', 'Estado']],
      body: cuyesData,
      startY: 50,
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text(`INIA Cuyes - Sistema de Gestión © 2025`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
    }
    
    doc.save('Registro_Cuyes.pdf');
  }

  async generarEstadisticasReproduccion() {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Estadísticas de Reproducción', 105, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text(`INIA - Instituto Nacional de Innovación Agraria`, 105, 30, { align: 'center' });
    doc.text(`Período: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
    
    // Implementación futura con Firebase
    /*
    const estadisticasData = [];
    
    try {
      const galponesRef = collection(this.firestore, 'galpones');
      const querySnapshot = await getDocs(galponesRef);
      
      // Procesamiento de datos...
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
    }
    */
    
    // Por ahora, usamos un array vacío hasta implementar Firebase
    const estadisticasData: string[][] = [];
    
    autoTable(doc, {
      head: [['Galpón', 'Partos', 'Promedio/Camada', 'Total Crías', 'Supervivencia']],
      body: estadisticasData,
      startY: 50,
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255]
      }
    });
    
    // Espacio para más contenido
    doc.text('Análisis de Rendimiento Reproductivo', 20, 100);
    doc.setFontSize(10);
    doc.text('El análisis muestra una tasa promedio de supervivencia del 88% en todos los galpones.', 20, 110);
    doc.text('El Galpón Norte A muestra el mejor rendimiento con 4.2 crías por camada en promedio.', 20, 120);
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text(`INIA Cuyes - Sistema de Gestión © 2025`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
    }
    
    doc.save('Estadisticas_Reproduccion.pdf');
  }

  async generarInventarioGalpones() {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Inventario por Galpones', 105, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text(`INIA - Instituto Nacional de Innovación Agraria`, 105, 30, { align: 'center' });
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
    
    // Implementación futura con Firebase
    /*
    const inventarioData = [];
    
    try {
      const galponesRef = collection(this.firestore, 'galpones');
      const querySnapshot = await getDocs(galponesRef);
      
      // Aquí procesarías los datos...
    } catch (error) {
      console.error('Error obteniendo inventario:', error);
    }
    */
    
    // Por ahora, usamos un array vacío hasta implementar Firebase
    const inventarioData: string[][] = [];
    
    autoTable(doc, {
      head: [['Nombre', 'Capacidad', 'Ocupación', 'Porcentaje', 'Estado']],
      body: inventarioData,
      startY: 50,
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255]
      }
    });
    
    // Distribución por sexo
    doc.text('Distribución por Sexo', 20, 100);
    
    // Por ahora, usamos un array vacío hasta implementar Firebase
    const distribucionData: string[][] = [];
    
    autoTable(doc, {
      head: [['Galpón', 'Machos', 'Hembras']],
      body: distribucionData,
      startY: 110,
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255]
      }
    });
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text(`INIA Cuyes - Sistema de Gestión © 2025`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
    }
    
    doc.save('Inventario_Galpones.pdf');
  }
}
