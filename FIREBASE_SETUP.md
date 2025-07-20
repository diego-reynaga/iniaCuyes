# 🔥 Configuración Firebase para INIA Cuyes

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `inia-cuyes` (o el nombre que prefieras)
4. Sigue los pasos del asistente

### 2. Configurar Web App
1. En el panel del proyecto, haz clic en el ícono Web `</>`
2. Nombre de la app: `INIA Cuyes Web`
3. **NO** marcar "También configurar Firebase Hosting"
4. Copia la configuración que aparece

### 3. Actualizar configuración local
Reemplaza el contenido en `src/environments/firebase.config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### 4. Habilitar Authentication
1. Ve a **Authentication** > **Sign-in method**
2. Habilita **Email/Password**
3. Habilita **Anonymous** (opcional para desarrollo)

### 5. Crear Firestore Database
1. Ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba** (temporalmente)
4. Elige una ubicación (preferible: `southamerica-east1`)

### 6. Configurar reglas de seguridad
En **Firestore Database** > **Reglas**, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir todo temporalmente para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 7. Crear primer usuario admin
1. Ejecuta la aplicación con `ng serve`
2. Ve a `/register` 
3. Registra un usuario con email: `admin@inia.gob.pe`
4. En Firebase Console > Firestore, ve a la colección `usuarios`
5. Cambia el campo `rol` de `visitante` a `admin`

## 🔧 Desarrollo Local (Opcional)

Si quieres usar emuladores para desarrollo:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
```

Selecciona:
- Authentication Emulator (puerto 9099)
- Firestore Emulator (puerto 8080)

Ejecuta emuladores:
```bash
firebase emulators:start
```

## 📊 Colecciones de Firestore

El sistema creará automáticamente estas colecciones:
- `usuarios` - Información de usuarios del sistema
- `cuyes` - Registros de cuyes
- `galpones` - Información de galpones
- `comentarios` - Comentarios públicos
- `configuracion_sistema` - Configuración global

## ⚠️ Importante

1. **Nunca** subas tu configuración de Firebase a un repositorio público
2. Usa variables de entorno para producción
3. Cambia las reglas de Firestore a modo restrictivo antes de producción
4. Habilita App Check para protección adicional en producción

## 🚀 Comandos útiles

```bash
# Ejecutar aplicación
ng serve

# Ejecutar con emuladores
firebase emulators:start & ng serve

# Build para producción  
ng build --prod

# Desplegar a Firebase Hosting (opcional)
firebase deploy
```
