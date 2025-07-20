import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario, RolUsuario } from '../models/cuy.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  
  user$ = user(this.auth);
  
  constructor() { }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, userData: Partial<Usuario>): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Crear documento de usuario en Firestore
      const usuario: Usuario = {
        uid: result.user.uid,
        email: email,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        rol: userData.rol || RolUsuario.VISITANTE,
        fechaCreacion: new Date(),
        activo: true
      };

      await setDoc(doc(this.firestore, 'usuarios', result.user.uid), usuario);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<Usuario | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'usuarios', uid));
      if (userDoc.exists()) {
        return userDoc.data() as Usuario;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Métodos para administradores
  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    try {
      const usuariosCollection = collection(this.firestore, 'usuarios');
      const querySnapshot = await getDocs(usuariosCollection);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      } as Usuario));
    } catch (error) {
      throw error;
    }
  }

  async crearUsuarioAdmin(userData: Omit<Usuario, 'uid' | 'fechaCreacion'>, password: string): Promise<void> {
    try {
      // Solo los administradores pueden crear otros usuarios
      const currentUser = await this.getCurrentUserProfile();
      if (!currentUser || currentUser.rol !== RolUsuario.ADMIN) {
        throw new Error('No tienes permisos para crear usuarios');
      }

      const result = await createUserWithEmailAndPassword(this.auth, userData.email, password);
      
      const usuario: Usuario = {
        uid: result.user.uid,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        fechaCreacion: new Date(),
        activo: true
      };

      await setDoc(doc(this.firestore, 'usuarios', result.user.uid), usuario);
    } catch (error) {
      throw error;
    }
  }

  async actualizarRolUsuario(uid: string, nuevoRol: RolUsuario): Promise<void> {
    try {
      const currentUser = await this.getCurrentUserProfile();
      if (!currentUser || currentUser.rol !== RolUsuario.ADMIN) {
        throw new Error('No tienes permisos para cambiar roles');
      }

      const userRef = doc(this.firestore, 'usuarios', uid);
      await updateDoc(userRef, { rol: nuevoRol });
    } catch (error) {
      throw error;
    }
  }

  async desactivarUsuario(uid: string): Promise<void> {
    try {
      const currentUser = await this.getCurrentUserProfile();
      if (!currentUser || currentUser.rol !== RolUsuario.ADMIN) {
        throw new Error('No tienes permisos para desactivar usuarios');
      }

      const userRef = doc(this.firestore, 'usuarios', uid);
      await updateDoc(userRef, { activo: false });
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUserProfile(): Promise<Usuario | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;
      
      return await this.getUserProfile(currentUser.uid);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  }
}
