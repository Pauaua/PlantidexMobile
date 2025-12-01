# PlantiDex (PlantidexMobile)


¿Qué es?
-------
PlantiDex es una aplicación móvil híbrida (Ionic + Angular + Capacitor) diseñada para registrar, listar y compartir observaciones de especies nativas de tipo vegetal a nivel comunitario. Permite crear reportes de especies con datos de ubicación, descripción y estado de conservación, almacenándolos localmente usando `@ionic/storage-angular`.


Características principales
--------------------------
- Registro de especies con formulario reactivo y validaciones (nombre común, nombre científico, tipo, descripción, ubicación, estado de conservación, fecha, reportado por, comunidad).
- Persistencia local con `@ionic/storage-angular` (localForage).
- Listado reactivo de especies (BehaviorSubject) y detalle por id.
- Mapa comunitario (esqueleto y navegación) y navegación entre páginas.
- UX: mensajes de validación por campo, accesibilidad (aria-describedby/aria-invalid), botones para seed de datos y debug opcional.
- Tema personalizado: fondo negro, texto y acentos en verdes suaves. Logo SVG plantita integrado en toolbars.

Tech stack
----------
- Ionic Angular (Ionic 8, Angular 20)
- TypeScript
- @ionic/storage-angular (backed by localForage)
- Capacitor (configuración lista para móvil)
- Karma + Jasmine para tests unitarios (específicamente se añadió un spec para `EspeciesService`)

Instalación (desarrollo)
------------------------
Prerequisitos:
- Node.js (versión compatible con Angular 20 / TypeScript 5.8)
- npm
- Ionic CLI (opcional, para `ionic serve`)

Pasos:

1. Clona el repositorio:

```powershell
git clone <tu-repo-url>
cd PlantidexMobile
```

2. Instala dependencias:

```powershell
npm install
```

3. Levantar servidor de desarrollo:

```powershell
ionic serve
```

4. Build de producción:

```powershell
npm run build
```

Tests
-----
Hay un spec inicial `src/app/services/especies.service.spec.ts` que usa un `MockStorage` para probar `add`, `getById` y `remove` de `EspeciesService`.

Ejecutar tests:

```powershell
npm test
```

Estructura y archivos relevantes
-------------------------------
- `src/app/services/especies.service.ts` — Servicio central de persistencia. Expone `especies$` (BehaviorSubject) y métodos: `init()`, `getAll()`, `add()`, `getById()`, `remove()`, `update()`.
- `src/app/services/auth.service.ts` — Servicio de autenticación simple (estado simulado, guarda usuario en localStorage). Permite poblar `reportadoPor` y `comunidad` por defecto.
- `src/app/pages/agregar-especies/` — Página de formulario reactivo para crear especies. Incluye validadores, mensajes por campo, seed de datos, toggle debug.
- `src/app/pages/lista-especies/` — Página con listado reactivo y filtros básicos; navegación a detalle y mapa.
- `src/app/pages/detalle-especies/` — Página de detalle por id con datos de la especie.
- `src/app/home/` — Página de bienvenida con accesos a Ingresar / Registrarse / Ver especies.
- `src/theme/variables.scss` y `src/global.scss` — Variables y estilos globales del tema negro/verde aplicado.

Decisiones técnicas importantes
------------------------------
- Persistencia: se eligió `@ionic/storage-angular` por su simplicidad y por funcionar bien en Web y móviles. En web usa `localForage`, que en algunos entornos aparece como dependencia CommonJS; se añadió `localforage` a `allowedCommonJsDependencies` en `angular.json` para suprimir la advertencia de optimización durante build.
- Estado reactivo: `EspeciesService` mantiene un `BehaviorSubject<Especie[]>` para que las páginas puedan suscribirse y reaccionar a los cambios automáticamente.
- Validaciones: formularios reactivos con `Validators.required`, `Validators.minLength`, `Validators.pattern` y mensajes dinámicos expuestos mediante helpers en el componente.

Accesibilidad y UX
-------------------
- Inputs y notas de error usan `aria-invalid` y `aria-describedby` para mejorar compatibilidad con lectores de pantalla.
- Se añadieron `ion-back-button` con `defaultHref` en toolbars para facilitar navegación en entornos sin historial de navegación (apropiado para PWA).

Temas y estilo
--------------
- Tema principal: fondo negro y letras verdes (variables `--ion-background-color` y `--ion-text-color` definidas en `src/theme/variables.scss`).
- Logo SVG (pequeño) insertado en los toolbars para mantener identidad en todas las pantallas.

Futuras mejoras 
-------------------------
- Subir sincronización remota con backend (API REST) para compartir especies entre usuarios.
- Soporte para importar/exportar datos en formatos CSV/GeoJSON.
- Tests más completos (componentes y e2e).
- Aplicación de registro con mapa GPS
- Mapa comunitario con especies registradas


## Novedades y mejoras recientes

### Permisos nativos y acceso a hardware

- **Solicitud de permisos nativos en Android:**  
  Ahora la app solicita permisos de cámara y ubicación (GPS) usando los plugins de Capacitor (`@capacitor/camera` y `@capacitor/geolocation`).  
  Los permisos se gestionan dinámicamente en tiempo de ejecución, mostrando el diálogo nativo al usuario cuando se requiere acceder a la cámara o la ubicación.
- **Configuración de permisos en AndroidManifest.xml:**  
  Se añadieron explícitamente las siguientes líneas al archivo `android/app/src/main/AndroidManifest.xml` para asegurar la compatibilidad con dispositivos Android:
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  ```
- **Compatibilidad con emulador y dispositivos físicos:**  
  Se documentó el proceso para revocar y conceder permisos desde la configuración del sistema Android, facilitando pruebas en emuladores y dispositivos reales.

### Integración y uso de plugins Capacitor

- **@capacitor/camera:**  
  Permite tomar fotos desde la app, con solicitud de permisos previa y manejo de resultados en formato DataUrl.
- **@capacitor/geolocation:**  
  Permite obtener la ubicación GPS del usuario, con solicitud de permisos previa y manejo de errores si el GPS está desactivado o no disponible.
- **Gestión de errores y mensajes al usuario:**  
  Se mejoró la retroalimentación al usuario en caso de denegación de permisos, error de hardware o falta de datos de ubicación.

### Mejoras en la experiencia de usuario

- **Mensajes dinámicos y detallados:**  
  Se añadieron mensajes claros para cada caso de error (por ejemplo, “Permiso de ubicación denegado”, “No se pudo obtener la ubicación”, “Permiso de cámara denegado”).
- **Validación de hardware en emulador:**  
  Se documentó cómo simular la ubicación en el emulador de Android Studio y cómo revocar permisos manualmente para pruebas.

### Detalles técnicos y dependencias

- **Dependencias actualizadas:**  
  - `@capacitor/camera` v7.0.2
  - `@capacitor/geolocation` v7.1.6
  - `@capacitor/android` v7.4.4
- **Angular y Ionic:**  
  - Angular 20
  - Ionic 8

### Recomendaciones para pruebas

- **Sincronización de cambios:**  
  Tras modificar permisos o dependencias, ejecutar:
  ```bash
  npx cap sync
  ```
  para asegurar que los cambios se reflejen en la plataforma nativa.
- **Pruebas en emulador:**  
  Se recomienda simular la ubicación desde la barra lateral de Android Studio y verificar los permisos desde la app de “Ajustes” del sistema Android.

---

Documentos complementarios
--------------------------
- Se adjunta PDF informe evaluación 1 en la sección docs de GitHub. 

Uso de IA
--------
Utilizada para correcciones de código y solución de errores.