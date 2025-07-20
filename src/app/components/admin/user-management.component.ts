import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario, RolUsuario } from '../../models/cuy.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-management-container">
      <div class="header">
        <h2>Gestión de Usuarios</h2>
        <button (click)="showCreateForm = !showCreateForm" class="btn-primary">
          {{showCreateForm ? 'Cancelar' : '+ Crear Usuario'}}
        </button>
      </div>

      <!-- Formulario para crear usuario -->
      <div class="create-user-form" *ngIf="showCreateForm">
        <h3>Crear Nuevo Usuario</h3>
        <form (ngSubmit)="crearUsuario()" #userForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre *</label>
              <input 
                type="text" 
                id="nombre"
                name="nombre"
                [(ngModel)]="nuevoUsuario.nombre"
                required
                class="form-control">
            </div>

            <div class="form-group">
              <label for="apellido">Apellido *</label>
              <input 
                type="text" 
                id="apellido"
                name="apellido"
                [(ngModel)]="nuevoUsuario.apellido"
                required
                class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email"
                name="email"
                [(ngModel)]="nuevoUsuario.email"
                required
                class="form-control">
            </div>

            <div class="form-group">
              <label for="password">Contraseña *</label>
              <input 
                type="password" 
                id="password"
                name="password"
                [(ngModel)]="passwordTemp"
                required
                minlength="6"
                class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="rol">Rol *</label>
              <select 
                id="rol"
                name="rol"
                [(ngModel)]="nuevoUsuario.rol"
                required
                class="form-control">
                <option value="">Seleccione un rol</option>
                <option [value]="RolUsuario.ADMIN">Administrador</option>
                <option [value]="RolUsuario.TECNICO">Técnico</option>
                <option [value]="RolUsuario.VISITANTE">Visitante</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" (click)="cancelarCreacion()" class="btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="!userForm.form.valid || creandoUsuario"
              class="btn-primary">
              {{creandoUsuario ? 'Creando...' : 'Crear Usuario'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de usuarios -->
      <div class="users-list">
        <h3>Usuarios del Sistema</h3>
        <div class="users-grid">
          <div class="user-card" *ngFor="let usuario of usuarios">
            <div class="user-header">
              <div class="user-info">
                <h4>{{usuario.nombre}} {{usuario.apellido}}</h4>
                <p class="user-email">{{usuario.email}}</p>
              </div>
              <span class="user-role" [class]="getRoleClass(usuario.rol)">
                {{getRoleLabel(usuario.rol)}}
              </span>
            </div>

            <div class="user-details">
              <div class="detail-item">
                <span class="label">Fecha de registro:</span>
                <span class="value">{{formatearFecha(usuario.fechaCreacion)}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value status" [class]="usuario.activo ? 'active' : 'inactive'">
                  {{usuario.activo ? 'Activo' : 'Inactivo'}}
                </span>
              </div>
            </div>

            <div class="user-actions" *ngIf="usuario.uid !== currentUserUid">
              <select 
                [(ngModel)]="usuario.rol"
                (change)="cambiarRol(usuario)"
                class="role-select">
                <option [value]="RolUsuario.ADMIN">Administrador</option>
                <option [value]="RolUsuario.TECNICO">Técnico</option>
                <option [value]="RolUsuario.VISITANTE">Visitante</option>
              </select>

              <button 
                (click)="toggleUsuarioActivo(usuario)"
                [class]="usuario.activo ? 'btn-warning' : 'btn-success'">
                {{usuario.activo ? 'Desactivar' : 'Activar'}}
              </button>
            </div>

            <div class="current-user-badge" *ngIf="usuario.uid === currentUserUid">
              <span>👤 Tu cuenta</span>
            </div>
          </div>
        </div>

        <div class="no-users" *ngIf="usuarios.length === 0 && !loading">
          <p>No hay usuarios registrados.</p>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{errorMessage}}
      </div>

      <div class="success-message" *ngIf="successMessage">
        {{successMessage}}
      </div>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #ecf0f1;
    }

    .header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-primary,
    .btn-secondary,
    .btn-warning,
    .btn-success {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      text-decoration: none;
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

    .btn-warning {
      background: #f39c12;
      color: white;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    }

    .btn-warning:hover {
      background: #e67e22;
    }

    .btn-success {
      background: #27ae60;
      color: white;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    }

    .btn-success:hover {
      background: #2ecc71;
    }

    .create-user-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .create-user-form h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #2c3e50;
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

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .users-list {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .users-list h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .user-card {
      background: #f8f9fa;
      border: 1px solid #ecf0f1;
      border-radius: 10px;
      padding: 1.5rem;
      position: relative;
      transition: transform 0.3s;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .user-info h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .user-email {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .user-role {
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .user-role.admin {
      background: #e74c3c;
      color: white;
    }

    .user-role.tecnico {
      background: #f39c12;
      color: white;
    }

    .user-role.visitante {
      background: #95a5a6;
      color: white;
    }

    .user-details {
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .detail-item .label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .detail-item .value {
      color: #2c3e50;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .status.active {
      color: #27ae60;
    }

    .status.inactive {
      color: #e74c3c;
    }

    .user-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .role-select {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      font-size: 0.85rem;
    }

    .current-user-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #3498db;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
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

    .no-users {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .users-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .user-actions {
        flex-direction: column;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  private authService = inject(AuthService);

  usuarios: Usuario[] = [];
  nuevoUsuario: Partial<Usuario> = {};
  passwordTemp = '';
  showCreateForm = false;
  loading = false;
  creandoUsuario = false;
  errorMessage = '';
  successMessage = '';
  currentUserUid = '';

  RolUsuario = RolUsuario;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsuarios();
  }

  async loadCurrentUser(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserUid = currentUser.uid;
    }
  }

  async loadUsuarios(): Promise<void> {
    this.loading = true;
    try {
      this.usuarios = await this.authService.obtenerTodosLosUsuarios();
    } catch (error) {
      console.error('Error loading usuarios:', error);
      this.errorMessage = 'Error al cargar los usuarios';
    } finally {
      this.loading = false;
    }
  }

  async crearUsuario(): Promise<void> {
    this.creandoUsuario = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.crearUsuarioAdmin(this.nuevoUsuario as Omit<Usuario, 'uid' | 'fechaCreacion'>, this.passwordTemp);
      this.successMessage = 'Usuario creado exitosamente';
      this.cancelarCreacion();
      await this.loadUsuarios();
    } catch (error: any) {
      console.error('Error creating user:', error);
      this.errorMessage = error.message || 'Error al crear el usuario';
    } finally {
      this.creandoUsuario = false;
    }
  }

  cancelarCreacion(): void {
    this.showCreateForm = false;
    this.nuevoUsuario = {};
    this.passwordTemp = '';
  }

  async cambiarRol(usuario: Usuario): Promise<void> {
    try {
      await this.authService.actualizarRolUsuario(usuario.uid, usuario.rol);
      this.successMessage = `Rol actualizado para ${usuario.nombre}`;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error: any) {
      console.error('Error updating role:', error);
      this.errorMessage = error.message || 'Error al actualizar el rol';
      setTimeout(() => this.errorMessage = '', 3000);
      await this.loadUsuarios(); // Recargar para revertir cambios
    }
  }

  async toggleUsuarioActivo(usuario: Usuario): Promise<void> {
    try {
      if (usuario.activo) {
        await this.authService.desactivarUsuario(usuario.uid);
        this.successMessage = `Usuario ${usuario.nombre} desactivado`;
      } else {
        // Para reactivar, necesitaríamos un método adicional
        this.errorMessage = 'Funcionalidad de reactivación no disponible';
      }
      await this.loadUsuarios();
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3000);
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      this.errorMessage = error.message || 'Error al cambiar el estado del usuario';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  getRoleClass(rol: RolUsuario): string {
    return rol.toLowerCase();
  }

  getRoleLabel(rol: RolUsuario): string {
    switch (rol) {
      case RolUsuario.ADMIN:
        return 'Administrador';
      case RolUsuario.TECNICO:
        return 'Técnico';
      case RolUsuario.VISITANTE:
        return 'Visitante';
      default:
        return rol;
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
