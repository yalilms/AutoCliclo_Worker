# 🚗 AutoCiclo Mobile

Aplicación móvil completa para la gestión de desguaces desarrollada con React Native y Expo.

## 📱 Características Implementadas

### ✅ Día 1-2: Configuración y Base
- ✅ Proyecto Expo con TypeScript
- ✅ Base de datos SQLite (3 tablas: vehiculos, piezas, inventario_piezas)
- ✅ Sistema de temas completo (colores, tipografía, espaciado)
- ✅ Componentes base (Botón, Input, Card)
- ✅ Constantes y validaciones

### ✅ Día 3-4: CRUD de Piezas
- ✅ Modelo Pieza con TypeScript
- ✅ PiezaService con 8 métodos CRUD
- ✅ ListadoPiezasScreen con búsqueda y paginación
- ✅ FormularioPiezaScreen con validaciones completas
- ✅ DetallePiezaScreen
- ✅ PiezaCard con indicadores de stock (verde/amarillo/rojo)
- ✅ Validación de código duplicado
- ✅ 6 categorías de piezas

### ✅ Día 5: Gestión de Vehículos
- ✅ Modelo Vehiculo completo
- ✅ VehiculoService con 10 métodos
- ✅ InventarioService (relación N:N)
- ✅ ListadoVehiculosScreen con filtros por estado
- ✅ FormularioVehiculoScreen con 19 marcas y 200+ modelos
- ✅ DetalleVehiculoScreen con piezas extraídas
- ✅ JSON con datos de vehículos y ubicaciones

### ✅ Día 6-7: Cámara y Scanner QR
- ✅ Componente CameraCapture para fotos
- ✅ Selección desde galería
- ✅ Almacenamiento Base64 (replica desktop)
- ✅ BarcodeScanner con overlay visual
- ✅ Escaneo de QR y códigos de barras
- ✅ Integración en FormularioPiezaScreen
- ✅ ImageViewer con zoom

### ✅ Día 8: Mapas y Ubicación GPS
- ✅ React Native Maps configurado
- ✅ MapaAlmacenScreen con marcadores
- ✅ Obtención de ubicación actual
- ✅ Marcadores coloreados por estado
- ✅ Botón para centrar en ubicación

### ✅ Día 9: Componentes Avanzados
- ✅ SwipeableRow (base para swipe-to-delete)
- ✅ Navegación Stack completa
- ✅ Auto-reload con useFocusEffect
- ✅ Pull-to-refresh en todas las listas

### ✅ Pantallas Adicionales
- ✅ EstadisticasScreen con gráficos:
  - Gráfico de barras (piezas por categoría)
  - Gráfico de torta (vehículos por estado)
  - Tarjetas resumen
  - Detalle por categorías
- ✅ InventarioScreen completa:
  - Lista de asignaciones pieza-vehículo
  - Detalles de cada asignación
  - Eliminar asignaciones

## 📂 Estructura del Proyecto

```
AutoCiclo_Worker/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Boton.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── BarcodeScanner.tsx
│   │   │   ├── ImageViewer.tsx
│   │   │   └── SwipeableRow.tsx
│   │   ├── pieza/
│   │   │   └── PiezaCard.tsx
│   │   └── vehiculo/
│   │       └── VehiculoCard.tsx
│   ├── database/
│   │   └── dataBase.ts
│   ├── data/
│   │   ├── vehiculos.json
│   │   └── ubicaciones.json
│   ├── hooks/
│   │   └── usarDebounce.ts
│   ├── models/
│   │   ├── Pieza.ts
│   │   ├── Vehiculo.ts
│   │   └── InventarioPieza.ts
│   ├── navigation/
│   │   ├── PiezasNavigator.tsx
│   │   └── VehiculosNavigator.tsx
│   ├── screens/
│   │   ├── piezas/
│   │   │   ├── ListadoPiezasScreen.tsx
│   │   │   ├── FormularioPiezaScreen.tsx
│   │   │   └── DetallePiezaScreen.tsx
│   │   ├── vehiculos/
│   │   │   ├── ListadoVehiculosScreen.tsx
│   │   │   ├── FormularioVehiculoScreen.tsx
│   │   │   └── DetalleVehiculoScreen.tsx
│   │   ├── inventario/
│   │   │   └── InventarioScreen.tsx
│   │   ├── estadisticas/
│   │   │   └── EstadisticasScreen.tsx
│   │   └── mapas/
│   │       └── MapaAlmacenScreen.tsx
│   ├── services/
│   │   ├── PiezaService.ts
│   │   ├── VehiculoService.ts
│   │   └── InventarioService.ts
│   ├── theme/
│   │   ├── colores.ts
│   │   ├── espaciado.ts
│   │   ├── tipografia.ts
│   │   ├── tema.ts
│   │   └── estilosGlobales.ts
│   └── utils/
│       ├── constantes.ts
│       └── datosVehiculos.ts
├── App.tsx
├── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework mobile
- **Expo SDK 54** - Plataforma de desarrollo (**Bare Workflow**)
- **TypeScript** - Tipado estático
- **SQLite** (react-native-sqlite-storage) - Base de datos local nativa
- **React Navigation** - Navegación (Bottom Tabs + Stack)
- **Expo Camera** - Captura de imágenes
- **Expo Barcode Scanner** - Escaneo QR/códigos de barras
- **React Native Maps** - Mapas y ubicación
- **React Native Chart Kit** - Gráficos estadísticos
- **React Native SVG** - Soporte para gráficos vectoriales

> ⚠️ **IMPORTANTE:** Este proyecto usa **Bare Workflow** y **NO** funciona con Expo Go. Requiere compilación nativa.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn
- **Android Studio** (para Android) o **Xcode** (para iOS en macOS)
- Emulador Android o dispositivo físico con USB Debugging

### Pasos de Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar y ejecutar:**

   **En Android (Recomendado):**
   ```bash
   npx expo run:android
   ```

   **En iOS (Solo macOS):**
   ```bash
   cd ios && pod install && cd ..
   npx expo run:ios
   ```

> ⚠️ **NOTA:** Ya **NO** funciona con `npx expo start` ni con Expo Go. El proyecto requiere compilación nativa por usar **Bare Workflow** y **react-native-sqlite-storage**.

## 📊 Funcionalidades Principales

### Gestión de Piezas
- ✅ Crear, editar, eliminar piezas
- ✅ Búsqueda con debounce (500ms)
- ✅ Paginación (10 items por página)
- ✅ 6 categorías: motor, carrocería, electricidad, transmisión, suspensión, interior
- ✅ Indicadores de stock (normal/bajo/agotado)
- ✅ Validación de código duplicado
- ✅ Tomar foto de la pieza
- ✅ Escanear código QR/barras

### Gestión de Vehículos
- ✅ CRUD completo de vehículos
- ✅ 19 marcas con 200+ modelos
- ✅ Filtros por estado (completo/desguazando/desguazado)
- ✅ Formateo automático de matrícula (1234ABC)
- ✅ Ver piezas extraídas de cada vehículo
- ✅ Validación de matrícula duplicada

### Inventario
- ✅ Asignación de piezas a vehículos
- ✅ Relación N:N con CASCADE delete
- ✅ Ver todas las asignaciones
- ✅ Eliminar asignaciones
- ✅ Detalles: cantidad, estado, precio, fecha

### Estadísticas
- ✅ Gráfico de barras (piezas por categoría)
- ✅ Gráfico de torta (vehículos por estado)
- ✅ Tarjetas de resumen (total piezas, vehículos, stock bajo)
- ✅ Detalle numérico por categorías

### Mapas
- ✅ Visualización de vehículos en mapa
- ✅ Marcadores coloreados por estado
- ✅ Ubicación actual del dispositivo
- ✅ Contador de vehículos en mapa

## 🎨 Diseño y UX

### Tema
- Sistema de colores completo
- Tipografía basada en Material Design
- Espaciado consistente (sistema 8dp)
- Colores de estado:
  - Verde: Completo
  - Naranja: Desguazando
  - Gris: Desguazado

### Patrones de Diseño
- Material Design 3
- Cards con elevación
- Chips para categorías/estados
- FAB para acciones principales
- Pull-to-refresh
- Skeleton loaders

## 🗄️ Base de Datos

### Tablas SQLite

**vehiculos** (12 campos)
- id_vehiculo, matricula, marca, modelo, anio, color
- fecha_entrada, estado, precio_compra, kilometraje
- ubicacion_gps, observaciones

**piezas** (11 campos)
- id_pieza, codigo_pieza, nombre, categoria
- precio_venta, stock_disponible, stock_minimo
- ubicacion_almacen, compatible_marcas, imagen, descripcion

**inventario_piezas** (7 campos - N:N)
- id_inventario, id_vehiculo, id_pieza
- cantidad, estado_pieza, fecha_extraccion
- precio_unitario, notas

### Características DB
- ✅ Foreign Keys con CASCADE delete
- ✅ 8 índices para optimización
- ✅ Prepared statements (prevención SQL injection)
- ✅ Validaciones en capa de servicio

## 🔒 Validaciones

### Piezas
- Código: Solo A-Z, 0-9 y guiones
- Precio: >= 0
- Stock disponible: >= 0
- Stock mínimo: >= 1
- Código único en base de datos

### Vehículos
- Matrícula: Formato 1234ABC
- Año: Entre 1900 y año actual
- Precio: >= 0
- Kilometraje: >= 0
- Matrícula única en base de datos

## 📝 Notas de Desarrollo

### Pendientes para Implementación Futura
- [ ] Notificaciones push para stock bajo
- [ ] Exportar estadísticas a PDF
- [ ] Sincronización con backend
- [ ] Modo offline completo
- [ ] Swipe-to-delete funcional (requiere react-native-gesture-handler configurado)
- [ ] Pinch-to-zoom en imágenes (requiere librería adicional)

### Conocidos
- Los gráficos requieren dimensiones fijas
- Mapas requiere API key de Google Maps para producción
- Cámara y scanner solo funcionan en dispositivo real

## 👨‍💻 Desarrollo

Desarrollado siguiendo:
- Patrón MVC
- TypeScript strict mode
- Nomenclatura en español
- Comentarios JSDoc
- Separación de responsabilidades
- Reutilización de componentes

## 📄 Licencia

Proyecto educativo - AutoCiclo Mobile

---

¡La aplicación está lista para ser probada en el emulador o dispositivo! 🎉
