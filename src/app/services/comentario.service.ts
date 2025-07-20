import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from '@angular/fire/firestore';
import { Comentario } from '../models/cuy.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private firestore: Firestore = inject(Firestore);
  private comentariosCollection = collection(this.firestore, 'comentarios');

  constructor() { }

  async agregarComentario(comentario: Comentario): Promise<string> {
    try {
      const docRef = await addDoc(this.comentariosCollection, {
        ...comentario,
        fecha: new Date(),
        activo: true,
        moderado: false
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async obtenerComentarios(): Promise<Comentario[]> {
    try {
      const q = query(
        this.comentariosCollection, 
        where('activo', '==', true),
        orderBy('fecha', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comentario));
    } catch (error) {
      throw error;
    }
  }

  async obtenerComentariosPendientes(): Promise<Comentario[]> {
    try {
      const q = query(
        this.comentariosCollection,
        where('moderado', '==', false),
        where('activo', '==', true),
        orderBy('fecha', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comentario));
    } catch (error) {
      throw error;
    }
  }

  async moderarComentario(id: string, aprobado: boolean): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'comentarios', id);
      await updateDoc(docRef, {
        moderado: true,
        activo: aprobado
      });
    } catch (error) {
      throw error;
    }
  }

  async eliminarComentario(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'comentarios', id);
      await updateDoc(docRef, {
        activo: false
      });
    } catch (error) {
      throw error;
    }
  }
}
