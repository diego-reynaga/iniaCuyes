# Solución a Errores en INIA Cuyes

Este documento contiene instrucciones para resolver los errores que estás experimentando en la aplicación.

## 1. Error en Rutas para admin/galpones y admin/reportes

Este error ya ha sido solucionado mediante la creación de:

- El componente `GalponListComponent` en `src/app/components/admin/galpon-list.component.ts`
- El componente `ReportesComponent` en `src/app/components/admin/reportes.component.ts`

Las rutas en `app.routes.ts` ahora están correctamente configuradas para estos componentes.

## 2. Errores de Índices en Firestore

Estás viendo estos errores:
```
Error loading statistics: FirebaseError: The query requires an index.
Error loading comentarios: FirebaseError: The query requires an index.
```

### Solución:

1. Abre el archivo `INDICES_FIRESTORE.md` que hemos creado
2. Sigue los enlaces directos para crear los índices necesarios en tu proyecto Firebase
3. O sigue las instrucciones manuales si los enlaces no funcionan

## 3. Error de Permisos en Firestore

Estás viendo este error:
```
Error getting user profile: FirebaseError: Missing or insufficient permissions.
```

### Solución:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "iniacuyes"
3. Ve a Firestore Database
4. Haz clic en la pestaña "Reglas"
5. Reemplaza las reglas actuales con las siguientes (modo desarrollo):

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

6. Haz clic en "Publicar"

> **NOTA**: Estas reglas son para desarrollo y permiten acceso completo a cualquier persona. Para producción, deberás usar reglas más restrictivas como las que encuentras en el archivo `firestore.rules`.

## 4. Error de Bad Request en Firestore

Este error está relacionado con los anteriores. Una vez que configures correctamente:

1. Los índices de Firestore
2. Las reglas de seguridad para desarrollo

Este error debería desaparecer automáticamente.

## Pasos Recomendados:

1. Primero configura las **reglas de seguridad** (para permitir acceso completo durante desarrollo)
2. Luego crea los **índices necesarios**
3. **Reinicia la aplicación** completamente (detener y volver a iniciar)
4. Verifica que puedas acceder a todas las secciones sin errores

Si sigues estos pasos en orden, deberías poder resolver todos los errores y tener tu aplicación funcionando correctamente.

## ¿Necesitas Más Ayuda?

Si continúas experimentando problemas después de seguir estas instrucciones:

1. Verifica la consola del navegador para mensajes de error más detallados
2. Revisa los logs de Firestore en la consola de Firebase
3. Asegúrate de que la configuración de Firebase en `src/environments/firebase.config.ts` es correcta
