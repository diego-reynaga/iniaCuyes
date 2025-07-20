import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Cuy, Galpon } from '../models/cuy.model';

@Injectable({
  providedIn: 'root'
})
export class CuyService {
  private firestore: Firestore = inject(Firestore);
  
  private cuyesCollection = collection(this.firestore, 'cuyes');
  private galponesCollection = collection(this.firestore, 'galpones');

  constructor() { }

  // Operaciones CRUD para Cuyes
  async agregarCuy(cuy: Cuy): Promise<string> {
    try {
      const docRef = await addDoc(this.cuyesCollection, {
        ...cuy,
        fechaNacimiento: cuy.fechaNacimiento,
        fechaRegistro: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async obtenerCuyes(): Promise<Cuy[]> {
    try {
      const q = query(this.cuyesCollection, where('activo', '==', true), orderBy('fechaRegistro', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cuy));
    } catch (error) {
      throw error;
    }
  }

  async obtenerCuyPorId(id: string): Promise<Cuy | null> {
    try {
      const docRef = doc(this.firestore, 'cuyes', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Cuy;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async actualizarCuy(id: string, cuy: Partial<Cuy>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'cuyes', id);
      await updateDoc(docRef, cuy);
    } catch (error) {
      throw error;
    }
  }

  async eliminarCuy(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'cuyes', id);
      await updateDoc(docRef, { activo: false });
    } catch (error) {
      throw error;
    }
  }

  // Búsquedas específicas
  async buscarCuyesPorGalpon(galpon: string): Promise<Cuy[]> {
    try {
      const q = query(
        this.cuyesCollection, 
        where('galpon', '==', galpon),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cuy));
    } catch (error) {
      throw error;
    }
  }

  async buscarCuyesPorRaza(raza: string): Promise<Cuy[]> {
    try {
      const q = query(
        this.cuyesCollection, 
        where('raza', '==', raza),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cuy));
    } catch (error) {
      throw error;
    }
  }

  // Operaciones para Galpones
  async agregarGalpon(galpon: Galpon): Promise<string> {
    try {
      const docRef = await addDoc(this.galponesCollection, {
        ...galpon,
        fechaCreacion: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async obtenerGalpones(): Promise<Galpon[]> {
    try {
      const q = query(this.galponesCollection, where('activo', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Galpon));
    } catch (error) {
      throw error;
    }
  }

  // Estadísticas
  async obtenerEstadisticas(): Promise<any> {
    try {
      const cuyes = await this.obtenerCuyes();
      const galpones = await this.obtenerGalpones();
      
      const estadisticas = {
        totalCuyes: cuyes.length,
        totalGalpones: galpones.length,
        cuyesPorRaza: this.contarPorRaza(cuyes),
        cuyesPorGalpon: this.contarPorGalpon(cuyes),
        cuyesPorSexo: this.contarPorSexo(cuyes)
      };
      
      return estadisticas;
    } catch (error) {
      throw error;
    }
  }

  private contarPorRaza(cuyes: Cuy[]): { [key: string]: number } {
    return cuyes.reduce((acc, cuy) => {
      acc[cuy.raza] = (acc[cuy.raza] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  private contarPorGalpon(cuyes: Cuy[]): { [key: string]: number } {
    return cuyes.reduce((acc, cuy) => {
      acc[cuy.galpon] = (acc[cuy.galpon] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  private contarPorSexo(cuyes: Cuy[]): { [key: string]: number } {
    return cuyes.reduce((acc, cuy) => {
      acc[cuy.sexo] = (acc[cuy.sexo] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }
}
