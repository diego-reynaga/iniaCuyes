import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Galpon {
  id?: string;
  nombre: string;
  capacidadMaxima: number;
  ubicacion: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: Date;
  cuyesActuales?: number;
}

@Component({
  selector: 'app-galpon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="galpon-container">
      <div class="header">
        <h2>
          <i class="icon">🏠</i>
          Gestión de Galpones
        </h2>
        <button class="btn-nuevo" (click)="mostrarFormulario = !mostrarFormulario">
          <i class="icon">{{mostrarFormulario ? '❌' : '➕'}}</i>
          {{mostrarFormulario ? 'Cancelar' : 'Nuevo Galpón'}}
        </button>
      </div>

      <!-- Formulario para nuevo/editar galpón -->
      <div class="form-container" *ngIf="mostrarFormulario">
        <h3>{{editandoGalpon ? 'Editar Galpón' : 'Nuevo Galpón'}}</h3>
        <form (ngSubmit)="guardarGalpon()" class="galpon-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre del Galpón *</label>
              <input 
                type="text" 
                id="nombre"
                [(ngModel)]="galponForm.nombre" 
                name="nombre"
                required
                class="form-control"
                placeholder="Ej: Galpón Norte A">
            </div>
            <div class="form-group">
              <label for="capacidad">Capacidad Máxima *</label>
              <input 
                type="number" 
                id="capacidad"
                [(ngModel)]="galponForm.capacidadMaxima" 
                name="capacidad"
                required
                min="1"
                class="form-control"
                placeholder="Número de cuyes">
            </div>
          </div>

          <div class="form-group">
            <label for="ubicacion">Ubicación *</label>
            <input 
              type="text" 
              id="ubicacion"
              [(ngModel)]="galponForm.ubicacion" 
              name="ubicacion"
              required
              class="form-control"
              placeholder="Ej: Sector Norte, Fila 1">
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea 
              id="descripcion"
              [(ngModel)]="galponForm.descripcion" 
              name="descripcion"
              class="form-control"
              rows="3"
              placeholder="Descripción adicional del galpón..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-guardar" [disabled]="guardando">
              {{guardando ? 'Guardando...' : (editandoGalpon ? 'Actualizar' : 'Crear Galpón')}}
            </button>
            <button type="button" class="btn-cancelar" (click)="cancelarEdicion()">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Estadísticas de galpones -->
      <div class="stats-container">
        <div class="stat-card">
          <h4>Total Galpones</h4>
          <span class="stat-number">{{galpones.length}}</span>
        </div>
        <div class="stat-card">
          <h4>Galpones Activos</h4>
          <span class="stat-number">{{galponesActivos}}</span>
        </div>
        <div class="stat-card">
          <h4>Capacidad Total</h4>
          <span class="stat-number">{{capacidadTotal}}</span>
        </div>
        <div class="stat-card">
          <h4>Ocupación</h4>
          <span class="stat-number">{{ocupacionTotal}}%</span>
        </div>
      </div>

      <!-- Lista de galpones -->
      <div class="galpones-grid">
        <div class="galpon-card" *ngFor="let galpon of galpones" [class.inactivo]="!galpon.activo">
          <div class="galpon-header">
            <h3>{{galpon.nombre}}</h3>
            <div class="galpon-status">
              <span class="status-badge" [class.activo]="galpon.activo">
                {{galpon.activo ? 'Activo' : 'Inactivo'}}
              </span>
            </div>
          </div>

          <div class="galpon-info">
            <div class="info-item">
              <strong>📍 Ubicación:</strong> {{galpon.ubicacion}}
            </div>
            <div class="info-item">
              <strong>👥 Capacidad:</strong> {{galpon.cuyesActuales || 0}} / {{galpon.capacidadMaxima}}
            </div>
            <div class="info-item">
              <strong>📊 Ocupación:</strong> 
              <span class="ocupacion-bar">
                <span class="ocupacion-fill" 
                      [style.width.%]="calcularOcupacion(galpon)"></span>
              </span>
              {{calcularOcupacion(galpon)}}%
            </div>
            <div class="info-item" *ngIf="galpon.descripcion">
              <strong>📝 Descripción:</strong> {{galpon.descripcion}}
            </div>
          </div>

          <div class="galpon-actions">
            <button class="btn-editar" (click)="editarGalpon(galpon)">
              ✏️ Editar
            </button>
            <button class="btn-toggle" (click)="toggleEstado(galpon)">
              {{galpon.activo ? '⏸️ Desactivar' : '▶️ Activar'}}
            </button>
            <button class="btn-eliminar" (click)="eliminarGalpon(galpon)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay galpones -->
      <div class="empty-state" *ngIf="galpones.length === 0">
        <div class="empty-icon">🏠</div>
        <h3>No hay galpones registrados</h3>
        <p>Crea el primer galpón para comenzar a organizar tus cuyes</p>
        <button class="btn-nuevo" (click)="mostrarFormulario = true">
          ➕ Crear Primer Galpón
        </button>
      </div>
    </div>
  `,
  styles: [`
    .galpon-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #667eea;
    }

    .header h2 {
      color: #2c3e50;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.8em;
    }

    .btn-nuevo, .btn-guardar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-nuevo:hover, .btn-guardar:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    /* Formulario */
    .form-container {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .form-container h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.3em;
    }

    .galpon-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control {
      padding: 12px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .btn-cancelar {
      background: #6c757d;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-cancelar:hover {
      background: #5a6268;
    }

    /* Estadísticas */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-left: 4px solid #667eea;
    }

    .stat-card h4 {
      color: #6c757d;
      margin: 0 0 10px 0;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #2c3e50;
    }

    /* Grid de galpones */
    .galpones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
    }

    .galpon-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s;
      border: 1px solid #e9ecef;
    }

    .galpon-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .galpon-card.inactivo {
      opacity: 0.7;
      background: #f8f9fa;
    }

    .galpon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f1f3f4;
    }

    .galpon-header h3 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.3em;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.activo {
      background: #d4edda;
      color: #155724;
    }

    .status-badge:not(.activo) {
      background: #f8d7da;
      color: #721c24;
    }

    .galpon-info {
      margin-bottom: 20px;
    }

    .info-item {
      margin-bottom: 12px;
      color: #495057;
      line-height: 1.4;
    }

    .ocupacion-bar {
      display: inline-block;
      width: 60px;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 10px;
      vertical-align: middle;
    }

    .ocupacion-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
      transition: width 0.3s;
    }

    .galpon-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-editar, .btn-toggle, .btn-eliminar {
      flex: 1;
      min-width: 90px;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9em;
      transition: all 0.3s;
    }

    .btn-editar {
      background: #17a2b8;
      color: white;
    }

    .btn-toggle {
      background: #28a745;
      color: white;
    }

    .btn-eliminar {
      background: #dc3545;
      color: white;
    }

    .btn-editar:hover { background: #138496; }
    .btn-toggle:hover { background: #218838; }
    .btn-eliminar:hover { background: #c82333; }

    /* Estado vacío */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }

    .empty-icon {
      font-size: 4em;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin-bottom: 10px;
      color: #495057;
    }

    .empty-state p {
      margin-bottom: 30px;
      font-size: 1.1em;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }

      .galpones-grid {
        grid-template-columns: 1fr;
      }

      .galpon-actions {
        flex-direction: column;
      }

      .btn-editar, .btn-toggle, .btn-eliminar {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .stats-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GalponListComponent implements OnInit {
  galpones: Galpon[] = [];
  mostrarFormulario = false;
  editandoGalpon: Galpon | null = null;
  guardando = false;

  galponForm: Partial<Galpon> = {
    nombre: '',
    capacidadMaxima: 0,
    ubicacion: '',
    descripcion: '',
    activo: true
  };

  ngOnInit() {
    this.cargarGalpones();
  }

  get galponesActivos(): number {
    return this.galpones.filter(g => g.activo).length;
  }

  get capacidadTotal(): number {
    return this.galpones.reduce((total, g) => total + g.capacidadMaxima, 0);
  }

  get ocupacionTotal(): number {
    const total = this.capacidadTotal;
    const ocupados = this.galpones.reduce((sum, g) => sum + (g.cuyesActuales || 0), 0);
    return total > 0 ? Math.round((ocupados / total) * 100) : 0;
  }

  async cargarGalpones() {
    try {
      // Aquí deberás implementar la carga desde Firebase
      this.galpones = [];
      // Ejemplo de código para implementar con Firebase:
      /*
      const galponesRef = collection(this.firestore, 'galpones');
      const q = query(galponesRef, where('activo', '!=', null));
      const querySnapshot = await getDocs(q);
      
      this.galpones = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre,
          capacidadMaxima: data.capacidadMaxima,
          ubicacion: data.ubicacion,
          descripcion: data.descripcion,
          activo: data.activo,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          cuyesActuales: data.cuyesActuales || 0
        } as Galpon;
      });
      */
    } catch (error) {
      console.error('Error al cargar galpones:', error);
    }
  }

  calcularOcupacion(galpon: Galpon): number {
    return galpon.capacidadMaxima > 0 
      ? Math.round(((galpon.cuyesActuales || 0) / galpon.capacidadMaxima) * 100)
      : 0;
  }

  async guardarGalpon() {
    if (!this.galponForm.nombre || !this.galponForm.capacidadMaxima || !this.galponForm.ubicacion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    this.guardando = true;
    
    try {
      // Implementación para Firebase:
      /*
      if (this.editandoGalpon) {
        // Actualizar galpon existente
        const galponRef = doc(this.firestore, 'galpones', this.editandoGalpon.id);
        await updateDoc(galponRef, {
          nombre: this.galponForm.nombre,
          capacidadMaxima: this.galponForm.capacidadMaxima,
          ubicacion: this.galponForm.ubicacion,
          descripcion: this.galponForm.descripcion,
          activo: this.galponForm.activo
        });
      } else {
        // Crear nuevo galpon
        const galponesRef = collection(this.firestore, 'galpones');
        await addDoc(galponesRef, {
          nombre: this.galponForm.nombre,
          capacidadMaxima: this.galponForm.capacidadMaxima,
          ubicacion: this.galponForm.ubicacion,
          descripcion: this.galponForm.descripcion,
          activo: true,
          fechaCreacion: serverTimestamp(),
          cuyesActuales: 0
        });
      }
      */
      
      this.cancelarEdicion();
      await this.cargarGalpones(); // Recargar datos
      alert('Galpón guardado exitosamente');
    } catch (error) {
      console.error('Error guardando galpón:', error);
      alert('Error al guardar el galpón');
    } finally {
      this.guardando = false;
    }
  }

  editarGalpon(galpon: Galpon) {
    this.editandoGalpon = galpon;
    this.galponForm = { ...galpon };
    this.mostrarFormulario = true;
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.editandoGalpon = null;
    this.galponForm = {
      nombre: '',
      capacidadMaxima: 0,
      ubicacion: '',
      descripcion: '',
      activo: true
    };
  }

  async toggleEstado(galpon: Galpon) {
    try {
      // Implementación para Firebase:
      /*
      const galponRef = doc(this.firestore, 'galpones', galpon.id);
      await updateDoc(galponRef, {
        activo: !galpon.activo
      });
      */
      
      // Actualizar localmente mientras tanto
      galpon.activo = !galpon.activo;
      
      // Recargar datos
      await this.cargarGalpones();
    } catch (error) {
      console.error('Error al cambiar estado del galpón:', error);
      alert('Error al actualizar el galpón');
    }
  }

  async eliminarGalpon(galpon: Galpon) {
    if (confirm(`¿Está seguro de eliminar el galpón "${galpon.nombre}"?`)) {
      try {
        // Implementación para Firebase:
        /*
        const galponRef = doc(this.firestore, 'galpones', galpon.id);
        await deleteDoc(galponRef);
        */
        
        // Recargar datos
        await this.cargarGalpones();
      } catch (error) {
        console.error('Error al eliminar galpón:', error);
        alert('Error al eliminar el galpón');
      }
    }
  }
}
