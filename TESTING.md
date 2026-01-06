# 🧪 Guía de Testing - AutoCiclo Mobile

## ✅ Correcciones Aplicadas

### Errores TypeScript Corregidos

1. **Color fondoOscuro faltante**
   - Archivo: `src/theme/colores.ts`
   - Solución: Agregado `fondoOscuro: '#000000'` al tema
   - Usado en: CameraCapture, BarcodeScanner, ImageViewer

2. **Referencias tipografia.tamanos → tamanoFuente**
   - Archivos afectados:
     - `src/components/common/BarcodeScanner.tsx` (6 correcciones)
     - `src/components/common/CameraCapture.tsx` (5 correcciones)
   - Solución: Cambiado `tipografia.tamanos` a `tipografia.tamanoFuente`

3. **Modelo InventarioPiezaDetalle**
   - Archivo: `src/models/InventarioPieza.ts`
   - Problema: Nombres de campos inconsistentes
   - Solución: Actualizado para usar:
     - `id_inventario` (agregado)
     - `matricula`, `marca`, `modelo` (en lugar de vehiculo_*)
     - `codigo_pieza`, `nombre_pieza`, `categoria_pieza` (en lugar de pieza_*)

4. **InventarioService consultas SQL**
   - Archivo: `src/services/InventarioService.ts`
   - Solución: Actualizadas queries en:
     - `obtenerTodos()`
     - `obtenerPorVehiculo()`
     - `obtenerPorPieza()`
   - Cambio función eliminar: De 2 parámetros a 1 (solo id_inventario)

5. **Card componente**
   - Archivo: `src/components/common/Card.tsx`
   - Solución: Interface actualizada para aceptar `ViewStyle | ViewStyle[]`

6. **Funciones onCerrar inexistentes**
   - Archivos:
     - `src/screens/piezas/DetallePiezaScreen.tsx`
     - `src/screens/vehiculos/DetalleVehiculoScreen.tsx`
   - Solución: Reemplazado `onCerrar` con `navigation.goBack()`

7. **DetalleVehiculoScreen campos de pieza**
   - Archivo: `src/screens/vehiculos/DetalleVehiculoScreen.tsx`
   - Solución: Corregido `pieza_nombre` → `nombre_pieza`, `pieza_codigo` → `codigo_pieza`

## 🚀 Estado de Compilación

✅ **TypeScript**: Sin errores
✅ **Metro Bundler**: Iniciado correctamente
✅ **Expo SDK 54**: Compatible
✅ **Dependencias**: Instaladas y actualizadas

## 📱 Testing Manual

### 1. Gestión de Piezas

**Crear Pieza:**
```
1. Ir a tab "Piezas"
2. Presionar botón "+" (FAB)
3. Completar formulario:
   - Código: MOT-001
   - Nombre: Motor V8
   - Categoría: motor
   - Precio: 1500
   - Stock Disponible: 5
   - Stock Mínimo: 2
   - Ubicación: A1
   - Marcas Compatibles: Ford,Chevrolet
   - Descripción: Motor V8 en buen estado
4. Probar scanner QR (botón scanner)
5. Probar cámara (botón cámara)
6. Guardar
```

**Validaciones a verificar:**
- Código duplicado (debe mostrar alerta)
- Precio negativo (debe rechazar)
- Stock mínimo < 1 (debe rechazar)
- Formato código (solo A-Z, 0-9, guiones)

### 2. Gestión de Vehículos

**Crear Vehículo:**
```
1. Ir a tab "Vehículos"
2. Presionar botón "+"
3. Completar:
   - Matrícula: 1234ABC
   - Marca: Ford
   - Modelo: Mustang (se carga dinámicamente)
   - Año: 2010
   - Color: Rojo
   - Estado: completo
   - Precio Compra: 5000
   - Kilometraje: 150000
   - Ubicación GPS: (botón para obtener actual)
4. Guardar
```

**Validaciones:**
- Matrícula duplicada
- Formato matrícula (4 números + 3 letras)
- Año entre 1900 y actual
- Precio/km >= 0

### 3. Scanner QR y Cámara

**Scanner QR:**
```
1. En formulario de pieza, presionar botón scanner
2. Permitir permisos de cámara
3. Apuntar a código QR o código de barras
4. Verificar vibración al escanear
5. Código debe aparecer en campo automáticamente
6. Probar "Escanear de nuevo"
```

**Cámara:**
```
1. En formulario de pieza, presionar botón cámara
2. Permitir permisos
3. Probar botón "Voltear" (front/back)
4. Probar botón "Galería"
5. Tomar foto
6. Verificar preview en formulario
7. Probar "Cambiar foto" y "Eliminar foto"
```

### 4. Inventario

**Asignar Pieza a Vehículo:**
```
1. En detalle de vehículo
2. Ver sección "Piezas Extraídas"
3. Verificar lista de piezas asignadas
4. Probar eliminar asignación
```

**Ver Inventario:**
```
1. Ir a tab "Inventario"
2. Ver lista de asignaciones
3. Verificar datos: vehículo, pieza, cantidad, estado, precio, fecha
4. Pull-to-refresh
5. Eliminar asignaciones
```

### 5. Estadísticas

**Ver Estadísticas:**
```
1. Ir a tab "Estadísticas"
2. Verificar tarjetas resumen:
   - Total piezas
   - Total vehículos
   - Stock bajo (en rojo)
3. Ver gráfico de barras (piezas por categoría)
4. Ver gráfico de torta (vehículos por estado)
5. Scroll hasta detalle por categorías
```

### 6. Mapas

**Ver Mapa:**
```
1. Desde tab "Vehículos"
2. Presionar "Ver en Mapa" en algún vehículo
3. Verificar marcadores coloreados:
   - Verde: completo
   - Naranja: desguazando
   - Gris: desguazado
4. Presionar "Mi Ubicación"
5. Verificar contador de vehículos
```

## 📊 Casos de Prueba Específicos

### A. Pull-to-Refresh
- [ ] ListadoPiezasScreen
- [ ] ListadoVehiculosScreen
- [ ] InventarioScreen

### B. Búsqueda con Debounce
- [ ] Buscar pieza (esperar 500ms)
- [ ] Cambiar búsqueda antes de 500ms
- [ ] Verificar solo 1 query al final

### C. Paginación
- [ ] Crear más de 10 piezas
- [ ] Scroll hasta el final
- [ ] Verificar carga de siguiente página

### D. Validaciones
- [ ] Código pieza duplicado
- [ ] Matrícula vehículo duplicada
- [ ] Formato matrícula incorrecto
- [ ] Precio negativo
- [ ] Stock negativo
- [ ] Año fuera de rango

### E. Navegación
- [ ] Stack navigation (Listado → Detalle → Formulario)
- [ ] Tab navigation
- [ ] Botón atrás en header
- [ ] Auto-reload con useFocusEffect

### F. Base de Datos
- [ ] INSERT pieza
- [ ] UPDATE pieza
- [ ] DELETE pieza (verificar cascade)
- [ ] INSERT vehículo
- [ ] UPDATE vehículo
- [ ] DELETE vehículo (verificar cascade en inventario)
- [ ] INSERT inventario
- [ ] DELETE inventario

## 🔧 Testing en Dispositivo

### Android
```bash
npx expo start --android
```

### iOS
```bash
npx expo start --ios
```

### Expo Go
```bash
npx expo start
# Escanear código QR con Expo Go app
```

## ⚠️ Limitaciones Conocidas

1. **Swipe-to-delete**: Requiere configuración adicional de react-native-gesture-handler
2. **Pinch-to-zoom**: No implementado en ImageViewer
3. **Mapas en producción**: Requiere API key de Google Maps
4. **Cámara/Scanner**: Solo funciona en dispositivo real (no en web/emulador básico)
5. **Notificaciones push**: No implementadas

## 📝 Checklist Final

Antes de considerar el testing completo, verificar:

- [ ] Todas las pantallas se renderizan sin errores
- [ ] CRUD completo funciona en Piezas
- [ ] CRUD completo funciona en Vehículos
- [ ] Inventario muestra asignaciones correctamente
- [ ] Estadísticas muestra datos reales
- [ ] Mapas muestra marcadores
- [ ] Scanner QR funciona en dispositivo
- [ ] Cámara funciona en dispositivo
- [ ] Pull-to-refresh funciona
- [ ] Navegación completa funciona
- [ ] No hay memory leaks (verificar con console)
- [ ] Base de datos persiste datos
- [ ] Validaciones funcionan correctamente
- [ ] UI responsive en diferentes tamaños

## 🎯 Datos de Prueba Sugeridos

### Piezas:
- MOT-001: Motor V8, motor, €1500, stock 5
- CAR-001: Puerta delantera izq, carrocería, €200, stock 3
- ELE-001: ECU, electrónica, €300, stock 2
- SUS-001: Amortiguador, suspensión, €150, stock 8
- INT-001: Asiento conductor, interior, €250, stock 4
- TRA-001: Caja cambios, transmisión, €800, stock 1

### Vehículos:
- 1234ABC: Ford Mustang 2010, completo
- 5678DEF: Chevrolet Camaro 2015, desguazando
- 9012GHI: Dodge Challenger 2018, desguazado

### Asignaciones:
- Vehículo 1234ABC → Motor V8 (usado, 1x)
- Vehículo 5678DEF → Puerta (usado, 2x)
- Vehículo 9012GHI → ECU (reparada, 1x)

---

¡Testing completado! 🎉
