import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="header">
          <h1>INIA Cuyes</h1>
          <h2>Sistema de Administración</h2>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
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
              class="form-control"
              placeholder="Ingrese su contraseña">
          </div>
          
          <button 
            type="submit" 
            [disabled]="loading"
            class="btn-login">
            {{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}}
          </button>
          
          <div class="register-link">
            <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
          </div>
          
          <div class="public-access">
            <a routerLink="/public" class="btn-public">Acceso Público</a>
          </div>
        </form>
        
        <div *ngIf="errorMessage" class="error-message">
          {{errorMessage}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.5em;
      font-weight: bold;
    }

    .header h2 {
      color: #7f8c8d;
      margin: 5px 0 0 0;
      font-size: 1.1em;
      font-weight: normal;
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

    .btn-login {
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

    .btn-login:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .btn-login:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .register-link {
      text-align: center;
      margin-bottom: 20px;
    }

    .register-link p {
      margin: 0;
      color: #7f8c8d;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .public-access {
      text-align: center;
      border-top: 1px solid #ecf0f1;
      padding-top: 20px;
    }

    .btn-public {
      display: inline-block;
      padding: 10px 20px;
      background: #27ae60;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .btn-public:hover {
      background: #229954;
    }

    .error-message {
      background: #e74c3c;
      color: white;
      padding: 10px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intente más tarde';
      default:
        return 'Error al iniciar sesión. Intente nuevamente';
    }
  }
}
