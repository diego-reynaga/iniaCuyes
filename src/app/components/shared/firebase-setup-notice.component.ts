import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firebase-setup-notice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="setup-notice">
      <div class="notice-content">
        <div class="notice-icon">🔥</div>
        <h3>Configuración de Firebase Requerida</h3>
        <p>Para usar la aplicación completamente, necesitas configurar Firebase:</p>
        
        <ol class="setup-steps">
          <li>Ve a <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a></li>
          <li>Crea un nuevo proyecto llamado "inia-cuyes"</li>
          <li>Configura Authentication (Email/Password)</li>
          <li>Crea Firestore Database</li>
          <li>Copia tu configuración a <code>src/environments/firebase.config.ts</code></li>
        </ol>

        <div class="notice-actions">
          <a href="https://console.firebase.google.com/" target="_blank" class="btn-firebase">
            Ir a Firebase Console
          </a>
          <button (click)="hideNotice()" class="btn-secondary">
            Continuar sin Firebase (modo demo)
          </button>
        </div>

        <div class="demo-note">
          <strong>Modo Demo:</strong> La aplicación funcionará con datos ficticios para demostración.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .setup-notice {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
    }

    .notice-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .notice-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .setup-steps {
      text-align: left;
      margin: 1.5rem 0;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    .setup-steps li {
      margin-bottom: 0.5rem;
    }

    code {
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
    }

    .notice-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 1.5rem 0;
    }

    .btn-firebase {
      background: #ff6b35;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-firebase:hover {
      background: #e55a2b;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .demo-note {
      background: #fff3cd;
      color: #856404;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    a {
      color: #007bff;
    }
  `]
})
export class FirebaseSetupNoticeComponent {
  hideNotice(): void {
    localStorage.setItem('inia-firebase-notice-dismissed', 'true');
    // Emitir evento para que el componente padre maneje el cierre
    window.dispatchEvent(new CustomEvent('firebase-notice-dismissed'));
  }
}
