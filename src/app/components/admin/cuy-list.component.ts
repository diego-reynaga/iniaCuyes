import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CuyService } from '../../services/cuy.service';
import { PdfService } from '../../services/pdf.service';
import { Cuy, RazaCuy, SexoCuy, OrigenCuy, EstadoSalud, Galpon } from '../../models/cuy.model';

@Component({
  selector: 'app-cuy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cuy-list-container">
      <div class="header">
        <h2>Gestión de Cuyes</h2>
        <div class="header-actions">
          <div class="export-buttons">
            <button (click)="exportarPDFGeneral()" class="btn-export" title="Exportar reporte general">
              📄 Reporte PDF
            </button>
            <button (click)="exportarPDFProduccion()" class="btn-export" title="Exportar reporte de producción">
              📊 Producción PDF
            </button>
            <button (click)="exportarPDFPorRaza()" class="btn-export" title="Exportar reporte por raza">
              🧬 Por Raza PDF
            </button>
          </div>
          <button routerLink="/admin/cuyes/nuevo" class="btn-primary">
            <span class="icon">➕</span>
            Registrar Nuevo Cuy
          </button>
        </div>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Buscar:</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="filterCuyes()"
            placeholder="Buscar por número de identificación o nombre"
            class="search-input">
        </div>

        <div class="filter-group">
          <label>Raza:</label>
          <select [(ngModel)]="filtroRaza" (change)="filterCuyes()" class="filter-select">
            <option value="">Todas las razas</option>
            <option value="{{raza}}" *ngFor="let raza of razas">{{raza}}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Galpón:</label>
          <select [(ngModel)]="filtroGalpon" (change)="filterCuyes()" class="filter-select">
            <option value="">Todos los galpones</option>
            <option value="{{galpon}}" *ngFor="let galpon of galpones">{{galpon}}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Sexo:</label>
          <select [(ngModel)]="filtroSexo" (change)="filterCuyes()" class="filter-select">
            <option value="">Ambos sexos</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
      </div>

      <div class="cuyes-grid" *ngIf="cuyesFiltrados.length > 0">
        <div class="cuy-card" *ngFor="let cuy of cuyesFiltrados; trackBy: trackByCuy">
          <div class="cuy-header">
            <h3>{{cuy.numeroIdentificacion}}</h3>
            <span class="cuy-sexo" [class]="cuy.sexo.toLowerCase()">{{cuy.sexo}}</span>
          </div>

          <div class="cuy-info">
            <div class="info-row">
              <span class="label">Nombre:</span>
              <span class="value">{{cuy.nombre || 'Sin nombre'}}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Raza:</span>
              <span class="value">{{cuy.raza}}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Edad:</span>
              <span class="value">{{calcularEdad(cuy.fechaNacimiento)}} meses</span>
            </div>
            
            <div class="info-row">
              <span class="label">Peso:</span>
              <span class="value">{{cuy.peso}} kg</span>
            </div>
            
            <div class="info-row">
              <span class="label">Galpón:</span>
              <span class="value">{{cuy.galpon}}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value estado" [class]="getEstadoClass(cuy.estadoSalud)">
                {{cuy.estadoSalud}}
              </span>
            </div>
          </div>

          <div class="cuy-actions">
            <button 
              (click)="verDetalle(cuy)" 
              class="btn-secondary"
              title="Ver detalles">
              👁️ Ver
            </button>
            
            <button 
              (click)="generarFichaPDF(cuy)" 
              class="btn-pdf"
              title="Generar ficha PDF">
              📄 PDF
            </button>
            
            <button 
              (click)="editarCuy(cuy)" 
              class="btn-warning"
              title="Editar">
              ✏️ Editar
            </button>
            
            <button 
              (click)="eliminarCuy(cuy)" 
              class="btn-danger"
              title="Eliminar">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="cuyesFiltrados.length === 0 && !loading">
        <div class="no-results-icon">🔍</div>
        <h3>No se encontraron cuyes</h3>
        <p>Intenta ajustar los filtros de búsqueda o registra un nuevo cuy.</p>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Cargando cuyes...</p>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="cancelarEliminacion()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar el cuy <strong>{{cuyAEliminar?.numeroIdentificacion}}</strong>?</p>
        <div class="modal-actions">
          <button (click)="cancelarEliminacion()" class="btn-secondary">Cancelar</button>
          <button (click)="confirmarEliminacion()" class="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cuy-list-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .export-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-export {
      background: #e67e22;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background-color 0.3s;
    }

    .btn-export:hover {
      background: #d35400;
    }

    .btn-primary {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: background-color 0.3s;
      text-decoration: none;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #3498db;
    }

    .cuyes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .cuy-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .cuy-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .cuy-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cuy-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .cuy-sexo {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .cuy-sexo.macho {
      background: rgba(52, 152, 219, 0.2);
      border: 1px solid #3498db;
    }

    .cuy-sexo.hembra {
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid #e74c3c;
    }

    .cuy-info {
      padding: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .info-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .value {
      color: #2c3e50;
      font-weight: 500;
    }

    .estado.excelente { color: #27ae60; }
    .estado.bueno { color: #2ecc71; }
    .estado.regular { color: #f39c12; }
    .estado.enfermo { color: #e74c3c; }
    .estado.en-tratamiento { color: #9b59b6; }

    .cuy-actions {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;
    }

    .btn-secondary,
    .btn-warning,
    .btn-danger,
    .btn-pdf {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-pdf {
      background: #8e44ad;
      color: white;
    }

    .btn-secondary:hover { background: #5a6268; }
    .btn-warning:hover { background: #e67e22; }
    .btn-danger:hover { background: #c0392b; }
    .btn-pdf:hover { background: #7d3c98; }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: #7f8c8d;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #7f8c8d;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #ecf0f1;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 90%;
    }

    .modal h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .modal p {
      margin: 0 0 2rem 0;
      color: #7f8c8d;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filters {
        grid-template-columns: 1fr;
      }

      .cuyes-grid {
        grid-template-columns: 1fr;
      }

      .cuy-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CuyListComponent implements OnInit {
  private cuyService = inject(CuyService);
  private pdfService = inject(PdfService);
  private router = inject(Router);

  cuyes: Cuy[] = [];
  cuyesFiltrados: Cuy[] = [];
  galpones: string[] = [];
  razas = Object.values(RazaCuy);
  
  searchTerm = '';
  filtroRaza = '';
  filtroGalpon = '';
  filtroSexo = '';
  
  loading = false;
  showDeleteModal = false;
  cuyAEliminar: Cuy | null = null;

  ngOnInit(): void {
    this.loadCuyes();
  }

  async loadCuyes(): Promise<void> {
    this.loading = true;
    try {
      this.cuyes = await this.cuyService.obtenerCuyes();
      this.cuyesFiltrados = [...this.cuyes];
      this.extractGalpones();
    } catch (error) {
      console.error('Error loading cuyes:', error);
    } finally {
      this.loading = false;
    }
  }

  extractGalpones(): void {
    const galponesSet = new Set(this.cuyes.map(cuy => cuy.galpon));
    this.galpones = Array.from(galponesSet).sort();
  }

  filterCuyes(): void {
    this.cuyesFiltrados = this.cuyes.filter(cuy => {
      const matchesSearch = !this.searchTerm || 
        cuy.numeroIdentificacion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (cuy.nombre && cuy.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesRaza = !this.filtroRaza || cuy.raza === this.filtroRaza;
      const matchesGalpon = !this.filtroGalpon || cuy.galpon === this.filtroGalpon;
      const matchesSexo = !this.filtroSexo || cuy.sexo === this.filtroSexo;

      return matchesSearch && matchesRaza && matchesGalpon && matchesSexo;
    });
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + 
                  (hoy.getMonth() - nacimiento.getMonth());
    return Math.max(0, meses);
  }

  getEstadoClass(estado: EstadoSalud): string {
    return estado.toLowerCase().replace(/\s+/g, '-');
  }

  verDetalle(cuy: Cuy): void {
    this.router.navigate(['/admin/cuyes', cuy.id]);
  }

  editarCuy(cuy: Cuy): void {
    this.router.navigate(['/admin/cuyes', cuy.id, 'editar']);
  }

  eliminarCuy(cuy: Cuy): void {
    this.cuyAEliminar = cuy;
    this.showDeleteModal = true;
  }

  cancelarEliminacion(): void {
    this.showDeleteModal = false;
    this.cuyAEliminar = null;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.cuyAEliminar?.id) return;

    try {
      await this.cuyService.eliminarCuy(this.cuyAEliminar.id);
      this.showDeleteModal = false;
      this.cuyAEliminar = null;
      await this.loadCuyes();
    } catch (error) {
      console.error('Error deleting cuy:', error);
    }
  }

  // Métodos para generación de PDFs
  exportarPDFGeneral(): void {
    this.pdfService.generarReporteCuyes(this.cuyesFiltrados);
  }

  exportarPDFProduccion(): void {
    this.pdfService.generarReporteProduccion(this.cuyesFiltrados);
  }

  exportarPDFPorRaza(): void {
    this.pdfService.generarReportePorRaza(this.cuyesFiltrados);
  }

  async generarFichaPDF(cuy: Cuy): Promise<void> {
    try {
      // Obtener información de los padres si existen
      let padre: Cuy | undefined;
      let madre: Cuy | undefined;

      if (cuy.padre) {
        padre = await this.cuyService.obtenerCuyPorId(cuy.padre) || undefined;
      }

      if (cuy.madre) {
        madre = await this.cuyService.obtenerCuyPorId(cuy.madre) || undefined;
      }

      this.pdfService.generarFichaCuy(cuy, padre, madre);
    } catch (error) {
      console.error('Error generando ficha PDF:', error);
    }
  }

  trackByCuy(index: number, cuy: Cuy): string {
    return cuy.id || index.toString();
  }
}
