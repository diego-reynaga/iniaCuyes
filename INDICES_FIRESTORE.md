# Índices de Firestore para INIA Cuyes

Este documento contiene los enlaces directos para crear los índices necesarios en Firestore para el correcto funcionamiento de la aplicación.

## Índices Necesarios

Haz clic en cada uno de los enlaces siguientes para crear los índices en tu proyecto Firebase:

1. **Índice para Estadísticas de Cuyes**:
   [Crear índice para Cuyes (activo + fechaRegistro)](https://console.firebase.google.com/v1/r/project/iniacuyes/firestore/indexes?create_composite=ClFwcm9qZWN0cy9pbmlhY3V5ZXMvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2N1eWVzL2luZGV4ZXMvXxABGgoKBmFjdGl2bxABGhEKDWZlY2hhUmVnaXN0cm8QAhoMCghfX25hbWVfXxAC)

2. **Índice para Comentarios**:
   [Crear índice para Comentarios (activo + fecha)](https://console.firebase.google.com/v1/r/project/iniacuyes/firestore/indexes?create_composite=ClRwcm9qZWN0cy9pbmlhY3V5ZXMvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NvbWVudGFyaW9zL2luZGV4ZXMvXxABGgoKBmFjdGl2bxABGgkKBWZlY2hhEAIaDAoIX19uYW1lX18QAg)

## Instrucciones para Crear Índices Manualmente

Si los enlaces anteriores no funcionan, sigue estos pasos para crear los índices manualmente:

### Para la Colección "cuyes":

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "iniacuyes"
3. Ve a Firestore Database
4. Haz clic en la pestaña "Índices"
5. Haz clic en "Crear índice"
6. Selecciona colección: "cuyes"
7. Agrega los campos:
   - activo (Ascending)
   - fechaRegistro (Ascending)
   - __name__ (Ascending)
8. Haz clic en "Crear"

### Para la Colección "comentarios":

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "iniacuyes"
3. Ve a Firestore Database
4. Haz clic en la pestaña "Índices"
5. Haz clic en "Crear índice"
6. Selecciona colección: "comentarios"
7. Agrega los campos:
   - activo (Ascending)
   - fecha (Ascending)
   - __name__ (Ascending)
8. Haz clic en "Crear"

## Notas Importantes

1. La creación de índices puede tardar algunos minutos en completarse.
2. Podrás ver el estado de los índices en la pestaña "Índices" de Firestore.
3. Una vez que los índices estén activos, las consultas empezarán a funcionar correctamente.
4. Es posible que necesites reiniciar la aplicación después de crear los índices.

## Solución a Problemas de Permisos

Si estás experimentando errores de permisos, es necesario actualizar las reglas de seguridad de Firestore:

1. Ve a Firestore Database
2. Haz clic en la pestaña "Reglas"
3. Copia y pega las siguientes reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a todos para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Una vez que la aplicación esté lista, reemplaza con reglas más específicas
    // Ver archivo firestore.rules para reglas de producción
  }
}
```

4. Haz clic en "Publicar"

Estas reglas permiten acceso completo durante el desarrollo. Para producción, se deben implementar reglas más restrictivas como las que se encuentran en el archivo `firestore.rules` del proyecto.
