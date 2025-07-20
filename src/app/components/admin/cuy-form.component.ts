import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CuyService } from '../../services/cuy.service';
import { Cuy, RazaCuy, SexoCuy, OrigenCuy, EstadoSalud, Galpon } from '../../models/cuy.model';

@Component({
  selector: 'app-cuy-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{isEditMode ? 'Editar Cuy' : 'Registrar Nuevo Cuy'}}</h2>
        <button (click)="volver()" class="btn-back">
          ← Volver a la Lista
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="cuy-form" #cuyForm="ngForm">
        <div class="form-section">
          <h3>Información Básica</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="numeroIdentificacion">Número de Identificación *</label>
              <input 
                type="text" 
                id="numeroIdentificacion"
                name="numeroIdentificacion"
                [(ngModel)]="cuy.numeroIdentificacion"
                required
                class="form-control"
                placeholder="Ej: CUY001"
                [readonly]="isEditMode">
            </div>

            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input 
                type="text" 
                id="nombre"
                name="nombre"
                [(ngModel)]="cuy.nombre"
                class="form-control"
                placeholder="Nombre del cuy (opcional)">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="raza">Raza *</label>
              <select 
                id="raza"
                name="raza"
                [(ngModel)]="cuy.raza"
                required
                class="form-control">
                <option value="">Seleccione una raza</option>
                <option [value]="raza" *ngFor="let raza of razas">{{raza}}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="sexo">Sexo *</label>
              <select 
                id="sexo"
                name="sexo"
                [(ngModel)]="cuy.sexo"
                required
                class="form-control">
                <option value="">Seleccione el sexo</option>
                <option [value]="sexo" *ngFor="let sexo of sexos">{{sexo}}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="fechaNacimiento">Fecha de Nacimiento *</label>
              <input 
                type="date" 
                id="fechaNacimiento"
                name="fechaNacimiento"
                [(ngModel)]="fechaNacimientoStr"
                required
                class="form-control"
                [max]="today">
            </div>

            <div class="form-group">
              <label for="peso">Peso (kg) *</label>
              <input 
                type="number" 
                id="peso"
                name="peso"
                [(ngModel)]="cuy.peso"
                required
                min="0"
                step="0.01"
                class="form-control"
                placeholder="Ej: 0.8">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="color">Color *</label>
              <input 
                type="text" 
                id="color"
                name="color"
                [(ngModel)]="cuy.color"
                required
                class="form-control"
                placeholder="Descripción del color">
            </div>

            <div class="form-group">
              <label for="galpon">Galpón *</label>
              <select 
                id="galpon"
                name="galpon"
                [(ngModel)]="cuy.galpon"
                required
                class="form-control">
                <option value="">Seleccione un galpón</option>
                <option [value]="galpon.nombre" *ngFor="let galpon of galpones">
                  {{galpon.nombre}} ({{galpon.tipo}})
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Origen y Estado</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="origen">Origen *</label>
              <select 
                id="origen"
                name="origen"
                [(ngModel)]="cuy.origen"
                required
                class="form-control">
                <option value="">Seleccione el origen</option>
                <option [value]="origen" *ngFor="let origen of origenes">{{origen}}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="estadoSalud">Estado de Salud *</label>
              <select 
                id="estadoSalud"
                name="estadoSalud"
                [(ngModel)]="cuy.estadoSalud"
                required
                class="form-control">
                <option value="">Seleccione el estado</option>
                <option [value]="estado" *ngFor="let estado of estados">{{estado}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Genealogía</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="padre">Padre</label>
              <select 
                id="padre"
                name="padre"
                [(ngModel)]="cuy.padre"
                class="form-control">
                <option value="">Sin padre registrado</option>
                <option [value]="macho.id" *ngFor="let macho of machos">
                  {{macho.numeroIdentificacion}} - {{macho.nombre || 'Sin nombre'}}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="madre">Madre</label>
              <select 
                id="madre"
                name="madre"
                [(ngModel)]="cuy.madre"
                class="form-control">
                <option value="">Sin madre registrada</option>
                <option [value]="hembra.id" *ngFor="let hembra of hembras">
                  {{hembra.numeroIdentificacion}} - {{hembra.nombre || 'Sin nombre'}}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row" *ngIf="cuy.padre || cuy.madre">
            <div class="form-group">
              <label for="generacion">Generación</label>
              <input 
                type="number" 
                id="generacion"
                name="generacion"
                [(ngModel)]="generacion"
                min="1"
                class="form-control"
                placeholder="Número de generación">
            </div>

            <div class="form-group">
              <label for="pureza">Pureza (%)</label>
              <input 
                type="number" 
                id="pureza"
                name="pureza"
                [(ngModel)]="pureza"
                min="0"
                max="100"
                class="form-control"
                placeholder="Porcentaje de pureza">
            </div>
          </div>
        </div>

        <div class="form-section" *ngIf="cuy.sexo === 'Hembra'">
          <h3>Información de Producción</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="camadas">Número de Camadas</label>
              <input 
                type="number" 
                id="camadas"
                name="camadas"
                [(ngModel)]="camadas"
                min="0"
                class="form-control"
                placeholder="0">
            </div>

            <div class="form-group">
              <label for="cantidadCrias">Cantidad de Crías</label>
              <input 
                type="number" 
                id="cantidadCrias"
                name="cantidadCrias"
                [(ngModel)]="cantidadCrias"
                min="0"
                class="form-control"
                placeholder="0">
            </div>
          </div>

          <div class="form-row" *ngIf="camadas > 0">
            <div class="form-group">
              <label for="ultimaCamada">Última Camada</label>
              <input 
                type="date" 
                id="ultimaCamada"
                name="ultimaCamada"
                [(ngModel)]="ultimaCamadaStr"
                class="form-control"
                [max]="today">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Observaciones</h3>
          
          <div class="form-group">
            <label for="observaciones">Observaciones Adicionales</label>
            <textarea 
              id="observaciones"
              name="observaciones"
              [(ngModel)]="cuy.observaciones"
              class="form-control"
              rows="4"
              placeholder="Información adicional sobre el cuy..."></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="volver()" class="btn-secondary">
            Cancelar
          </button>
          
          <button 
            type="submit" 
            [disabled]="!cuyForm.form.valid || loading"
            class="btn-primary">
            {{loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Registrar')}}
          </button>
        </div>
      </form>

      <div *ngIf="errorMessage" class="error-message">
        {{errorMessage}}
      </div>

      <div *ngIf="successMessage" class="success-message">
        {{successMessage}}
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #ecf0f1;
    }

    .form-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-back {
      background: #95a5a6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
      text-decoration: none;
    }

    .btn-back:hover {
      background: #7f8c8d;
    }

    .cuy-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      font-size: 1.2rem;
      border-left: 4px solid #3498db;
      padding-left: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-control:invalid {
      border-color: #e74c3c;
    }

    .form-control[readonly] {
      background-color: #f8f9fa;
      color: #6c757d;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #ecf0f1;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-primary:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .error-message {
      background: #e74c3c;
      color: white;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      text-align: center;
    }

    .success-message {
      background: #27ae60;
      color: white;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .form-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CuyFormComponent implements OnInit {
  private cuyService = inject(CuyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cuy: Cuy = this.initializeCuy();
  galpones: Galpon[] = [];
  machos: Cuy[] = [];
  hembras: Cuy[] = [];
  
  razas = Object.values(RazaCuy);
  sexos = Object.values(SexoCuy);
  origenes = Object.values(OrigenCuy);
  estados = Object.values(EstadoSalud);
  
  isEditMode = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  fechaNacimientoStr = '';
  ultimaCamadaStr = '';
  today = '';
  
  // Propiedades auxiliares para formularios
  generacion = 1;
  pureza = 100;
  camadas = 0;
  cantidadCrias = 0;

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.loadData();
    this.checkEditMode();
  }

  private initializeCuy(): Cuy {
    return {
      numeroIdentificacion: '',
      nombre: '',
      raza: '' as RazaCuy,
      sexo: '' as SexoCuy,
      fechaNacimiento: new Date(),
      peso: 0,
      color: '',
      galpon: '',
      origen: '' as OrigenCuy,
      estadoSalud: '' as EstadoSalud,
      observaciones: '',
      fechaRegistro: new Date(),
      genealogia: {
        generacion: 1,
        pureza: 100
      },
      produccion: {
        camadas: 0,
        cantidadCrias: 0
      },
      activo: true
    };
  }

  async loadData(): Promise<void> {
    try {
      const [galpones, cuyes] = await Promise.all([
        this.cuyService.obtenerGalpones(),
        this.cuyService.obtenerCuyes()
      ]);
      
      this.galpones = galpones;
      this.machos = cuyes.filter(cuy => cuy.sexo === SexoCuy.MACHO);
      this.hembras = cuyes.filter(cuy => cuy.sexo === SexoCuy.HEMBRA);
    } catch (error) {
      console.error('Error loading data:', error);
      this.errorMessage = 'Error al cargar los datos';
    }
  }

  async checkEditMode(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      try {
        const cuy = await this.cuyService.obtenerCuyPorId(id);
        if (cuy) {
          this.cuy = cuy;
          this.fechaNacimientoStr = new Date(cuy.fechaNacimiento).toISOString().split('T')[0];
          
          // Sincronizar propiedades auxiliares
          if (cuy.genealogia) {
            this.generacion = cuy.genealogia.generacion || 1;
            this.pureza = cuy.genealogia.pureza || 100;
          }
          
          if (cuy.produccion) {
            this.camadas = cuy.produccion.camadas || 0;
            this.cantidadCrias = cuy.produccion.cantidadCrias || 0;
            if (cuy.produccion.ultimaCamada) {
              this.ultimaCamadaStr = new Date(cuy.produccion.ultimaCamada).toISOString().split('T')[0];
            }
          }
        } else {
          this.errorMessage = 'Cuy no encontrado';
        }
      } catch (error) {
        console.error('Error loading cuy:', error);
        this.errorMessage = 'Error al cargar los datos del cuy';
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Convertir fechas
      this.cuy.fechaNacimiento = new Date(this.fechaNacimientoStr);
      
      // Sincronizar genealogía
      if (this.cuy.padre || this.cuy.madre) {
        this.cuy.genealogia = {
          generacion: this.generacion,
          pureza: this.pureza
        };
      }
      
      // Sincronizar producción
      if (this.cuy.sexo === SexoCuy.HEMBRA) {
        this.cuy.produccion = {
          camadas: this.camadas,
          cantidadCrias: this.cantidadCrias
        };
        if (this.ultimaCamadaStr) {
          this.cuy.produccion.ultimaCamada = new Date(this.ultimaCamadaStr);
        }
      }

      if (this.isEditMode && this.cuy.id) {
        await this.cuyService.actualizarCuy(this.cuy.id, this.cuy);
        this.successMessage = 'Cuy actualizado exitosamente';
      } else {
        await this.cuyService.agregarCuy(this.cuy);
        this.successMessage = 'Cuy registrado exitosamente';
      }

      setTimeout(() => {
        this.router.navigate(['/admin/cuyes']);
      }, 2000);
    } catch (error) {
      console.error('Error saving cuy:', error);
      this.errorMessage = 'Error al guardar el cuy';
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.cuy.numeroIdentificacion.trim()) {
      this.errorMessage = 'El número de identificación es requerido';
      return false;
    }

    if (!this.fechaNacimientoStr) {
      this.errorMessage = 'La fecha de nacimiento es requerida';
      return false;
    }

    if (this.cuy.peso <= 0) {
      this.errorMessage = 'El peso debe ser mayor a 0';
      return false;
    }

    return true;
  }

  volver(): void {
    this.router.navigate(['/admin/cuyes']);
  }
}
