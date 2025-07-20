# Guía de Implementación de Firebase Database

Este documento proporciona las instrucciones paso a paso para implementar Firebase Firestore en el proyecto INIA Cuyes.

## Preparación de Firebase

1. **Configuración de Firebase**:
   - La configuración básica de Firebase ya está implementada en `firebase.config.ts`
   - Asegúrate de que la API Key y demás configuraciones son correctas

2. **Habilitación de Firestore**:
   - En la consola de Firebase, ve a "Firestore Database"
   - Haz clic en "Crear base de datos"
   - Selecciona "Comenzar en modo de prueba"

3. **Reglas de seguridad**:
   - Para desarrollo, usa las reglas básicas que permiten todo acceso:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

## Estructura de la Base de Datos

La aplicación requiere las siguientes colecciones en Firestore:

### Colección: `usuarios`
```typescript
interface Usuario {
  uid: string;           // ID del usuario (generado por Firebase Auth)
  nombre: string;        // Nombre del usuario
  apellido: string;      // Apellido del usuario
  email: string;         // Email del usuario
  rol: string;           // 'ADMIN', 'TECNICO', o 'VISITANTE'
  fechaCreacion: Date;   // Fecha de registro
  activo: boolean;       // Estado del usuario
}
```

### Colección: `cuyes`
```typescript
interface Cuy {
  id: string;            // ID único (generado por Firestore)
  numeroChip: string;    // Número de identificación
  sexo: string;          // 'MACHO' o 'HEMBRA'
  peso: number;          // Peso en gramos
  raza: string;          // Raza del cuy
  galponId: string;      // Referencia al galpón
  fechaNacimiento: Date; // Fecha de nacimiento
  fechaRegistro: Date;   // Fecha de registro en el sistema
  activo: boolean;       // Estado (activo/inactivo)
  observaciones: string; // Notas adicionales
}
```

### Colección: `galpones`
```typescript
interface Galpon {
  id: string;            // ID único (generado por Firestore)
  nombre: string;        // Nombre del galpón
  capacidadMaxima: number; // Capacidad máxima de cuyes
  ubicacion: string;     // Ubicación física
  descripcion: string;   // Descripción adicional
  fechaCreacion: Date;   // Fecha de creación
  activo: boolean;       // Estado (activo/inactivo)
  cuyesActuales: number; // Cantidad actual de cuyes
}
```

### Colección: `comentarios`
```typescript
interface Comentario {
  id: string;            // ID único (generado por Firestore)
  autorId: string;       // ID del usuario autor
  autorNombre: string;   // Nombre del autor
  contenido: string;     // Texto del comentario
  fecha: Date;           // Fecha de publicación
  activo: boolean;       // Estado (activo/inactivo)
}
```

## Implementación en el Código

Para cada servicio o componente donde se necesite acceso a Firestore, sigue estos pasos:

### 1. Importar las funciones necesarias

```typescript
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  CollectionReference,
  DocumentData 
} from '@angular/fire/firestore';
```

### 2. Inyectar Firestore en el constructor o con inject()

```typescript
private firestore: Firestore = inject(Firestore);
```

### 3. Implementar los métodos CRUD

#### Obtener todos los documentos de una colección:

```typescript
async obtenerTodos(): Promise<Tipo[]> {
  try {
    const coleccionRef = collection(this.firestore, 'nombreColeccion');
    const q = query(coleccionRef, orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fechaCreacion: data['fechaCreacion']?.toDate()
      } as Tipo;
    });
  } catch (error) {
    console.error('Error obteniendo documentos:', error);
    throw error;
  }
}
```

#### Obtener un documento específico:

```typescript
async obtenerPorId(id: string): Promise<Tipo | null> {
  try {
    const docRef = doc(this.firestore, 'nombreColeccion', id);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        fechaCreacion: data['fechaCreacion']?.toDate()
      } as Tipo;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo documento:', error);
    throw error;
  }
}
```

#### Crear un nuevo documento:

```typescript
async crear(datos: Omit<Tipo, 'id'>): Promise<string> {
  try {
    const coleccionRef = collection(this.firestore, 'nombreColeccion');
    const docRef = await addDoc(coleccionRef, {
      ...datos,
      fechaCreacion: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creando documento:', error);
    throw error;
  }
}
```

#### Actualizar un documento:

```typescript
async actualizar(id: string, datos: Partial<Tipo>): Promise<void> {
  try {
    const docRef = doc(this.firestore, 'nombreColeccion', id);
    await updateDoc(docRef, datos);
  } catch (error) {
    console.error('Error actualizando documento:', error);
    throw error;
  }
}
```

#### Eliminar un documento:

```typescript
async eliminar(id: string): Promise<void> {
  try {
    const docRef = doc(this.firestore, 'nombreColeccion', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error eliminando documento:', error);
    throw error;
  }
}
```

## Ejemplos de Servicios

### CuyService

Ejemplo de implementación para el servicio de cuyes:

```typescript
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp 
} from '@angular/fire/firestore';
import { Cuy } from '../models/cuy.model';

@Injectable({
  providedIn: 'root'
})
export class CuyService {
  private firestore: Firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'cuyes';

  async obtenerTodos(): Promise<Cuy[]> {
    try {
      const cuyesRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(cuyesRef, orderBy('fechaRegistro', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fechaNacimiento: data['fechaNacimiento']?.toDate(),
          fechaRegistro: data['fechaRegistro']?.toDate()
        } as Cuy;
      });
    } catch (error) {
      console.error('Error obteniendo cuyes:', error);
      throw error;
    }
  }

  async obtenerPorId(id: string): Promise<Cuy | null> {
    try {
      const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          ...data,
          fechaNacimiento: data['fechaNacimiento']?.toDate(),
          fechaRegistro: data['fechaRegistro']?.toDate()
        } as Cuy;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo cuy:', error);
      throw error;
    }
  }

  async crearCuy(cuy: Omit<Cuy, 'id' | 'fechaRegistro'>): Promise<string> {
    try {
      const cuyesRef = collection(this.firestore, this.COLLECTION_NAME);
      const docRef = await addDoc(cuyesRef, {
        ...cuy,
        fechaRegistro: serverTimestamp(),
        activo: true
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creando cuy:', error);
      throw error;
    }
  }

  async actualizarCuy(id: string, datos: Partial<Cuy>): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
      await updateDoc(docRef, datos);
    } catch (error) {
      console.error('Error actualizando cuy:', error);
      throw error;
    }
  }

  async eliminarCuy(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error eliminando cuy:', error);
      throw error;
    }
  }

  async buscarPorGalpon(galponId: string): Promise<Cuy[]> {
    try {
      const cuyesRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(
        cuyesRef, 
        where('galponId', '==', galponId),
        where('activo', '==', true)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fechaNacimiento: data['fechaNacimiento']?.toDate(),
          fechaRegistro: data['fechaRegistro']?.toDate()
        } as Cuy;
      });
    } catch (error) {
      console.error('Error buscando cuyes por galpon:', error);
      throw error;
    }
  }

  // Más métodos según necesidades...
}
```

## Consideraciones Importantes

1. **Transacciones**: Para operaciones que afecten a múltiples documentos, usa transacciones para garantizar la integridad de los datos.

2. **Índices compuestos**: Si realizas consultas con múltiples condiciones (where) o combinando filtros con ordenamiento, necesitarás crear índices compuestos en Firestore.

3. **Tamaño de documentos**: Recuerda que el tamaño máximo de un documento en Firestore es 1MB. Para datos más grandes, considera usar subcollections.

4. **Actualizaciones parciales**: Usa `updateDoc` con solo los campos que deseas actualizar, para optimizar el rendimiento y evitar sobrescribir datos.

5. **Manejo de fechas**: Cuando recuperes documentos de Firestore, recuerda convertir los timestamps a objetos Date de JavaScript usando `.toDate()`.

## Referencias

- [Documentación oficial de Firestore](https://firebase.google.com/docs/firestore)
- [Guía de Angular Fire](https://github.com/angular/angularfire)
- [Estructura de datos en Firestore](https://firebase.google.com/docs/firestore/manage-data/structure-data)
