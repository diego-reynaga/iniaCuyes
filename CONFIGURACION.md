# 🐹 INIA Cuyes - Sistema de Gestión de Cuyes

Sistema integral para la gestión y control de cuyes en el Instituto Nacional de Innovación Agraria (INIA).

## 🚀 Características

- ✅ **Gestión de Cuyes**: Registro completo de datos individuales
- ✅ **Autenticación de Usuarios**: Sistema seguro con Firebase Auth
- ✅ **Generación de PDFs**: Informes detallados y exportación de datos
- ✅ **Panel Administrativo**: Dashboard completo para gestión
- ✅ **Vista Pública**: Información institucional y comentarios
- ✅ **Sistema de Comentarios**: Interacción con visitantes
- ✅ **Gestión de Usuarios**: Control de roles y permisos
- ✅ **Responsive Design**: Adaptado para dispositivos móviles

## 🔧 Tecnologías

- **Frontend**: Angular 18 (Standalone Components)
- **Backend**: Firebase (Auth + Firestore)
- **PDF Generation**: jsPDF + autoTable
- **Styling**: CSS moderno con Grid y Flexbox
- **TypeScript**: Tipado estricto

## 📋 Configuración Inicial

### 1. Instalación de dependencias
```bash
cd iniaCuyes
npm install
```

### 2. Configuración de Firebase

⚠️ **IMPORTANTE**: Debes configurar Firebase antes de ejecutar la aplicación.

#### Paso a paso:

1. **Crear proyecto Firebase**:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto llamado "inia-cuyes"

2. **Habilitar Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita "Email/Password"

3. **Crear Firestore Database**:
   - Ve a Firestore Database
   - Crea base de datos en "modo de prueba"

4. **Registrar aplicación web**:
   - Ve a Project Settings > Your apps
   - Crea nueva aplicación web
   - Copia la configuración

5. **Actualizar configuración**:
   - Edita `src/environments/firebase.config.ts`
   - Reemplaza los valores de ejemplo con tu configuración real

### 3. Estructura de la base de datos

El sistema creará automáticamente estas colecciones en Firestore:

```
📁 usuarios/
  └── {userId}/
      ├── nombre: string
      ├── apellido: string
      ├── email: string
      ├── rol: 'ADMIN' | 'TECNICO' | 'VISITANTE'
      └── fechaCreacion: timestamp

📁 cuyes/
  └── {cuyId}/
      ├── numeroChip: string
      ├── sexo: 'MACHO' | 'HEMBRA'
      ├── fechaNacimiento: timestamp
      ├── peso: number
      ├── galponId: string
      └── registros/ (subcolección)

📁 galpones/
  └── {galponId}/
      ├── nombre: string
      ├── capacidadMaxima: number
      └── ubicacion: string

📁 comentarios/
  └── {comentarioId}/
      ├── autorNombre: string
      ├── contenido: string
      ├── fechaCreacion: timestamp
      └── autorId: string
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200`

### Compilación
```bash
npm run build
```

### Testing
```bash
npm test
```

## 👥 Usuarios y Roles

### Tipos de usuario:
- **ADMIN**: Acceso completo al sistema
- **TECNICO**: Gestión de cuyes y galpones
- **VISITANTE**: Solo lectura de información pública

### Primer usuario administrador:
1. Registra un usuario desde `/register`
2. Ve a Firebase Console > Firestore
3. Busca el documento del usuario en la colección `usuarios`
4. Cambia el campo `rol` de "VISITANTE" a "ADMIN"

## 🗺️ Rutas de la aplicación

```
/              → Redirige a /public
/public        → Vista pública con información institucional
/login         → Inicio de sesión
/register      → Registro de usuarios
/admin         → Dashboard administrativo (requiere autenticación)
/admin/cuyes   → Lista de cuyes
/admin/cuyes/nuevo → Formulario nuevo cuy
/admin/cuyes/:id → Detalle de cuy
/admin/cuyes/:id/editar → Editar cuy
```

## 📊 Funcionalidades principales

### Panel Administrativo
- Dashboard con estadísticas generales
- Gestión completa de cuyes (CRUD)
- Generación de reportes PDF
- Gestión de usuarios
- Control de galpones

### Vista Pública
- Información institucional del INIA
- Sistema de comentarios
- Navegación responsive
- Acceso a login/registro

### Generación de PDFs
- Reportes individuales de cuyes
- Listados completos con filtros
- Estadísticas y gráficos
- Exportación de datos

## 🔐 Seguridad

- Autenticación obligatoria para área administrativa
- Validación de datos en frontend y backend
- Reglas de seguridad en Firestore
- Protección de rutas con AuthGuard

## 🐛 Solución de problemas

### Error: "api-key-not-valid"
- Verifica que hayas actualizado `firebase.config.ts` con tu configuración real
- Asegúrate de que la API Key esté entre comillas

### Error: "project-not-found"
- Verifica el `projectId` en la configuración
- Asegúrate de que el proyecto existe en Firebase Console

### Compilación fallida
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm start
```

### Firebase no conecta
1. Verifica tu configuración en `firebase.config.ts`
2. Asegúrate de haber habilitado Authentication y Firestore
3. Revisa las reglas de Firestore

## 📞 Soporte

Para problemas técnicos:
1. Revisa los logs en la consola del navegador
2. Verifica la configuración de Firebase
3. Consulta la documentación de Angular/Firebase

## 📄 Licencia

Proyecto desarrollado para el Instituto Nacional de Innovación Agraria (INIA) - Perú.

---

**Desarrollado con ❤️ para mejorar la gestión agropecuaria en Perú**
