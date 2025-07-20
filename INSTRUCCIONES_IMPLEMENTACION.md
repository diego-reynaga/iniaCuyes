# Preparación para Usar Firebase Database

Se han realizado cambios en el proyecto para eliminar todos los datos de prueba y preparar la integración con Firebase Database. A continuación, se detallan los pasos que debes seguir para comenzar a registrar datos reales en Firebase:

## 1. Configuración de Firebase

La configuración básica ya está completada en `src/environments/firebase.config.ts` con tus credenciales reales. La inicialización de Firebase, Auth y Firestore también está lista en `src/app/app.config.ts`.

## 2. Configuración de Firestore Database

1. Accede a tu [Consola de Firebase](https://console.firebase.google.com/project/iniacuyes)
2. Ve a **Firestore Database**
3. Si aún no has creado la base de datos, haz clic en **Crear base de datos**
4. Selecciona **modo de prueba** para comenzar (después puedes ajustar las reglas de seguridad)
5. Selecciona la ubicación más cercana a tus usuarios (preferiblemente en Sudamérica)

## 3. Crear los Índices Necesarios

En el archivo `INDICES_FIRESTORE.md` se encuentran las instrucciones detalladas para crear los índices necesarios. Sigue estas instrucciones para evitar errores en las consultas.

## 4. Implementar los Servicios de Firebase

Se ha creado un archivo detallado `FIREBASE_DATABASE.md` con ejemplos e instrucciones de código para implementar todos los servicios necesarios. Este documento contiene:

- Estructura recomendada para las colecciones
- Ejemplos de código para CRUD completo
- Guías de consultas y filtrado
- Manejo de transacciones y actualizaciones

## 5. Componentes Actualizados

Los siguientes componentes han sido modificados para eliminar datos de prueba:

1. **GalponListComponent**: Se eliminaron los datos de ejemplo y se agregaron comentarios con el código necesario para la implementación de Firebase.

2. **ReportesComponent**: Se eliminaron todos los datos estáticos y se dejaron comentarios con la implementación de Firebase para la generación de reportes.

## 6. Próximos Pasos para Ti

Para comenzar a registrar datos en Firebase, deberás:

1. Revisar el archivo `FIREBASE_DATABASE.md` para entender la estructura y los métodos necesarios

2. Implementar los servicios para cada entidad:
   - `CuyService` para gestionar cuyes
   - `GalponService` para gestionar galpones
   - Actualizar el `AuthService` para manejar usuarios desde Firestore

3. Integrar estos servicios en los componentes correspondientes:
   - Busca los comentarios `/* Implementación para Firebase */` en los componentes
   - Descomenta y adapta el código según tus necesidades

4. Probar la aplicación registrando algunos datos de prueba

## 7. Ejemplo de un Flujo Completo

Para ilustrar el proceso completo, aquí tienes un ejemplo de cómo registrar un nuevo galpón:

1. **Implementar GalponService**:
```typescript
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GalponService {
  private firestore: Firestore = inject(Firestore);
  
  async obtenerGalpones() {
    const galponesRef = collection(this.firestore, 'galpones');
    const q = query(galponesRef, orderBy('nombre'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaCreacion: doc.data()['fechaCreacion']?.toDate()
    }));
  }
  
  async crearGalpon(galpon) {
    const galponesRef = collection(this.firestore, 'galpones');
    return addDoc(galponesRef, {
      ...galpon,
      fechaCreacion: serverTimestamp(),
      cuyesActuales: 0,
      activo: true
    });
  }
  
  // Más métodos...
}
```

2. **Inyectar el servicio en el componente**:
```typescript
export class GalponListComponent {
  private galponService = inject(GalponService);
  
  // ...
}
```

3. **Actualizar el método cargarGalpones()**:
```typescript
async cargarGalpones() {
  try {
    this.galpones = await this.galponService.obtenerGalpones();
  } catch (error) {
    console.error('Error al cargar galpones:', error);
  }
}
```

4. **Actualizar el método guardarGalpon()**:
```typescript
async guardarGalpon() {
  if (!this.validateForm()) return;
  
  this.guardando = true;
  
  try {
    if (this.editandoGalpon) {
      await this.galponService.actualizarGalpon(
        this.editandoGalpon.id, 
        this.galponForm
      );
    } else {
      await this.galponService.crearGalpon(this.galponForm);
    }
    
    this.cancelarEdicion();
    await this.cargarGalpones();
    alert('Galpón guardado exitosamente');
  } catch (error) {
    console.error('Error guardando galpón:', error);
    alert('Error al guardar el galpón');
  } finally {
    this.guardando = false;
  }
}
```

## 8. Soporte Adicional

Si encuentras dificultades durante la implementación, puedes:

1. Consultar la [Documentación oficial de Firebase](https://firebase.google.com/docs/firestore)
2. Revisar el archivo `FIREBASE_DATABASE.md` para ejemplos específicos
3. Examinar los comentarios en el código para ver la implementación sugerida

¡Buena suerte con la implementación! Este enfoque te permitirá tener un sistema completamente funcional con datos persistentes en la nube.
