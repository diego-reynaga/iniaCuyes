import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RolUsuario } from '../../models/cuy.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="header">
          <h1>Registro</h1>
          <h2>INIA Cuyes - Sistema de Administración</h2>
        </div>
        
        <form (ngSubmit)="onRegister()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input 
                type="text" 
                id="nombre"
                [(ngModel)]="userData.nombre" 
                name="nombre"
                required
                class="form-control"
                placeholder="Ingrese su nombre">
            </div>
            
            <div class="form-group">
              <label for="apellido">Apellido:</label>
              <input 
                type="text" 
                id="apellido"
                [(ngModel)]="userData.apellido" 
                name="apellido"
                required
                class="form-control"
                placeholder="Ingrese su apellido">
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="email" 
              name="email"
              required
              class="form-control"
              placeholder="Ingrese su email">
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password" 
              name="password"
              required
              minlength="6"
              class="form-control"
              placeholder="Mínimo 6 caracteres">
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña:</label>
            <input 
              type="password" 
              id="confirmPassword"
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              required
              class="form-control"
              placeholder="Confirme su contraseña">
          </div>
          
          <!-- El rol es asignado automáticamente como VISITANTE -->
          <!-- Solo los administradores pueden cambiar roles desde el panel de administración -->
          
          <button 
            type="submit" 
            [disabled]="loading"
            class="btn-register">
            {{loading ? 'Registrando...' : 'Registrarse'}}
          </button>
          
          <div class="login-link">
            <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
          </div>
        </form>
        
        <div *ngIf="errorMessage" class="error-message">
          {{errorMessage}}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          {{successMessage}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.2em;
      font-weight: bold;
    }

    .header h2 {
      color: #7f8c8d;
      margin: 5px 0 0 0;
      font-size: 1em;
      font-weight: normal;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    select.form-control {
      height: 48px;
    }

    .btn-register {
      width: 100%;
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-bottom: 20px;
    }

    .btn-register:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .btn-register:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
    }

    .login-link p {
      margin: 0;
      color: #7f8c8d;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    .error-message {
      background: #e74c3c;
      color: white;
      padding: 10px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: center;
    }

    .success-message {
      background: #27ae60;
      color: white;
      padding: 10px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: center;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  userData = {
    nombre: '',
    apellido: '',
    rol: RolUsuario.VISITANTE
  };

  roles = RolUsuario;

  async onRegister(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.register(this.email, this.password, this.userData);
      this.successMessage = 'Registro exitoso. Redirigiendo...';
      
      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.userData.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }

    if (!this.userData.apellido.trim()) {
      this.errorMessage = 'El apellido es requerido';
      return false;
    }

    if (!this.email) {
      this.errorMessage = 'El email es requerido';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'La contraseña es requerida';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    // El rol siempre será VISITANTE por defecto

    return true;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      default:
        return 'Error al registrar usuario. Intente nuevamente';
    }
  }
}
