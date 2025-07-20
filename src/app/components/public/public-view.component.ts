import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CuyService } from '../../services/cuy.service';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../services/auth.service';
import { Cuy, RazaCuy, SexoCuy, Comentario, Usuario } from '../../models/cuy.model';

@Component({
  selector: 'app-public-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="public-container">
      <header class="public-header">
        <div class="header-content">
          <div class="logo-section">
            <h1>INIA - Instituto Nacional de Innovación Agraria</h1>
            <p class="subtitle">Sistema de Gestión de Cuyes - Vista Pública</p>
          </div>
          <nav class="public-nav">
            <a routerLink="/public" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Inicio
            </a>
            <a routerLink="/login" class="nav-link" routerLinkActive="active">
              Iniciar Sesión
            </a>
            <a routerLink="/register" class="nav-link" routerLinkActive="active">
              Registrarse
            </a>
            <a routerLink="/admin" class="nav-link admin-link" *ngIf="usuario" routerLinkActive="active">
              Panel Admin
            </a>
            <button *ngIf="usuario" (click)="logout()" class="nav-link logout-btn">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main class="public-content">
        <section class="hero-section">
          <div class="hero-content">
            <h2>Programa de Mejoramiento Genético de Cuyes</h2>
            <p>El Instituto Nacional de Innovación Agraria (INIA) desarrolla un programa integral de mejoramiento genético de cuyes para contribuir al desarrollo de la ganadería menor en el Perú.</p>
          </div>
        </section>

        <section class="statistics-section" *ngIf="estadisticas">
          <h2>Estadísticas del Programa</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{estadisticas.totalCuyes}}</div>
              <div class="stat-label">Cuyes Registrados</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{getRazasCount()}}</div>
              <div class="stat-label">Razas en Programa</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{estadisticas.totalGalpones}}</div>
              <div class="stat-label">Galpones Activos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{getPromedioPeso()}} kg</div>
              <div class="stat-label">Peso Promedio</div>
            </div>
          </div>
        </section>

        <section class="breeds-section">
          <h2>Razas en el Programa</h2>
          <div class="breeds-grid">
            <div class="breed-card" *ngFor="let raza of razasDisponibles">
              <h3>{{raza.nombre}}</h3>
              <div class="breed-stats">
                <div class="breed-stat">
                  <span class="stat-value">{{raza.cantidad}}</span>
                  <span class="stat-desc">ejemplares</span>
                </div>
                <div class="breed-stat">
                  <span class="stat-value">{{raza.machos}}</span>
                  <span class="stat-desc">machos</span>
                </div>
                <div class="breed-stat">
                  <span class="stat-value">{{raza.hembras}}</span>
                  <span class="stat-desc">hembras</span>
                </div>
              </div>
              <div class="breed-description">
                <p>{{getDescripcionRaza(raza.nombre)}}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="program-info">
          <h2>Objetivos del Programa</h2>
          <div class="objectives-grid">
            <div class="objective-item">
              <div class="objective-icon">🧬</div>
              <h3>Mejoramiento Genético</h3>
              <p>Desarrollo de líneas genéticas superiores con características productivas destacadas.</p>
            </div>
            <div class="objective-item">
              <div class="objective-icon">📊</div>
              <h3>Registro Genealógico</h3>
              <p>Mantenimiento de registros genealógicos precisos para el control de la consanguinidad.</p>
            </div>
            <div class="objective-item">
              <div class="objective-icon">🌱</div>
              <h3>Transferencia Tecnológica</h3>
              <p>Capacitación y transferencia de tecnología a productores de cuyes del país.</p>
            </div>
            <div class="objective-item">
              <div class="objective-icon">🔬</div>
              <h3>Investigación</h3>
              <p>Investigación continua en nutrición, manejo y sanidad de cuyes.</p>
            </div>
          </div>
        </section>

        <section class="contact-section">
          <h2>Información de Contacto</h2>
          <div class="contact-info">
            <div class="contact-item">
              <h4>Dirección</h4>
              <p>Av. La Molina 1981, La Molina, Lima - Perú</p>
            </div>
            <div class="contact-item">
              <h4>Teléfono</h4>
              <p>+51 1 240-2350</p>
            </div>
            <div class="contact-item">
              <h4>Email</h4>
              <p>consultas&#64;inia.gob.pe</p>
            </div>
            <div class="contact-item">
              <h4>Web</h4>
              <p>www.inia.gob.pe</p>
            </div>
          </div>
        </section>

        <section class="comentarios-section">
          <h2>Comentarios y Sugerencias</h2>
          
          <!-- Formulario para agregar comentarios (solo usuarios logueados) -->
          <div class="comentario-form" *ngIf="usuario">
            <h3>Deja tu comentario</h3>
            <form (ngSubmit)="enviarComentario()" #comentarioForm="ngForm">
              <div class="form-group">
                <label for="textoComentario">Tu comentario:</label>
                <textarea 
                  id="textoComentario"
                  name="textoComentario"
                  [(ngModel)]="nuevoComentario"
                  required
                  maxlength="500"
                  rows="4"
                  class="form-control"
                  placeholder="Comparte tu experiencia, sugerencias o preguntas sobre el programa..."></textarea>
                <small class="char-counter">{{nuevoComentario.length}}/500 caracteres</small>
              </div>
              <button 
                type="submit" 
                [disabled]="!comentarioForm.form.valid || enviandoComentario"
                class="btn-comentario">
                {{enviandoComentario ? 'Enviando...' : 'Enviar Comentario'}}
              </button>
            </form>
          </div>

          <!-- Mensaje para usuarios no logueados -->
          <div class="login-prompt" *ngIf="!usuario">
            <p>Para dejar comentarios, por favor <a routerLink="/login" class="login-link">inicia sesión</a> o <a routerLink="/register" class="login-link">regístrate</a>.</p>
          </div>

          <!-- Lista de comentarios -->
          <div class="comentarios-lista">
            <h3>Comentarios de la comunidad</h3>
            <div class="comentario-item" *ngFor="let comentario of comentarios">
              <div class="comentario-header">
                <strong class="autor">{{comentario.autorNombre}}</strong>
                <span class="fecha">{{formatearFecha(comentario.fecha)}}</span>
              </div>
              <div class="comentario-texto">
                <p>{{comentario.texto}}</p>
              </div>
            </div>
            
            <div class="no-comentarios" *ngIf="comentarios.length === 0">
              <p>¡Sé el primero en dejar un comentario!</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="public-footer">
        <div class="footer-content">
          <p>&copy; 2024 Instituto Nacional de Innovación Agraria (INIA) - Todos los derechos reservados</p>
          <p>Sistema de Gestión de Cuyes v1.0</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .public-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #2c3e50;
      font-weight: 700;
    }

    .subtitle {
      margin: 0.5rem 0 0 0;
      color: #7f8c8d;
      font-size: 1rem;
    }

    .public-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .public-nav .nav-link {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .public-nav .nav-link:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .public-nav .nav-link.active {
      background: #2980b9;
      border-color: #2980b9;
    }

    .public-nav .admin-link {
      background: #27ae60;
      border-color: #27ae60;
    }

    .public-nav .admin-link:hover {
      background: #2ecc71;
      border-color: #2ecc71;
    }

    .public-nav .logout-btn {
      background: #e74c3c;
      border: 1px solid #e74c3c;
      color: white;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .public-nav .logout-btn:hover {
      background: #c0392b;
      border-color: #c0392b;
      transform: translateY(-2px);
    }

    .public-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 4rem 3rem;
      text-align: center;
      margin-bottom: 3rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .hero-content h2 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }

    .hero-content p {
      font-size: 1.2rem;
      color: #5a6c7d;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }

    .statistics-section,
    .breeds-section,
    .program-info,
    .contact-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 3rem;
      margin-bottom: 3rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .statistics-section h2,
    .breeds-section h2,
    .program-info h2,
    .contact-section h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      color: white;
      transform: translateY(0);
      transition: transform 0.3s;
    }

    .stat-item:hover {
      transform: translateY(-5px);
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .breeds-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .breed-card {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 2rem;
      border-left: 5px solid #3498db;
      transition: transform 0.3s;
    }

    .breed-card:hover {
      transform: translateY(-3px);
    }

    .breed-card h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .breed-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 1.5rem;
    }

    .breed-stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #3498db;
    }

    .stat-desc {
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    .breed-description p {
      color: #5a6c7d;
      line-height: 1.5;
      margin: 0;
    }

    .objectives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .objective-item {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 15px;
      transition: transform 0.3s;
    }

    .objective-item:hover {
      transform: translateY(-3px);
    }

    .objective-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .objective-item h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .objective-item p {
      color: #5a6c7d;
      line-height: 1.5;
      margin: 0;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .contact-item {
      text-align: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .contact-item h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .contact-item p {
      color: #5a6c7d;
      margin: 0;
    }

    .comentarios-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 3rem;
      margin-bottom: 3rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .comentario-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 15px;
      margin-bottom: 2rem;
    }

    .comentario-form h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .char-counter {
      color: #7f8c8d;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .btn-comentario {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .btn-comentario:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-comentario:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .login-prompt {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 15px;
      margin-bottom: 2rem;
    }

    .login-prompt p {
      margin: 0;
      color: #5a6c7d;
    }

    .login-link {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link:hover {
      text-decoration: underline;
    }

    .comentarios-lista h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .comentario-item {
      background: white;
      border: 1px solid #ecf0f1;
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: box-shadow 0.3s;
    }

    .comentario-item:hover {
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .comentario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .autor {
      color: #2c3e50;
      font-size: 1rem;
    }

    .fecha {
      color: #7f8c8d;
      font-size: 0.85rem;
    }

    .comentario-texto p {
      margin: 0;
      color: #5a6c7d;
      line-height: 1.5;
    }

    .no-comentarios {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
      font-style: italic;
    }

    .public-footer {
      background: rgba(44, 62, 80, 0.95);
      color: white;
      text-align: center;
      padding: 2rem;
    }

    .footer-content p {
      margin: 0.5rem 0;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .public-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .public-nav .nav-link,
      .public-nav .logout-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }

      .hero-content h2 {
        font-size: 2rem;
      }

      .hero-content p {
        font-size: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .breeds-grid {
        grid-template-columns: 1fr;
      }

      .objectives-grid {
        grid-template-columns: 1fr;
      }

      .contact-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PublicViewComponent implements OnInit {
  private cuyService = inject(CuyService);
  private comentarioService = inject(ComentarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  estadisticas: any = null;
  razasDisponibles: any[] = [];
  comentarios: Comentario[] = [];
  usuario: Usuario | null = null;
  nuevoComentario = '';
  enviandoComentario = false;

  ngOnInit(): void {
    this.loadEstadisticas();
    this.loadComentarios();
    this.checkUserStatus();
  }

  async loadEstadisticas(): Promise<void> {
    try {
      this.estadisticas = await this.cuyService.obtenerEstadisticas();
      this.calcularRazasDisponibles();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async loadComentarios(): Promise<void> {
    try {
      this.comentarios = await this.comentarioService.obtenerComentarios();
    } catch (error) {
      console.error('Error loading comentarios:', error);
    }
  }

  async checkUserStatus(): Promise<void> {
    this.usuario = await this.authService.getCurrentUserProfile();
  }

  async enviarComentario(): Promise<void> {
    if (!this.usuario || !this.nuevoComentario.trim()) return;

    this.enviandoComentario = true;
    try {
      const comentario: Comentario = {
        texto: this.nuevoComentario.trim(),
        autorEmail: this.usuario.email,
        autorNombre: `${this.usuario.nombre} ${this.usuario.apellido}`,
        fecha: new Date(),
        activo: true,
        moderado: false
      };

      await this.comentarioService.agregarComentario(comentario);
      this.nuevoComentario = '';
      await this.loadComentarios(); // Recargar comentarios
    } catch (error) {
      console.error('Error enviando comentario:', error);
    } finally {
      this.enviandoComentario = false;
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calcularRazasDisponibles(): void {
    if (!this.estadisticas?.cuyesPorRaza) return;

    this.razasDisponibles = Object.entries(this.estadisticas.cuyesPorRaza)
      .map(([raza, cantidad]: [string, any]) => ({
        nombre: raza,
        cantidad: cantidad,
        machos: this.estadisticas.cuyesPorSexo?.['Macho'] || 0,
        hembras: this.estadisticas.cuyesPorSexo?.['Hembra'] || 0
      }))
      .filter(raza => raza.cantidad > 0);
  }

  getPromedioPeso(): string {
    if (!this.estadisticas?.promedioPeso) return '0.0';
    return this.estadisticas.promedioPeso.toFixed(1);
  }

  getRazasCount(): number {
    if (!this.estadisticas?.cuyesPorRaza) return 0;
    return Object.keys(this.estadisticas.cuyesPorRaza).length;
  }

  getDescripcionRaza(raza: string): string {
    const descripciones: { [key: string]: string } = {
      'Perú': 'Raza de alta rusticidad y adaptabilidad, caracterizada por su excelente conversión alimenticia y resistencia a enfermedades.',
      'Andina': 'Desarrollada específicamente para condiciones de altura, con gran capacidad reproductiva y crecimiento acelerado.',
      'Inti': 'Línea mejorada con características sobresalientes en peso vivo y rendimiento de carcasa.',
      'Criolla': 'Raza local adaptada a condiciones específicas del territorio peruano, base fundamental del programa de mejoramiento.',
      'Mejorada': 'Resultado del cruzamiento direccional de razas mejoradas, con características productivas superiores.'
    };
    return descripciones[raza] || 'Raza incluida en el programa de mejoramiento genético del INIA.';
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.usuario = null;
      this.router.navigate(['/public']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
