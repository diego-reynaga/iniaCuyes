export const firebaseConfig = {
  // ✅ CONFIGURACIÓN REAL DE FIREBASE PARA INIA CUYES
  apiKey: "AIzaSyAiTRDhY1GLN6FkCO0UyoKyhWIck5O8qf4",
  authDomain: "iniacuyes.firebaseapp.com",
  projectId: "iniacuyes",
  storageBucket: "iniacuyes.firebasestorage.app",
  messagingSenderId: "842483304417",
  appId: "1:842483304417:web:659d247f4663adcbecf4a0",
  measurementId: "G-PS66REDDQ6"
};

/* 
=== GUÍA COMPLETA PARA CONFIGURAR FIREBASE ===

📋 PASO 1: CREAR PROYECTO FIREBASE
1. Ve a: https://console.firebase.google.com/
2. Clic en "Crear un proyecto" o "Add project"
3. Nombre del proyecto: "inia-cuyes" (o el que prefieras)
4. Acepta términos y condiciones
5. Clic en "Crear proyecto"

🔐 PASO 2: CONFIGURAR AUTHENTICATION
1. En el panel lateral, clic en "Authentication"
2. Clic en "Get started" o "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Busca "Email/Password" y haz clic en él
5. Activa el primer toggle "Email/Password"
6. Clic en "Save" o "Guardar"

🗄️ PASO 3: CONFIGURAR FIRESTORE DATABASE
1. En el panel lateral, clic en "Firestore Database"
2. Clic en "Create database" o "Crear base de datos"
3. Selecciona "Start in test mode" (modo de prueba)
4. Elige una ubicación (preferiblemente cerca de tu región)
5. Clic en "Enable" o "Habilitar"

🌐 PASO 4: REGISTRAR APLICACIÓN WEB
1. Ve a "Project Settings" (icono engranaje ⚙️)
2. Baja hasta la sección "Your apps" o "Tus aplicaciones"
3. Clic en el icono de aplicación web (</>)
4. Nombre de la app: "INIA Cuyes Web"
5. NO marques "Firebase Hosting" por ahora
6. Clic en "Register app" o "Registrar aplicación"

📋 PASO 5: COPIAR CONFIGURACIÓN
1. Aparecerá un código similar a este:
   ```
   const firebaseConfig = {
     apiKey: "AIzaSyC7x...",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123..."
   };
   ```
2. COPIA estos valores exactos
3. PEGA cada valor en la configuración arriba, reemplazando:
   - "TU_API_KEY_AQUI" con tu apiKey real
   - "tu-proyecto.firebaseapp.com" con tu authDomain real
   - "tu-proyecto-id" con tu projectId real
   - etc.

🔧 PASO 6: CONFIGURAR REGLAS DE FIRESTORE (OPCIONAL PERO RECOMENDADO)
1. Ve a "Firestore Database" > "Rules"
2. Reemplaza las reglas con:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Usuarios: solo el propio usuario puede leer/escribir sus datos
       match /usuarios/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Cuyes: solo usuarios autenticados pueden leer/escribir
       match /cuyes/{document=**} {
         allow read, write: if request.auth != null;
       }
       
       // Galpones: solo usuarios autenticados pueden leer/escribir
       match /galpones/{document=**} {
         allow read, write: if request.auth != null;
       }
       
       // Comentarios: todos pueden leer, solo autenticados pueden escribir
       match /comentarios/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. Clic en "Publish" o "Publicar"

✅ PASO 7: VERIFICAR CONFIGURACIÓN
1. Guarda este archivo después de actualizar la configuración
2. El proyecto debería compilar sin errores
3. Los botones de login/registro deberían funcionar
4. Podrás crear usuarios y acceder al admin dashboard

❓ SOLUCIÓN DE PROBLEMAS:
- Error "api-key-not-valid": Verifica que copiaste la apiKey correctamente
- Error "project-not-found": Verifica el projectId
- Error "auth-domain-config-required": Verifica el authDomain
- Si persisten errores, revisa que todos los valores estén entre comillas

🔗 ENLACES ÚTILES:
- Firebase Console: https://console.firebase.google.com/
- Documentación Firebase: https://firebase.google.com/docs
- Guía Authentication: https://firebase.google.com/docs/auth/web/start
- Guía Firestore: https://firebase.google.com/docs/firestore/quickstart

*/
