import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario, Cuy, Galpon, Comentario, RolUsuario, RazaCuy, SexoCuy, OrigenCuy, EstadoSalud, TipoGalpon } from '../models/cuy.model';

// Servicio mock para desarrollo sin Firebase real
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  // Mock de usuarios
  private mockUsuarios: Usuario[] = [
    {
      uid: 'admin-123',
      nombre: 'Administrador',
      apellido: 'INIA',
      email: 'admin@inia.gob.pe',
      rol: RolUsuario.ADMIN,
      activo: true,
      fechaCreacion: new Date()
    }
  ];

  // Mock de cuyes
  private mockCuyes: Cuy[] = [
    {
      id: 'cuy-001',
      numeroIdentificacion: 'CUY-001',
      raza: RazaCuy.PERU,
      sexo: SexoCuy.MACHO,
      fechaNacimiento: new Date('2024-01-15'),
      peso: 850,
      color: 'Blanco con manchas marrones',
      galpon: 'galpon-001',
      origen: OrigenCuy.NACIMIENTO_PROPIO,
      estadoSalud: EstadoSalud.EXCELENTE,
      observaciones: 'Cuy reproductor de buena genética',
      fechaRegistro: new Date(),
      activo: true
    },
    {
      id: 'cuy-002', 
      numeroIdentificacion: 'CUY-002',
      raza: RazaCuy.ANDINA,
      sexo: SexoCuy.HEMBRA,
      fechaNacimiento: new Date('2024-02-10'),
      peso: 750,
      color: 'Marrón claro',
      galpon: 'galpon-001',
      origen: OrigenCuy.NACIMIENTO_PROPIO,
      estadoSalud: EstadoSalud.BUENO,
      observaciones: 'Excelente para reproducción',
      fechaRegistro: new Date(),
      activo: true
    }
  ];

  // Mock de galpones
  private mockGalpones: Galpon[] = [
    {
      id: 'galpon-001',
      nombre: 'Galpón Principal A',
      capacidad: 100,
      ubicacion: 'Sector Norte',
      tipo: TipoGalpon.REPRODUCTORES,
      descripcion: 'Galpón principal para reproductores',
      activo: true,
      fechaCreacion: new Date()
    }
  ];

  // Mock de comentarios
  private mockComentarios: Comentario[] = [
    {
      id: 'comentario-001',
      texto: 'Excelente trabajo del INIA en el desarrollo de cuyes mejorados.',
      autorNombre: 'Juan Pérez',
      autorEmail: 'juan@email.com',
      fecha: new Date(),
      moderado: true,
      activo: true
    }
  ];

  // Métodos para obtener datos mock
  getMockCuyes(): Observable<Cuy[]> {
    return of(this.mockCuyes);
  }

  getMockGalpones(): Observable<Galpon[]> {
    return of(this.mockGalpones);
  }

  getMockUsuarios(): Observable<Usuario[]> {
    return of(this.mockUsuarios);
  }

  getMockComentarios(): Observable<Comentario[]> {
    return of(this.mockComentarios);
  }

  getMockEstadisticas(): Observable<any> {
    return of({
      totalCuyes: this.mockCuyes.length,
      totalGalpones: this.mockGalpones.length,
      cuyesPorSexo: {
        'Macho': this.mockCuyes.filter(c => c.sexo === 'Macho').length,
        'Hembra': this.mockCuyes.filter(c => c.sexo === 'Hembra').length
      },
      cuyesPorRaza: {
        'Perú': this.mockCuyes.filter(c => c.raza === 'Perú').length,
        'Andina': this.mockCuyes.filter(c => c.raza === 'Andina').length,
        'Inti': this.mockCuyes.filter(c => c.raza === 'Inti').length
      }
    });
  }

  // Simular operaciones CRUD
  addMockCuy(cuy: Omit<Cuy, 'id' | 'fechaRegistro'>): Observable<string> {
    const newCuy: Cuy = {
      ...cuy,
      id: 'cuy-' + Date.now(),
      fechaRegistro: new Date()
    };
    this.mockCuyes.push(newCuy);
    return of(newCuy.id!);
  }

  addMockComentario(comentario: Omit<Comentario, 'id' | 'fecha'>): Observable<string> {
    const newComentario: Comentario = {
      ...comentario,
      id: 'comentario-' + Date.now(),
      fecha: new Date(),
      moderado: false,
      activo: false
    };
    this.mockComentarios.push(newComentario);
    return of(newComentario.id!);
  }

  // Verificar si Firebase está disponible
  isFirebaseAvailable(): boolean {
    // Verificar si la configuración contiene datos reales
    return false; // Por defecto usar mock para desarrollo
  }
}
