import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CuyService } from '../../services/cuy.service';
import { PdfService } from '../../services/pdf.service';
import { Cuy } from '../../models/cuy.model';

@Component({
  selector: 'app-cuy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container" *ngIf="cuy">
      <div class="detail-header">
        <div class="header-info">
          <h1>{{cuy.numeroIdentificacion}}</h1>
          <span class="cuy-nombre">{{cuy.nombre || 'Sin nombre'}}</span>
        </div>
        <div class="header-actions">
          <button (click)="generarFichaPDF()" class="btn-pdf">
            📄 Generar PDF
          </button>
          <button (click)="editarCuy()" class="btn-edit">
            ✏️ Editar
          </button>
          <button (click)="volver()" class="btn-back">
            ← Volver
          </button>
        </div>
      </div>

      <div class="detail-content">
        <div class="info-grid">
          <!-- Información Básica -->
          <div class="info-card">
            <h3>Información Básica</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Número de Identificación:</span>
                <span class="value">{{cuy.numeroIdentificacion}}</span>
              </div>
              <div class="info-item">
                <span class="label">Nombre:</span>
                <span class="value">{{cuy.nombre || 'Sin nombre'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Raza:</span>
                <span class="value badge raza">{{cuy.raza}}</span>
              </div>
              <div class="info-item">
                <span class="label">Sexo:</span>
                <span class="value badge" [class]="cuy.sexo.toLowerCase()">{{cuy.sexo}}</span>
              </div>
              <div class="info-item">
                <span class="label">Fecha de Nacimiento:</span>
                <span class="value">{{formatearFecha(cuy.fechaNacimiento)}}</span>
              </div>
              <div class="info-item">
                <span class="label">Edad:</span>
                <span class="value">{{calcularEdad(cuy.fechaNacimiento)}}</span>
              </div>
              <div class="info-item">
                <span class="label">Peso:</span>
                <span class="value peso">{{cuy.peso}} kg</span>
              </div>
              <div class="info-item">
                <span class="label">Color:</span>
                <span class="value">{{cuy.color}}</span>
              </div>
              <div class="info-item">
                <span class="label">Galpón:</span>
                <span class="value badge galpon">{{cuy.galpon}}</span>
              </div>
              <div class="info-item">
                <span class="label">Origen:</span>
                <span class="value">{{cuy.origen}}</span>
              </div>
              <div class="info-item">
                <span class="label">Estado de Salud:</span>
                <span class="value badge" [class]="getEstadoClass(cuy.estadoSalud)">{{cuy.estadoSalud}}</span>
              </div>
              <div class="info-item">
                <span class="label">Fecha de Registro:</span>
                <span class="value">{{formatearFecha(cuy.fechaRegistro)}}</span>
              </div>
            </div>
          </div>

          <!-- Genealogía -->
          <div class="info-card" *ngIf="padre || madre || cuy.genealogia">
            <h3>Genealogía</h3>
            <div class="info-list">
              <div class="info-item" *ngIf="padre">
                <span class="label">Padre:</span>
                <span class="value genealogy">
                  <button (click)="verPadre()" class="link-btn">
                    {{padre.numeroIdentificacion}} - {{padre.nombre || 'Sin nombre'}}
                  </button>
                </span>
              </div>
              <div class="info-item" *ngIf="!padre && cuy.padre">
                <span class="label">Padre:</span>
                <span class="value">ID: {{cuy.padre}} (No encontrado)</span>
              </div>
              <div class="info-item" *ngIf="madre">
                <span class="label">Madre:</span>
                <span class="value genealogy">
                  <button (click)="verMadre()" class="link-btn">
                    {{madre.numeroIdentificacion}} - {{madre.nombre || 'Sin nombre'}}
                  </button>
                </span>
              </div>
              <div class="info-item" *ngIf="!madre && cuy.madre">
                <span class="label">Madre:</span>
                <span class="value">ID: {{cuy.madre}} (No encontrado)</span>
              </div>
              <div class="info-item" *ngIf="cuy.genealogia">
                <span class="label">Generación:</span>
                <span class="value">{{cuy.genealogia.generacion}}</span>
              </div>
              <div class="info-item" *ngIf="cuy.genealogia">
                <span class="label">Pureza:</span>
                <span class="value">{{cuy.genealogia.pureza}}%</span>
              </div>
            </div>
          </div>

          <!-- Información de Producción (solo para hembras) -->
          <div class="info-card" *ngIf="cuy.sexo === 'Hembra' && cuy.produccion">
            <h3>Información de Producción</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Número de Camadas:</span>
                <span class="value production">{{cuy.produccion.camadas || 0}}</span>
              </div>
              <div class="info-item">
                <span class="label">Total de Crías:</span>
                <span class="value production">{{cuy.produccion.cantidadCrias || 0}}</span>
              </div>
              <div class="info-item" *ngIf="cuy.produccion.ultimaCamada">
                <span class="label">Última Camada:</span>
                <span class="value">{{formatearFecha(cuy.produccion.ultimaCamada)}}</span>
              </div>
              <div class="info-item" *ngIf="cuy.produccion.camadas && cuy.produccion.camadas > 0">
                <span class="label">Promedio Crías/Camada:</span>
                <span class="value production">{{getPromedioCriasPortCamada()}}</span>
              </div>
            </div>
          </div>

          <!-- Descendencia -->
          <div class="info-card" *ngIf="descendencia.length > 0">
            <h3>Descendencia</h3>
            <div class="descendencia-list">
              <div class="descendencia-item" *ngFor="let cria of descendencia">
                <button (click)="verDescendiente(cria)" class="descendencia-btn">
                  <span class="desc-id">{{cria.numeroIdentificacion}}</span>
                  <span class="desc-nombre">{{cria.nombre || 'Sin nombre'}}</span>
                  <span class="desc-sexo" [class]="cria.sexo.toLowerCase()">{{cria.sexo}}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="info-card observaciones-card" *ngIf="cuy.observaciones">
            <h3>Observaciones</h3>
            <div class="observaciones-content">
              <p>{{cuy.observaciones}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="loading">
      <div class="loading-spinner"></div>
      <p>Cargando información del cuy...</p>
    </div>

    <div class="error-message" *ngIf="errorMessage">
      <h3>Error</h3>
      <p>{{errorMessage}}</p>
      <button (click)="volver()" class="btn-back">Volver a la Lista</button>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 3px solid #ecf0f1;
    }

    .header-info h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 2.5rem;
    }

    .cuy-nombre {
      color: #7f8c8d;
      font-size: 1.2rem;
      font-style: italic;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-pdf,
    .btn-edit,
    .btn-back {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-pdf {
      background: #8e44ad;
      color: white;
    }

    .btn-pdf:hover {
      background: #7d3c98;
    }

    .btn-edit {
      background: #f39c12;
      color: white;
    }

    .btn-edit:hover {
      background: #e67e22;
    }

    .btn-back {
      background: #95a5a6;
      color: white;
    }

    .btn-back:hover {
      background: #7f8c8d;
    }

    .detail-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 0;
    }

    .info-card {
      padding: 2rem;
      border-right: 1px solid #ecf0f1;
      border-bottom: 1px solid #ecf0f1;
    }

    .info-card:nth-child(even) {
      background: #f8f9fa;
    }

    .info-card h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
      border-left: 4px solid #3498db;
      padding-left: 1rem;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      align-items: center;
    }

    .label {
      font-weight: 600;
      color: #2c3e50;
    }

    .value {
      font-weight: 500;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-align: center;
    }

    .badge.raza {
      background: #3498db;
      color: white;
    }

    .badge.macho {
      background: #27ae60;
      color: white;
    }

    .badge.hembra {
      background: #e67e22;
      color: white;
    }

    .badge.galpon {
      background: #9b59b6;
      color: white;
    }

    .badge.excelente {
      background: #27ae60;
      color: white;
    }

    .badge.bueno {
      background: #2ecc71;
      color: white;
    }

    .badge.regular {
      background: #f39c12;
      color: white;
    }

    .badge.enfermo {
      background: #e74c3c;
      color: white;
    }

    .badge.en-tratamiento {
      background: #e67e22;
      color: white;
    }

    .peso {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .production {
      font-size: 1.1rem;
      font-weight: 700;
      color: #e74c3c;
    }

    .link-btn {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      text-decoration: underline;
      font-size: inherit;
      padding: 0;
    }

    .link-btn:hover {
      color: #2980b9;
    }

    .descendencia-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .descendencia-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;
    }

    .descendencia-btn:hover {
      background: #f8f9fa;
      border-color: #3498db;
    }

    .desc-id {
      font-weight: 600;
      color: #2c3e50;
    }

    .desc-nombre {
      color: #7f8c8d;
      flex: 1;
    }

    .desc-sexo {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .desc-sexo.macho {
      background: #27ae60;
      color: white;
    }

    .desc-sexo.hembra {
      background: #e67e22;
      color: white;
    }

    .observaciones-card {
      grid-column: 1 / -1;
    }

    .observaciones-content p {
      margin: 0;
      color: #5a6c7d;
      line-height: 1.6;
      font-size: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .loading {
      text-align: center;
      padding: 4rem;
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

    .error-message {
      text-align: center;
      padding: 4rem;
      color: #e74c3c;
    }

    .error-message h3 {
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-card {
        border-right: none;
      }

      .info-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .header-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CuyDetailComponent implements OnInit {
  private cuyService = inject(CuyService);
  private pdfService = inject(PdfService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cuy: Cuy | null = null;
  padre: Cuy | null = null;
  madre: Cuy | null = null;
  descendencia: Cuy[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCuyDetail();
  }

  async loadCuyDetail(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID de cuy no válido';
      return;
    }

    this.loading = true;
    try {
      this.cuy = await this.cuyService.obtenerCuyPorId(id);
      if (!this.cuy) {
        this.errorMessage = 'Cuy no encontrado';
        return;
      }

      // Cargar información adicional
      await this.loadGenealogiaInfo();
      await this.loadDescendencia();
    } catch (error) {
      console.error('Error loading cuy detail:', error);
      this.errorMessage = 'Error al cargar la información del cuy';
    } finally {
      this.loading = false;
    }
  }

  async loadGenealogiaInfo(): Promise<void> {
    if (!this.cuy) return;

    try {
      if (this.cuy.padre) {
        this.padre = await this.cuyService.obtenerCuyPorId(this.cuy.padre);
      }

      if (this.cuy.madre) {
        this.madre = await this.cuyService.obtenerCuyPorId(this.cuy.madre);
      }
    } catch (error) {
      console.error('Error loading genealogy info:', error);
    }
  }

  async loadDescendencia(): Promise<void> {
    if (!this.cuy?.id) return;

    try {
      const todosCuyes = await this.cuyService.obtenerCuyes();
      this.descendencia = todosCuyes.filter(cuy => 
        cuy.padre === this.cuy!.id || cuy.madre === this.cuy!.id
      );
    } catch (error) {
      console.error('Error loading descendencia:', error);
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularEdad(fechaNacimiento: Date): string {
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

  getEstadoClass(estado: string): string {
    return estado.toLowerCase().replace(/\s+/g, '-');
  }

  getPromedioCriasPortCamada(): string {
    if (!this.cuy?.produccion?.camadas || this.cuy.produccion.camadas === 0) {
      return '0';
    }
    const promedio = (this.cuy.produccion.cantidadCrias || 0) / this.cuy.produccion.camadas;
    return promedio.toFixed(1);
  }

  async generarFichaPDF(): Promise<void> {
    if (!this.cuy) return;

    try {
      this.pdfService.generarFichaCuy(this.cuy, this.padre || undefined, this.madre || undefined);
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  }

  editarCuy(): void {
    if (this.cuy?.id) {
      this.router.navigate(['/admin/cuyes', this.cuy.id, 'editar']);
    }
  }

  verPadre(): void {
    if (this.padre?.id) {
      this.router.navigate(['/admin/cuyes', this.padre.id]);
    }
  }

  verMadre(): void {
    if (this.madre?.id) {
      this.router.navigate(['/admin/cuyes', this.madre.id]);
    }
  }

  verDescendiente(descendiente: Cuy): void {
    if (descendiente.id) {
      this.router.navigate(['/admin/cuyes', descendiente.id]);
    }
  }

  volver(): void {
    this.router.navigate(['/admin/cuyes']);
  }
}
