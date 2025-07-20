import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CuyService } from '../../services/cuy.service';
import { PdfService } from '../../services/pdf.service';
import { UserManagementComponent } from './user-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UserManagementComponent],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <div class="header-content">
          <h1>INIA Cuyes - Panel Administrativo</h1>
          <div class="user-info">
            <span>Bienvenido, {{currentUser?.email}}</span>
            <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <nav class="admin-nav">
        <ul class="nav-list">
          <li><a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
          <li><a routerLink="/admin/cuyes" routerLinkActive="active">Gestión de Cuyes</a></li>
          <li><a routerLink="/admin/galpones" routerLinkActive="active">Gestión de Galpones</a></li>
          <li><a (click)="setActiveView('usuarios')" [class.active]="activeView === 'usuarios'">Gestión de Usuarios</a></li>
          <li><a routerLink="/admin/reportes" routerLinkActive="active">Reportes</a></li>
          <li><a routerLink="/public" class="public-link">Vista Pública</a></li>
        </ul>
      </nav>

      <main class="admin-content">
        <div *ngIf="isMainDashboard && activeView === 'dashboard'" class="dashboard-overview">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🐹</div>
              <div class="stat-info">
                <h3>{{estadisticas?.totalCuyes || 0}}</h3>
                <p>Total de Cuyes</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🏠</div>
              <div class="stat-info">
                <h3>{{estadisticas?.totalGalpones || 0}}</h3>
                <p>Galpones Activos</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">♂️</div>
              <div class="stat-info">
                <h3>{{estadisticas?.cuyesPorSexo?.['Macho'] || 0}}</h3>
                <p>Machos</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">♀️</div>
              <div class="stat-info">
                <h3>{{estadisticas?.cuyesPorSexo?.['Hembra'] || 0}}</h3>
                <p>Hembras</p>
              </div>
            </div>
          </div>

          <div class="charts-section">
            <div class="chart-card">
              <h3>Distribución por Razas</h3>
              <div class="chart-content">
                <div *ngFor="let raza of getKeys(estadisticas?.cuyesPorRaza)" class="chart-item">
                  <span class="chart-label">{{raza}}</span>
                  <div class="chart-bar">
                    <div class="chart-fill" [style.width.%]="getPercentage(estadisticas?.cuyesPorRaza[raza], estadisticas?.totalCuyes)"></div>
                    <span class="chart-value">{{estadisticas?.cuyesPorRaza[raza]}}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>Distribución por Galpones</h3>
              <div class="chart-content">
                <div *ngFor="let galpon of getKeys(estadisticas?.cuyesPorGalpon)" class="chart-item">
                  <span class="chart-label">{{galpon}}</span>
                  <div class="chart-bar">
                    <div class="chart-fill" [style.width.%]="getPercentage(estadisticas?.cuyesPorGalpon[galpon], estadisticas?.totalCuyes)"></div>
                    <span class="chart-value">{{estadisticas?.cuyesPorGalpon[galpon]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div class="actions-grid">
              <button routerLink="/admin/cuyes/nuevo" class="action-btn primary">
                <span class="action-icon">➕</span>
                <span>Registrar Nuevo Cuy</span>
              </button>
              
              <button routerLink="/admin/galpones/nuevo" class="action-btn secondary">
                <span class="action-icon">🏠</span>
                <span>Crear Galpón</span>
              </button>
              
              <button routerLink="/admin/reportes" class="action-btn tertiary">
                <span class="action-icon">📊</span>
                <span>Ver Reportes</span>
              </button>
            </div>
          </div>

          <div class="pdf-exports">
            <h3>Exportación de Reportes PDF</h3>
            <div class="export-grid">
              <button (click)="exportarReporteGeneral()" class="export-btn general">
                <span class="export-icon">📄</span>
                <span>Reporte General</span>
              </button>
              
              <button (click)="exportarReporteProduccion()" class="export-btn produccion">
                <span class="export-icon">🐹</span>
                <span>Reporte Producción</span>
              </button>
              
              <button (click)="exportarReportePorRaza()" class="export-btn raza">
                <span class="export-icon">🧬</span>
                <span>Reporte por Raza</span>
              </button>
              
              <button (click)="exportarReporteGalpones()" class="export-btn galpones">
                <span class="export-icon">🏠</span>
                <span>Reporte Galpones</span>
              </button>
              
              <button (click)="exportarTodosLosReportes()" class="export-btn todos">
                <span class="export-icon">📊</span>
                <span>Todos los Reportes</span>
              </button>
              
              <button (click)="exportarDatosCompletos()" class="export-btn datos">
                <span class="export-icon">💾</span>
                <span>Exportar Datos JSON</span>
              </button>
            </div>
          </div>

          <div class="pdf-exports">
            <h3>Exportar Reportes PDF</h3>
            <div class="export-grid">
              <button (click)="exportarReporteGeneral()" class="export-btn general">
                <span class="export-icon">📄</span>
                <span>Reporte General</span>
              </button>
              
              <button (click)="exportarReporteProduccion()" class="export-btn produccion">
                <span class="export-icon">🐹</span>
                <span>Reporte de Producción</span>
              </button>
              
              <button (click)="exportarReportePorRaza()" class="export-btn raza">
                <span class="export-icon">🧬</span>
                <span>Reporte por Raza</span>
              </button>
              
              <button (click)="exportarReporteGalpones()" class="export-btn galpones">
                <span class="export-icon">🏠</span>
                <span>Reporte de Galpones</span>
              </button>

              <button (click)="exportarTodosLosReportes()" class="export-btn todos">
                <span class="export-icon">📋</span>
                <span>Todos los Reportes</span>
              </button>

              <button (click)="exportarDatosCompletos()" class="export-btn datos">
                <span class="export-icon">💾</span>
                <span>Exportar Datos JSON</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Gestión de usuarios -->
        <div *ngIf="activeView === 'usuarios'" class="users-management">
          <app-user-management></app-user-management>
        </div>

        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-header {
      background: #2c3e50;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .admin-nav {
      background: #34495e;
      padding: 0;
    }

    .nav-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      list-style: none;
      display: flex;
      gap: 0;
    }

    .nav-list li a {
      display: block;
      padding: 1rem 1.5rem;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
    }

    .nav-list li a:hover,
    .nav-list li a.active {
      color: white;
      background: rgba(255,255,255,0.1);
      border-bottom-color: #3498db;
    }

    .public-link {
      background: #27ae60 !important;
      color: white !important;
    }

    .admin-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-overview {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }

    .stat-info p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .chart-card h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .chart-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .chart-label {
      min-width: 100px;
      font-size: 0.9rem;
      color: #2c3e50;
    }

    .chart-bar {
      flex: 1;
      height: 25px;
      background: #ecf0f1;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }

    .chart-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2980b9);
      border-radius: 12px;
      transition: width 1s ease-in-out;
    }

    .chart-value {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8rem;
      color: #2c3e50;
      font-weight: bold;
    }

    .quick-actions {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .quick-actions h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      justify-content: center;
      font-weight: 500;
    }

    .action-btn.primary {
      background: #3498db;
      color: white;
    }

    .action-btn.secondary {
      background: #2ecc71;
      color: white;
    }

    .action-btn.tertiary {
      background: #f39c12;
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .pdf-exports {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 2rem;
    }

    .pdf-exports h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      background: white;
      justify-content: center;
      font-weight: 500;
    }

    .export-btn.general {
      border-color: #3498db;
      color: #3498db;
    }

    .export-btn.produccion {
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .export-btn.raza {
      border-color: #27ae60;
      color: #27ae60;
    }

    .export-btn.galpones {
      border-color: #9b59b6;
      color: #9b59b6;
    }

    .export-btn.todos {
      border-color: #f39c12;
      color: #f39c12;
    }

    .export-btn.datos {
      border-color: #34495e;
      color: #34495e;
    }

    .export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .export-btn.general:hover {
      background: #3498db;
      color: white;
    }

    .export-btn.produccion:hover {
      background: #e74c3c;
      color: white;
    }

    .export-btn.raza:hover {
      background: #27ae60;
      color: white;
    }

    .export-btn.galpones:hover {
      background: #9b59b6;
      color: white;
    }

    .export-btn.todos:hover {
      background: #f39c12;
      color: white;
    }

    .export-btn.datos:hover {
      background: #34495e;
      color: white;
    }

    .export-icon {
      font-size: 1.2rem;
    }

    .action-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .nav-list {
        flex-direction: column;
        padding: 0;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private cuyService = inject(CuyService);
  private pdfService = inject(PdfService);
  private router = inject(Router);

  currentUser: any = null;
  estadisticas: any = null;
  cuyes: any[] = [];
  galpones: any[] = [];
  isMainDashboard = true;
  activeView: string = 'dashboard';

  ngOnInit(): void {
    this.loadUserData();
    this.loadEstadisticas();
    
    // Detectar si estamos en la ruta principal del dashboard
    this.isMainDashboard = this.router.url === '/admin';
    
    this.router.events.subscribe(() => {
      this.isMainDashboard = this.router.url === '/admin';
    });
  }

  async loadUserData(): Promise<void> {
    this.currentUser = this.authService.getCurrentUser();
  }

  async loadEstadisticas(): Promise<void> {
    try {
      this.estadisticas = await this.cuyService.obtenerEstadisticas();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  // Métodos para exportación de PDFs
  async exportarReporteGeneral(): Promise<void> {
    try {
      if (this.cuyes.length === 0) {
        await this.loadDatosParaPDF();
      }
      this.pdfService.generarReporteCuyes(this.cuyes);
    } catch (error) {
      console.error('Error generando reporte general:', error);
    }
  }

  async exportarReporteProduccion(): Promise<void> {
    try {
      if (this.cuyes.length === 0) {
        await this.loadDatosParaPDF();
      }
      this.pdfService.generarReporteProduccion(this.cuyes);
    } catch (error) {
      console.error('Error generando reporte de producción:', error);
    }
  }

  async exportarReportePorRaza(): Promise<void> {
    try {
      if (this.cuyes.length === 0) {
        await this.loadDatosParaPDF();
      }
      this.pdfService.generarReportePorRaza(this.cuyes);
    } catch (error) {
      console.error('Error generando reporte por raza:', error);
    }
  }

  async exportarReporteGalpones(): Promise<void> {
    try {
      if (this.galpones.length === 0) {
        await this.loadDatosParaPDF();
      }
      this.pdfService.generarReporteGalpones(this.galpones, this.cuyes);
    } catch (error) {
      console.error('Error generando reporte de galpones:', error);
    }
  }

  async exportarTodosLosReportes(): Promise<void> {
    try {
      if (this.cuyes.length === 0 || this.galpones.length === 0) {
        await this.loadDatosParaPDF();
      }
      
      // Generar todos los reportes con un pequeño delay entre cada uno
      this.pdfService.generarReporteCuyes(this.cuyes);
      setTimeout(() => this.pdfService.generarReporteProduccion(this.cuyes), 500);
      setTimeout(() => this.pdfService.generarReportePorRaza(this.cuyes), 1000);
      setTimeout(() => this.pdfService.generarReporteGalpones(this.galpones, this.cuyes), 1500);
    } catch (error) {
      console.error('Error generando todos los reportes:', error);
    }
  }

  async exportarDatosCompletos(): Promise<void> {
    try {
      if (this.cuyes.length === 0 || this.galpones.length === 0) {
        await this.loadDatosParaPDF();
      }

      const datosCompletos = {
        cuyes: this.cuyes,
        galpones: this.galpones,
        estadisticas: this.estadisticas,
        fechaExportacion: new Date().toISOString(),
        sistema: 'INIA - Sistema de Gestión de Cuyes'
      };

      const dataStr = JSON.stringify(datosCompletos, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `datos-inia-cuyes-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando datos completos:', error);
    }
  }

  async loadDatosParaPDF(): Promise<void> {
    try {
      const [cuyes, galpones] = await Promise.all([
        this.cuyService.obtenerCuyes(),
        this.cuyService.obtenerGalpones()
      ]);
      this.cuyes = cuyes;
      this.galpones = galpones;
    } catch (error) {
      console.error('Error loading data for PDF:', error);
    }
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }
}
