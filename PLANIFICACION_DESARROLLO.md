# 📱 PLANIFICACIÓN DE DESARROLLO - AUTOCICLO MOBILE
## Aplicación Móvil para Empleados de Desguace (10 días)

---

## 📊 INFORMACIÓN DEL PROYECTO BASE

### Aplicación de Escritorio Analizada: AutoCiclo
- **Tipo:** Aplicación de Gestión de Desguace de Vehículos
- **Tecnologías Desktop:** JavaFX 25 + MySQL 8.0 + Java 24
- **Patrón Arquitectónico:** MVC (Model-View-Controller)
- **Base de Datos:** MySQL con 3 tablas principales

### Entidades Principales
1. **VEHICULOS** (12 campos + relaciones)
2. **PIEZAS** (11 campos + imágenes en Base64)
3. **INVENTARIO_PIEZAS** (tabla de relación N:N con 7 campos)

### Funcionalidades Clave a Migrar
- ✅ CRUD completo de Vehículos
- ✅ CRUD completo de Piezas
- ✅ Asignación de Piezas a Vehículos (Inventario)
- ✅ Búsqueda y filtrado en tiempo real
- ✅ Validaciones exhaustivas (12 tipos diferentes)
- ✅ Manejo de imágenes (Base64)
- ✅ Estadísticas visuales (BarChart, PieChart)
- ✅ Paginación de listados

---

## 🗓️ CRONOGRAMA DETALLADO (10 DÍAS)

---

## 📅 DÍA 1-2: CONFIGURACIÓN Y BASE (28-29 diciembre)

### Objetivos del Día
Establecer la infraestructura base del proyecto con todas las dependencias y estructura inicial necesaria.

### Tareas Principales

#### 1. Crear Proyecto React Native con Expo
```bash
npx create-expo-app AutoCicloMobile --template blank-typescript
cd AutoCicloMobile
```

**Configuración inicial:**
- Inicializar Git
- Crear `.gitignore` completo
- Configurar `app.json` con nombre, slug, versión
- Establecer orientación permitidas (portrait/landscape)

#### 2. Instalar Dependencias Principales

**Navegación:**
```bash
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
```

**Base de Datos:**
```bash
npx expo install expo-sqlite
```

**UI y Componentes:**
```bash
npm install react-native-paper
npx expo install @expo/vector-icons
```

**Formularios y Validación:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Utilidades:**
```bash
npm install date-fns
```

#### 3. Configurar Estructura de Carpetas

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx           # Botón reutilizable
│   │   ├── Input.tsx            # Input con validación
│   │   ├── Card.tsx             # Tarjeta base
│   │   ├── SearchBar.tsx        # Buscador global
│   │   ├── Loading.tsx          # Indicador de carga
│   │   └── ErrorMessage.tsx     # Mensaje de error
│   ├── pieza/
│   │   ├── PiezaCard.tsx        # Card de pieza en lista
│   │   └── PiezaForm.tsx        # Formulario de pieza
│   ├── vehiculo/
│   │   ├── VehiculoCard.tsx     # Card de vehículo
│   │   └── VehiculoForm.tsx     # Formulario vehículo
│   └── inventario/
│       └── InventarioCard.tsx   # Card de asignación
├── screens/
│   ├── piezas/
│   │   ├── PiezasListScreen.tsx
│   │   ├── PiezaDetailScreen.tsx
│   │   └── PiezaFormScreen.tsx
│   ├── vehiculos/
│   │   ├── VehiculosListScreen.tsx
│   │   ├── VehiculoDetailScreen.tsx
│   │   └── VehiculoFormScreen.tsx
│   ├── inventario/
│   │   ├── InventarioListScreen.tsx
│   │   └── AsignarPiezaScreen.tsx
│   └── estadisticas/
│       └── EstadisticasScreen.tsx
├── navigation/
│   ├── AppNavigator.tsx         # Navegador principal
│   ├── PiezasStack.tsx          # Stack de piezas
│   ├── VehiculosStack.tsx       # Stack de vehículos
│   └── types.ts                 # Tipos de navegación
├── database/
│   ├── database.ts              # Configuración SQLite
│   ├── migrations.ts            # Migraciones de BD
│   └── seed.ts                  # Datos iniciales
├── models/
│   ├── Vehiculo.ts              # Modelo Vehiculo
│   ├── Pieza.ts                 # Modelo Pieza
│   └── InventarioPieza.ts       # Modelo Inventario
├── services/
│   ├── VehiculoService.ts       # CRUD Vehículos
│   ├── PiezaService.ts          # CRUD Piezas
│   └── InventarioService.ts     # CRUD Inventario
├── utils/
│   ├── validation.ts            # Validaciones
│   ├── formatters.ts            # Formateadores
│   └── constants.ts             # Constantes
├── theme/
│   ├── colors.ts                # Paleta de colores
│   ├── spacing.ts               # Espaciados
│   ├── typography.ts            # Tipografías
│   └── theme.ts                 # Tema principal
└── hooks/
    ├── useDatabase.ts           # Hook de BD
    └── useDebounce.ts           # Hook de debounce
```

#### 4. Configurar Tema y Constantes

**`src/theme/colors.ts`:**
```typescript
export const colors = {
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  // Estados de vehículo
  completo: '#4CAF50',
  desguazando: '#FF9800',
  desguazado: '#9E9E9E',
  // Categorías de piezas
  motor: '#F44336',
  carroceria: '#2196F3',
  interior: '#9C27B0',
  electronica: '#FF9800',
  ruedas: '#607D8B',
  otros: '#795548',
};
```

**`src/utils/constants.ts`:**
```typescript
export const CONSTANTS = {
  // Paginación
  ITEMS_PER_PAGE: 10,

  // Estados de vehículo (replicados de MySQL ENUM)
  ESTADO_VEHICULO: ['completo', 'desguazando', 'desguazado'] as const,

  // Categorías de piezas (replicadas de MySQL ENUM)
  CATEGORIAS_PIEZA: ['motor', 'carroceria', 'interior', 'electronica', 'ruedas', 'otros'] as const,

  // Estados de pieza en inventario (replicados de MySQL ENUM)
  ESTADO_PIEZA: ['nueva', 'usada', 'reparada'] as const,

  // Validaciones (replicadas de desktop)
  MATRICULA_REGEX: /^\d{4}[A-Z]{3}$/,
  CODIGO_PIEZA_REGEX: /^[A-Z0-9\-]+$/,
  MIN_ANIO: 1900,
  MAX_ANIO: 2025,

  // Stock
  STOCK_MINIMO_DEFAULT: 1,
  STOCK_BAJO_UMBRAL: 5, // Para notificaciones
};

export type EstadoVehiculo = typeof CONSTANTS.ESTADO_VEHICULO[number];
export type CategoriaPieza = typeof CONSTANTS.CATEGORIAS_PIEZA[number];
export type EstadoPieza = typeof CONSTANTS.ESTADO_PIEZA[number];
```

#### 5. Configurar SQLite

**`src/database/database.ts`:**
```typescript
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('autociclo.db');

export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Crear tabla VEHICULOS (replicada del esquema MySQL)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS vehiculos (
          id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
          matricula TEXT UNIQUE NOT NULL,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          anio INTEGER NOT NULL,
          color TEXT,
          fecha_entrada TEXT NOT NULL,
          estado TEXT NOT NULL CHECK(estado IN ('completo', 'desguazando', 'desguazado')),
          precio_compra REAL DEFAULT 0,
          kilometraje INTEGER DEFAULT 0,
          ubicacion_gps TEXT,
          observaciones TEXT
        );`,
        [],
        () => console.log('Tabla vehiculos creada'),
        (_, error) => {
          console.error('Error creando tabla vehiculos:', error);
          return false;
        }
      );

      // Crear tabla PIEZAS (replicada del esquema MySQL)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS piezas (
          id_pieza INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_pieza TEXT UNIQUE NOT NULL,
          nombre TEXT NOT NULL,
          categoria TEXT NOT NULL CHECK(categoria IN ('motor', 'carroceria', 'interior', 'electronica', 'ruedas', 'otros')),
          precio_venta REAL DEFAULT 0,
          stock_disponible INTEGER DEFAULT 0,
          stock_minimo INTEGER DEFAULT 1,
          ubicacion_almacen TEXT,
          compatible_marcas TEXT,
          imagen TEXT,
          descripcion TEXT
        );`,
        [],
        () => console.log('Tabla piezas creada'),
        (_, error) => {
          console.error('Error creando tabla piezas:', error);
          return false;
        }
      );

      // Crear tabla INVENTARIO_PIEZAS (tabla de relación N:N)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inventario_piezas (
          id_vehiculo INTEGER NOT NULL,
          id_pieza INTEGER NOT NULL,
          cantidad INTEGER NOT NULL DEFAULT 1,
          estado_pieza TEXT NOT NULL CHECK(estado_pieza IN ('nueva', 'usada', 'reparada')),
          fecha_extraccion TEXT NOT NULL,
          precio_unitario REAL DEFAULT 0,
          notas TEXT,
          PRIMARY KEY (id_vehiculo, id_pieza),
          FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE,
          FOREIGN KEY (id_pieza) REFERENCES piezas(id_pieza) ON DELETE CASCADE
        );`,
        [],
        () => console.log('Tabla inventario_piezas creada'),
        (_, error) => {
          console.error('Error creando tabla inventario_piezas:', error);
          return false;
        }
      );
    }, reject, resolve);
  });
};
```

#### 6. Crear Componentes Base

**`src/components/common/Button.tsx`:**
- Botón estilizado con variantes (primary, secondary, danger)
- Soporte para loading state
- Iconos opcionales

**`src/components/common/Input.tsx`:**
- Input con label
- Validación integrada
- Mensaje de error
- Estilos de éxito/error (replicando ValidationUtils de desktop)

**`src/components/common/Card.tsx`:**
- Contenedor con sombra y bordes redondeados
- Padding configurable
- onPress opcional para hacerlo clickeable

### Entregables del Día 1-2
- ✅ Proyecto Expo configurado
- ✅ 15+ dependencias instaladas
- ✅ Estructura de carpetas completa (40+ archivos planificados)
- ✅ Base de datos SQLite con 3 tablas
- ✅ Tema configurado con colores de desktop
- ✅ 3 componentes base creados
- ✅ Constantes y tipos TypeScript

### Riesgos y Mitigaciones
- ⚠️ **Riesgo:** Problemas con dependencias de Expo
  - **Mitigación:** Usar `npx expo install` en vez de `npm install`
- ⚠️ **Riesgo:** Conflictos de versiones
  - **Mitigación:** Especificar versiones exactas en package.json

---

## 📅 DÍA 3-4: CRUD DE PIEZAS (30-31 diciembre)

### Objetivos del Día
Implementar la gestión completa de piezas con todas las funcionalidades del desktop.

### Tareas Principales

#### 1. Crear Modelo de Pieza

**`src/models/Pieza.ts`:**
```typescript
import { CategoriaPieza } from '../utils/constants';

export interface Pieza {
  id_pieza?: number;
  codigo_pieza: string;
  nombre: string;
  categoria: CategoriaPieza;
  precio_venta: number;
  stock_disponible: number;
  stock_minimo: number;
  ubicacion_almacen?: string;
  compatible_marcas?: string;
  imagen?: string; // Base64 o URI
  descripcion?: string;
}

export interface PiezaFormData {
  codigo_pieza: string;
  nombre: string;
  categoria: CategoriaPieza;
  precio_venta: string; // String para input
  stock_disponible: string;
  stock_minimo: string;
  ubicacion_almacen: string;
  compatible_marcas: string;
  descripcion: string;
}
```

#### 2. Implementar PiezaService

**`src/services/PiezaService.ts`:**
```typescript
import { db } from '../database/database';
import { Pieza } from '../models/Pieza';

export class PiezaService {
  // CREATE - Insertar nueva pieza
  static async crear(pieza: Pieza): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO piezas (
            codigo_pieza, nombre, categoria, precio_venta,
            stock_disponible, stock_minimo, ubicacion_almacen,
            compatible_marcas, imagen, descripcion
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pieza.codigo_pieza,
            pieza.nombre,
            pieza.categoria,
            pieza.precio_venta,
            pieza.stock_disponible ?? 0,
            pieza.stock_minimo ?? 1,
            pieza.ubicacion_almacen ?? '',
            pieza.compatible_marcas ?? '',
            pieza.imagen ?? '',
            pieza.descripcion ?? ''
          ],
          (_, result) => resolve(result.insertId!),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // READ - Obtener todas las piezas con paginación
  static async obtenerTodos(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = ''
  ): Promise<{ piezas: Pieza[]; total: number }> {
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Contar total
        const whereClause = searchTerm
          ? `WHERE nombre LIKE '%${searchTerm}%' OR codigo_pieza LIKE '%${searchTerm}%'`
          : '';

        tx.executeSql(
          `SELECT COUNT(*) as total FROM piezas ${whereClause}`,
          [],
          (_, { rows }) => {
            const total = rows._array[0].total;

            // Obtener piezas paginadas
            tx.executeSql(
              `SELECT * FROM piezas ${whereClause} ORDER BY nombre LIMIT ? OFFSET ?`,
              [limit, offset],
              (_, { rows }) => resolve({ piezas: rows._array, total }),
              (_, error) => {
                reject(error);
                return false;
              }
            );
          }
        );
      });
    });
  }

  // READ - Obtener pieza por ID
  static async obtenerPorId(id: number): Promise<Pieza | null> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM piezas WHERE id_pieza = ?',
          [id],
          (_, { rows }) => {
            resolve(rows._array[0] || null);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // UPDATE - Actualizar pieza
  static async actualizar(id: number, pieza: Partial<Pieza>): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE piezas SET
            nombre = ?, categoria = ?, precio_venta = ?,
            stock_disponible = ?, stock_minimo = ?,
            ubicacion_almacen = ?, compatible_marcas = ?,
            imagen = ?, descripcion = ?
          WHERE id_pieza = ?`,
          [
            pieza.nombre,
            pieza.categoria,
            pieza.precio_venta,
            pieza.stock_disponible,
            pieza.stock_minimo,
            pieza.ubicacion_almacen,
            pieza.compatible_marcas,
            pieza.imagen,
            pieza.descripcion,
            id
          ],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // DELETE - Eliminar pieza
  static async eliminar(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM piezas WHERE id_pieza = ?',
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // VALIDAR - Verificar código duplicado
  static async existeCodigoPieza(codigo: string, excludeId?: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        const query = excludeId
          ? 'SELECT COUNT(*) as count FROM piezas WHERE codigo_pieza = ? AND id_pieza != ?'
          : 'SELECT COUNT(*) as count FROM piezas WHERE codigo_pieza = ?';

        const params = excludeId ? [codigo, excludeId] : [codigo];

        tx.executeSql(
          query,
          params,
          (_, { rows }) => resolve(rows._array[0].count > 0),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // BUSCAR - Búsqueda avanzada
  static async buscar(term: string): Promise<Pieza[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM piezas
           WHERE nombre LIKE ? OR codigo_pieza LIKE ? OR categoria LIKE ?
           ORDER BY nombre`,
          [`%${term}%`, `%${term}%`, `%${term}%`],
          (_, { rows }) => resolve(rows._array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
}
```

#### 3. Crear Pantalla de Listado de Piezas

**`src/screens/piezas/PiezasListScreen.tsx`:**
- FlatList con renderItem usando PiezaCard
- SearchBar con debounce (500ms)
- Pull-to-refresh
- Paginación infinita (loadMore)
- Botón FAB para agregar nueva pieza
- Navegación a detalle al hacer tap en card

**Características:**
- Filtrado en tiempo real (replicando desktop)
- Indicador de stock bajo (rojo si stock < stock_minimo)
- Chip de categoría con color
- Precio formateado con 2 decimales

#### 4. Implementar Buscador con Debounce

**`src/hooks/useDebounce.ts`:**
```typescript
import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### 5. Crear Formulario de Nueva Pieza

**`src/screens/piezas/PiezaFormScreen.tsx`:**
- Usar `react-hook-form` para manejo de formulario
- Validaciones con `zod` (replicando ValidationUtils de desktop)

**Validaciones requeridas:**
```typescript
import { z } from 'zod';
import { CONSTANTS } from '../../utils/constants';

const piezaSchema = z.object({
  codigo_pieza: z.string()
    .min(1, 'Código requerido')
    .regex(CONSTANTS.CODIGO_PIEZA_REGEX, 'Formato inválido (solo A-Z, 0-9, -)'),
  nombre: z.string().min(1, 'Nombre requerido'),
  categoria: z.enum(CONSTANTS.CATEGORIAS_PIEZA),
  precio_venta: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Precio debe ser >= 0'),
  stock_disponible: z.string()
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'Stock debe ser >= 0'),
  stock_minimo: z.string()
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 1, 'Stock mínimo debe ser >= 1'),
  ubicacion_almacen: z.string().optional(),
  compatible_marcas: z.string().optional(),
  descripcion: z.string().optional(),
});
```

**Campos del formulario:**
1. Código de pieza (Input con validación regex)
2. Nombre (Input)
3. Categoría (Picker con 6 opciones)
4. Precio venta (Input numérico con 2 decimales)
5. Stock disponible (Input numérico)
6. Stock mínimo (Input numérico, default 1)
7. Ubicación almacén (Input con sugerencias del JSON)
8. Marcas compatibles (TextArea)
9. Descripción (TextArea)
10. Imagen (Botón para seleccionar - implementación día 6)

#### 6. Crear Modal de Detalle de Pieza

**`src/screens/piezas/PiezaDetailScreen.tsx`:**
- ScrollView con todos los campos en modo lectura
- Botones de acción: Editar, Eliminar
- Mostrar imagen si existe
- Chip de categoría con color
- Indicador de stock (verde/amarillo/rojo)
- Confirmación antes de eliminar

**Diseño:**
```
┌─────────────────────────────────┐
│  [← Volver]    [Editar] [❌]     │
│                                 │
│  ┌─────────────────────────┐   │
│  │   [Imagen de la pieza]  │   │
│  └─────────────────────────┘   │
│                                 │
│  MOT-123                        │
│  Motor de arranque              │
│  [Motor]                        │
│                                 │
│  Precio: 150.00 €              │
│  Stock: 5 / Mínimo: 2          │
│  ● Stock Normal                 │
│                                 │
│  Ubicación: A-12-3             │
│  Compatible: VW Golf 2015-2020 │
│                                 │
│  Descripción:                   │
│  Motor en buen estado...        │
└─────────────────────────────────┘
```

#### 7. Diseñar PiezaCard

**`src/components/pieza/PiezaCard.tsx`:**
```typescript
interface PiezaCardProps {
  pieza: Pieza;
  onPress: () => void;
}

// Diseño:
┌────────────────────────────────────┐
│ ┌──┐  MOT-123  [Motor]            │
│ │📷│  Motor de arranque            │
│ └──┘  150.00 € | Stock: 5/2       │
│       ● Normal                     │
└────────────────────────────────────┘
```

**Características del Card:**
- Thumbnail de imagen (40x40) o icono por defecto
- Código + nombre de pieza
- Chip de categoría con color según tipo
- Precio formateado
- Indicador visual de stock:
  - 🔴 Rojo: stock <= 0 (sin stock)
  - 🟡 Amarillo: 0 < stock < stock_minimo (stock bajo)
  - 🟢 Verde: stock >= stock_minimo (stock normal)
- Ripple effect al presionar

### Entregables del Día 3-4
- ✅ Modelo Pieza con TypeScript
- ✅ PiezaService con 8 métodos (CRUD + validaciones + búsqueda)
- ✅ Pantalla de listado con FlatList paginada
- ✅ Buscador con debounce funcionando
- ✅ Formulario completo con validaciones
- ✅ Modal de detalle con navegación
- ✅ PiezaCard diseñado y funcional
- ✅ Validaciones de código duplicado

### Testing del Día 3-4
- [ ] Insertar 10 piezas de prueba
- [ ] Probar búsqueda en tiempo real
- [ ] Validar formato de código (rechazar "abc", aceptar "ABC-123")
- [ ] Validar precios negativos (rechazar)
- [ ] Probar paginación (crear 50+ piezas)
- [ ] Probar edición de pieza existente
- [ ] Confirmar eliminación con CASCADE (verificar inventario)

---

## 📅 DÍA 5: GESTIÓN DE VEHÍCULOS (1 enero)

### Objetivos del Día
Implementar CRUD de vehículos replicando la funcionalidad del desktop, incluyendo carga de marcas/modelos desde JSON.

### Tareas Principales

#### 1. Crear Modelo de Vehículo

**`src/models/Vehiculo.ts`:**
```typescript
import { EstadoVehiculo } from '../utils/constants';

export interface Vehiculo {
  id_vehiculo?: number;
  matricula: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  fecha_entrada: string; // ISO 8601
  estado: EstadoVehiculo;
  precio_compra: number;
  kilometraje: number;
  ubicacion_gps?: string;
  observaciones?: string;
}

export interface VehiculoConPiezas extends Vehiculo {
  total_piezas: number;
}
```

#### 2. Cargar Marcas y Modelos desde JSON

**`src/data/vehiculos.json`:** (copiar del desktop)
```json
{
  "Audi": ["A1", "A3", "A4", "A5", "Q3", "Q5"],
  "BMW": ["Serie 1", "Serie 3", "Serie 5", "X1", "X3"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan"],
  ...
}
```

**`src/data/ubicaciones.json`:** (copiar del desktop)
```json
{
  "vehiculos": ["Almacén A", "Almacén B", "Patio Norte", "Patio Sur"],
  "piezas": ["A-1-1", "A-1-2", "A-2-1", "B-1-1", ...]
}
```

**`src/utils/vehiculosData.ts`:**
```typescript
import vehiculosJson from '../data/vehiculos.json';
import ubicacionesJson from '../data/ubicaciones.json';

export const getMarcas = (): string[] => {
  return Object.keys(vehiculosJson).sort();
};

export const getModelos = (marca: string): string[] => {
  return vehiculosJson[marca as keyof typeof vehiculosJson] || [];
};

export const getUbicacionesVehiculos = (): string[] => {
  return ubicacionesJson.vehiculos;
};

export const getUbicacionesPiezas = (): string[] => {
  return ubicacionesJson.piezas;
};
```

#### 3. Implementar VehiculoService

**`src/services/VehiculoService.ts`:**
Similar estructura a PiezaService con:
- `crear(vehiculo)` - INSERT con fecha_entrada = hoy
- `obtenerTodos(page, limit, search)` - Paginación
- `obtenerPorId(id)` - SELECT con JOIN para contar piezas
- `actualizar(id, vehiculo)` - UPDATE (matricula NO editable)
- `eliminar(id)` - DELETE con CASCADE
- `existeMatricula(matricula, excludeId?)` - Validación duplicados
- `obtenerConPiezas(id)` - JOIN con inventario_piezas

**Query especial:**
```sql
SELECT v.*, COUNT(ip.id_pieza) as total_piezas
FROM vehiculos v
LEFT JOIN inventario_piezas ip ON v.id_vehiculo = ip.id_vehiculo
WHERE v.id_vehiculo = ?
GROUP BY v.id_vehiculo
```

#### 4. Pantalla Listado de Vehículos

**`src/screens/vehiculos/VehiculosListScreen.tsx`:**
- FlatList con VehiculoCard
- Filtros por estado (chips: Todos, Completo, Desguazando, Desguazado)
- SearchBar (buscar por matrícula, marca, modelo)
- Ordenar por: Fecha entrada (↓↑), Kilometraje (↓↑), Precio (↓↑)
- Pull-to-refresh
- FAB para agregar vehículo

#### 5. Detalle de Vehículo

**`src/screens/vehiculos/VehiculoDetailScreen.tsx`:**

**Secciones:**
1. **Información General**
   - Matrícula (destacada)
   - Marca + Modelo + Año
   - Color
   - Estado (chip con color)

2. **Datos Técnicos**
   - Kilometraje (formateado: 125,000 km)
   - Precio de compra (formateado: 5,500.00 €)
   - Fecha de entrada

3. **Ubicación**
   - Ubicación GPS
   - Botón "Ver en mapa" (si tiene coordenadas)

4. **Piezas Extraídas** (sección nueva)
   - Listado de piezas asociadas
   - Total de piezas: X
   - Botón "Ver todas las piezas"
   - Botón "Asignar nueva pieza"

5. **Observaciones**
   - TextArea de solo lectura

**Botones de acción:**
- Editar
- Cambiar estado
- Eliminar
- Registrar extracción

#### 6. Vincular Piezas con Vehículos

**`src/screens/inventario/AsignarPiezaScreen.tsx`:**

**Formulario:**
```typescript
const asignacionSchema = z.object({
  id_vehiculo: z.number().min(1, 'Selecciona un vehículo'),
  id_pieza: z.number().min(1, 'Selecciona una pieza'),
  cantidad: z.number().min(1, 'Cantidad debe ser >= 1'),
  estado_pieza: z.enum(CONSTANTS.ESTADO_PIEZA),
  fecha_extraccion: z.date(),
  precio_unitario: z.number().min(0, 'Precio debe ser >= 0'),
  notas: z.string().optional(),
});
```

**Campos:**
1. Vehículo (Searchable Picker con matrícula + marca modelo)
2. Pieza (Searchable Picker con código + nombre)
3. Cantidad (Stepper 1-99)
4. Estado de pieza (SegmentedButtons: Nueva, Usada, Reparada)
5. Fecha extracción (DatePicker, default hoy)
6. Precio unitario (Input, default precio_venta de pieza)
7. Notas (TextArea opcional)

**Validación especial:**
- No permitir asignar misma pieza 2 veces al mismo vehículo
- Verificar que vehículo y pieza existan

#### 7. Registro de Extracciones

**Lista de extracciones desde detalle de vehículo:**
```
┌────────────────────────────────────────┐
│ Piezas Extraídas (5)                   │
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐   │
│ │ Motor de arranque                │   │
│ │ MOT-123 | Usada | 2x              │   │
│ │ Extraído: 15/12/2024             │   │
│ │ 150.00 € c/u                     │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │ Faro delantero derecho           │   │
│ │ FAR-045 | Nueva | 1x              │   │
│ │ Extraído: 20/12/2024             │   │
│ │ 80.00 €                          │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Entregables del Día 5
- ✅ Modelo Vehiculo completo
- ✅ VehiculoService con 8 métodos
- ✅ JSON de marcas/modelos cargados
- ✅ Pantalla listado con filtros y ordenamiento
- ✅ Detalle de vehículo con secciones
- ✅ Formulario de vehículo con validaciones
- ✅ Asignación de piezas funcionando
- ✅ Lista de extracciones en detalle

### Testing del Día 5
- [ ] Insertar 5 vehículos de diferentes marcas
- [ ] Validar matrícula (rechazar "12345AB", aceptar "1234ABC")
- [ ] Probar carga de modelos según marca seleccionada
- [ ] Asignar 3 piezas a un vehículo
- [ ] Verificar que no se puede asignar pieza duplicada
- [ ] Eliminar vehículo y verificar CASCADE en inventario
- [ ] Cambiar estado de vehículo a "desguazado"

---

## 📅 DÍA 6-7: EXTRAS - CÁMARA Y ESCÁNER (2-3 enero)

### Objetivos del Día
Implementar funcionalidades multimedia para mejorar la gestión de piezas.

### Tareas Principales

#### 1. Integrar Expo Camera

**Instalación:**
```bash
npx expo install expo-camera
npx expo install expo-image-picker
npx expo install expo-media-library
```

**Permisos en `app.json`:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Permite a AutoCiclo tomar fotos de piezas."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Permite a AutoCiclo acceder a tu galería."
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Permite a AutoCiclo guardar fotos."
        }
      ]
    ]
  }
}
```

#### 2. Captura de Fotos de Piezas

**`src/components/pieza/CameraCapture.tsx`:**
```typescript
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export const CameraCapture = ({ onCapture, onClose }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      // Convertir a Base64 (replicando desktop)
      const base64 = `data:image/jpeg;base64,${photo.base64}`;
      onCapture(base64);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      onCapture(base64);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={takePicture}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons name="photo-library" size={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType(
            type === CameraType.back ? CameraType.front : CameraType.back
          )}>
            <MaterialIcons name="flip-camera-ios" size={40} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
```

**Integración en PiezaFormScreen:**
```typescript
const [modalVisible, setModalVisible] = useState(false);
const [imagen, setImagen] = useState<string | null>(null);

const handleCapture = (base64: string) => {
  setImagen(base64);
  setValue('imagen', base64); // react-hook-form
  setModalVisible(false);
};

// En el formulario:
<Button onPress={() => setModalVisible(true)}>
  {imagen ? 'Cambiar foto' : 'Tomar foto'}
</Button>
{imagen && <Image source={{ uri: imagen }} style={styles.preview} />}

<Modal visible={modalVisible}>
  <CameraCapture onCapture={handleCapture} onClose={() => setModalVisible(false)} />
</Modal>
```

#### 3. Galería de Imágenes

**Nota:** La versión desktop almacena 1 imagen por pieza. Para mobile, consideraremos mismo comportamiento.

**`src/screens/piezas/ImageGalleryScreen.tsx`:**
- Mostrar imagen de pieza a pantalla completa
- Pinch-to-zoom (implementar día 9)
- Botones: Compartir, Eliminar, Cerrar

**Funcionalidad de compartir:**
```typescript
import * as Sharing from 'expo-sharing';

const shareImage = async (base64: string) => {
  // Convertir Base64 a archivo temporal
  const filename = `pieza_${piezaId}_${Date.now()}.jpg`;
  const filepath = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(
    filepath,
    base64.split(',')[1],
    { encoding: FileSystem.EncodingType.Base64 }
  );

  await Sharing.shareAsync(filepath);
};
```

#### 4. Escáner QR/Código de Barras

**`src/components/common/BarcodeScanner.tsx`:**
```typescript
import { BarCodeScanner } from 'expo-barcode-scanner';

export const BarcodeScanner = ({ onScan, onClose }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    onScan(data);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Overlay visual */}
      <View style={styles.overlay}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>

      <Text style={styles.hint}>
        Apunta al código de barras de la pieza
      </Text>

      {scanned && (
        <Button onPress={() => setScanned(false)}>
          Escanear de nuevo
        </Button>
      )}

      <Button onPress={onClose}>Cancelar</Button>
    </View>
  );
};
```

#### 5. Overlay Visual para Scanner

**Estilos del overlay:**
```typescript
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: '30%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00FF00',
  },
  // Repetir para las 4 esquinas
});
```

#### 6. Integración con Formularios

**En PiezaFormScreen:**
- Botón "Escanear código" que abre el scanner
- Al escanear, auto-completa el campo `codigo_pieza`
- Opción para escanear desde listado para búsqueda rápida

**En VehiculoFormScreen:**
- Botón "Escanear matrícula" (OCR básico o manual)
- Auto-completa el campo `matricula`

### Casos de Uso

**Caso 1: Añadir pieza nueva con foto**
1. Usuario va a "Nueva pieza"
2. Presiona "Escanear código" → Scanner se abre
3. Escanea código de barras → Campo auto-completado
4. Presiona "Tomar foto" → Cámara se abre
5. Toma foto → Preview aparece
6. Completa resto de campos
7. Presiona "Guardar" → Pieza guardada con imagen en Base64

**Caso 2: Buscar pieza por código QR**
1. Usuario está en listado de piezas
2. Presiona botón de scanner en toolbar
3. Escanea QR de pieza
4. Navega automáticamente al detalle de esa pieza

### Entregables del Día 6-7
- ✅ Expo Camera configurado
- ✅ Componente de captura de fotos
- ✅ Galería de imagen a pantalla completa
- ✅ Escáner de códigos QR/barras
- ✅ Overlay visual para scanner
- ✅ Integración en formularios
- ✅ Almacenamiento Base64 (replicando desktop)
- ✅ Función de compartir imagen

### Testing del Día 6-7
- [ ] Tomar foto con cámara trasera
- [ ] Tomar foto con cámara frontera
- [ ] Seleccionar foto de galería
- [ ] Verificar Base64 almacenado correctamente
- [ ] Escanear código QR de prueba
- [ ] Escanear código de barras de prueba
- [ ] Compartir imagen de pieza
- [ ] Probar en dispositivo real (no emulador)

---

## 📅 DÍA 8: EXTRAS - MAPAS Y LOCALIZACIÓN (4 enero)

### Objetivos del Día
Implementar visualización de ubicaciones de vehículos y piezas en el almacén.

### Tareas Principales

#### 1. Integrar React Native Maps

**Instalación:**
```bash
npx expo install react-native-maps
npx expo install expo-location
```

**Configuración `app.json`:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Permite a AutoCiclo mostrar la ubicación de vehículos y piezas."
        }
      ]
    ],
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

#### 2. Pantalla de Mapa del Almacén

**`src/screens/mapas/AlmacenMapScreen.tsx`:**

**Estructura:**
```typescript
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const AlmacenMapScreen = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [selectedItem, setSelectedItem] = useState<Vehiculo | null>(null);
  const [region, setRegion] = useState({
    latitude: 40.4168, // Madrid (default)
    longitude: -3.7038,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    loadVehiculosConGPS();
    getCurrentLocation();
  }, []);

  const loadVehiculosConGPS = async () => {
    // Cargar solo vehículos con ubicacion_gps
    const result = await VehiculoService.obtenerConGPS();
    setVehiculos(result);
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {vehiculos.map(vehiculo => {
          const [lat, lng] = parseGPS(vehiculo.ubicacion_gps);
          return (
            <Marker
              key={vehiculo.id_vehiculo}
              coordinate={{ latitude: lat, longitude: lng }}
              title={vehiculo.matricula}
              description={`${vehiculo.marca} ${vehiculo.modelo}`}
              pinColor={getColorByEstado(vehiculo.estado)}
              onPress={() => setSelectedItem(vehiculo)}
            />
          );
        })}
      </MapView>

      {selectedItem && (
        <BottomSheet>
          <VehiculoCard
            vehiculo={selectedItem}
            onPress={() => navigation.navigate('VehiculoDetail', { id: selectedItem.id_vehiculo })}
          />
          <Button onPress={() => navigateToVehicle(selectedItem)}>
            Cómo llegar
          </Button>
        </BottomSheet>
      )}
    </View>
  );
};

// Helpers
const parseGPS = (gps: string): [number, number] => {
  // Formato: "40.4168,-3.7038" o "40.4168, -3.7038"
  const [lat, lng] = gps.split(',').map(s => parseFloat(s.trim()));
  return [lat, lng];
};

const getColorByEstado = (estado: EstadoVehiculo): string => {
  switch (estado) {
    case 'completo': return '#4CAF50';
    case 'desguazando': return '#FF9800';
    case 'desguazado': return '#9E9E9E';
    default: return '#2196F3';
  }
};
```

#### 3. Marcadores de Ubicación de Piezas

**Mapa alternativo para piezas en almacén:**
- Usar plano 2D del almacén (imagen de fondo)
- Marcadores sobre imagen según `ubicacion_almacen`
- Zoom y pan habilitados

**`src/screens/mapas/AlmacenPlanoScreen.tsx`:**
```typescript
import { ImageZoom } from 'react-native-image-pan-zoom';

const AlmacenPlanoScreen = () => {
  const [piezas, setPiezas] = useState<Pieza[]>([]);

  // Convertir ubicación textual a coordenadas en plano
  // Ej: "A-1-2" → { x: 100, y: 50 }
  const ubicacionToCoords = (ubicacion: string) => {
    const [seccion, fila, columna] = ubicacion.split('-');
    const x = (seccion.charCodeAt(0) - 65) * 100 + parseInt(columna) * 30;
    const y = parseInt(fila) * 50;
    return { x, y };
  };

  return (
    <ImageZoom
      cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={1000}
      imageHeight={600}
    >
      <Image
        source={require('../assets/almacen_plano.png')}
        style={{ width: 1000, height: 600 }}
      />
      {piezas.map(pieza => {
        const { x, y } = ubicacionToCoords(pieza.ubicacion_almacen || '');
        return (
          <View
            key={pieza.id_pieza}
            style={[styles.marker, { left: x, top: y }]}
          >
            <MaterialIcons name="place" size={24} color="red" />
            <Text style={styles.markerLabel}>{pieza.codigo_pieza}</Text>
          </View>
        );
      })}
    </ImageZoom>
  );
};
```

#### 4. Guardar Ubicación GPS

**En formulario de vehículo:**
```typescript
const [ubicacionGPS, setUbicacionGPS] = useState('');
const [loading, setLoading] = useState(false);

const obtenerUbicacionActual = async () => {
  setLoading(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const gps = `${location.coords.latitude},${location.coords.longitude}`;
    setUbicacionGPS(gps);
    setValue('ubicacion_gps', gps);
  } catch (error) {
    Alert.alert('Error', 'No se pudo obtener la ubicación');
  } finally {
    setLoading(false);
  }
};

// En el formulario:
<Input
  label="Ubicación GPS"
  value={ubicacionGPS}
  onChangeText={setUbicacionGPS}
  placeholder="40.4168,-3.7038"
  rightIcon={
    <TouchableOpacity onPress={obtenerUbicacionActual}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <MaterialIcons name="my-location" size={24} />
      )}
    </TouchableOpacity>
  }
/>
```

#### 5. Ruta a la Pieza

**Navegación con Google Maps/Apple Maps:**
```typescript
import * as Linking from 'expo-linking';

const navigateToVehicle = async (vehiculo: Vehiculo) => {
  if (!vehiculo.ubicacion_gps) {
    Alert.alert('Sin ubicación', 'Este vehículo no tiene GPS registrado');
    return;
  }

  const [lat, lng] = parseGPS(vehiculo.ubicacion_gps);
  const label = `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.matricula})`;

  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${lat},${lng}`,
    android: `geo:0,0?q=${lat},${lng}(${label})`,
  });

  const supported = await Linking.canOpenURL(url!);
  if (supported) {
    await Linking.openURL(url!);
  } else {
    // Fallback a Google Maps web
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    await Linking.openURL(webUrl);
  }
};
```

**Botón en detalle de vehículo:**
```typescript
{vehiculo.ubicacion_gps && (
  <Button
    mode="contained"
    icon="navigation"
    onPress={() => navigateToVehicle(vehiculo)}
  >
    Cómo llegar
  </Button>
)}
```

#### 6. Mapa de Calor (Opcional)

**Visualizar concentración de vehículos:**
```typescript
import { Heatmap } from 'react-native-maps';

<MapView>
  <Heatmap
    points={vehiculos.map(v => {
      const [lat, lng] = parseGPS(v.ubicacion_gps);
      return {
        latitude: lat,
        longitude: lng,
        weight: v.total_piezas || 1, // Peso según piezas extraídas
      };
    })}
    radius={40}
    opacity={0.6}
  />
</MapView>
```

### Entregables del Día 8
- ✅ React Native Maps configurado
- ✅ Pantalla de mapa del almacén
- ✅ Marcadores de vehículos con GPS
- ✅ Plano 2D para ubicación de piezas
- ✅ Obtener ubicación actual del dispositivo
- ✅ Guardar coordenadas GPS en vehículos
- ✅ Navegación a vehículo con maps nativas
- ✅ Bottom sheet con info al seleccionar marcador

### Testing del Día 8
- [ ] Crear 5 vehículos con GPS diferente
- [ ] Verificar marcadores en mapa
- [ ] Tap en marcador → Ver bottom sheet
- [ ] Obtener ubicación actual → GPS guardado correctamente
- [ ] Presionar "Cómo llegar" → Google/Apple Maps abre
- [ ] Probar plano 2D con 10 piezas
- [ ] Zoom y pan en plano del almacén

---

## 📅 DÍA 9: EXTRAS - GESTOS Y NOTIFICACIONES (5 enero)

### Objetivos del Día
Implementar interacciones táctiles y sistema de notificaciones para stock bajo.

### Tareas Principales

#### 1. Swipe-to-Delete en Listas

**Instalación:**
```bash
npm install react-native-gesture-handler react-native-reanimated
```

**`src/components/common/SwipeableRow.tsx`:**
```typescript
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit?: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({ children, onDelete, onEdit }) => {
  const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [192, 0],
    });

    return (
      <Animated.View style={[styles.actionsContainer, { transform: [{ translateX }] }]}>
        {onEdit && (
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <MaterialIcons name="edit" size={24} color="white" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    width: 192,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});
```

**Integración en PiezasListScreen:**
```typescript
<FlatList
  data={piezas}
  renderItem={({ item }) => (
    <SwipeableRow
      onDelete={() => handleDelete(item.id_pieza!)}
      onEdit={() => navigation.navigate('PiezaForm', { id: item.id_pieza })}
    >
      <PiezaCard pieza={item} onPress={() => handlePress(item)} />
    </SwipeableRow>
  )}
  keyExtractor={item => item.id_pieza!.toString()}
/>
```

#### 2. Pull-to-Refresh

**Ya integrado con RefreshControl:**
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await loadPiezas();
  setRefreshing(false);
};

<FlatList
  data={piezas}
  renderItem={renderItem}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
      tintColor={colors.primary}
    />
  }
/>
```

#### 3. Pinch-to-Zoom en Imágenes

**Instalación:**
```bash
npm install react-native-image-zoom-viewer
```

**`src/screens/piezas/ImageViewerScreen.tsx`:**
```typescript
import ImageViewer from 'react-native-image-zoom-viewer';

interface ImageViewerScreenProps {
  route: {
    params: {
      imageUrl: string;
      piezaNombre: string;
    };
  };
}

const ImageViewerScreen: React.FC<ImageViewerScreenProps> = ({ route }) => {
  const { imageUrl, piezaNombre } = route.params;

  const images = [
    {
      url: imageUrl,
      props: {
        source: { uri: imageUrl },
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        enableSwipeDown
        onSwipeDown={() => navigation.goBack()}
        saveToLocalByLongPress={false}
        renderHeader={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{piezaNombre}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
```

**Navegación desde PiezaDetailScreen:**
```typescript
{pieza.imagen && (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('ImageViewer', {
        imageUrl: pieza.imagen,
        piezaNombre: pieza.nombre,
      })
    }
  >
    <Image source={{ uri: pieza.imagen }} style={styles.image} />
  </TouchableOpacity>
)}
```

#### 4. Notificaciones de Stock Bajo

**Instalación:**
```bash
npx expo install expo-notifications
npx expo install expo-device
```

**`src/services/NotificationService.ts`:**
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Error al obtener permisos de notificación');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Usa un dispositivo físico para notificaciones');
    }

    return token;
  }

  static async scheduleStockBajoNotification(pieza: Pieza) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Stock bajo',
        body: `${pieza.nombre} tiene solo ${pieza.stock_disponible} unidades (mínimo: ${pieza.stock_minimo})`,
        data: { piezaId: pieza.id_pieza },
        sound: true,
      },
      trigger: null, // Inmediata
    });
  }

  static async checkStockBajo() {
    const piezas = await PiezaService.obtenerStockBajo();

    for (const pieza of piezas) {
      await this.scheduleStockBajoNotification(pieza);
    }
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static setupNotificationResponseListener(navigation: any) {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const piezaId = response.notification.request.content.data.piezaId;
      if (piezaId) {
        navigation.navigate('PiezaDetail', { id: piezaId });
      }
    });

    return subscription;
  }
}
```

**Agregar método a PiezaService:**
```typescript
static async obtenerStockBajo(): Promise<Pieza[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM piezas WHERE stock_disponible < stock_minimo',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
```

**Integración en App.tsx:**
```typescript
useEffect(() => {
  // Registrar notificaciones
  NotificationService.registerForPushNotifications();

  // Configurar listener de respuestas
  const subscription = NotificationService.setupNotificationResponseListener(navigationRef);

  // Chequear stock cada hora
  const interval = setInterval(() => {
    NotificationService.checkStockBajo();
  }, 3600000); // 1 hora

  // Chequeo inicial
  NotificationService.checkStockBajo();

  return () => {
    subscription.remove();
    clearInterval(interval);
  };
}, []);
```

#### 5. Badge de Notificaciones

**Mostrar cantidad de piezas con stock bajo:**
```typescript
const [stockBajoCount, setStockBajoCount] = useState(0);

useEffect(() => {
  loadStockBajoCount();

  const interval = setInterval(loadStockBajoCount, 60000); // cada minuto
  return () => clearInterval(interval);
}, []);

const loadStockBajoCount = async () => {
  const piezas = await PiezaService.obtenerStockBajo();
  setStockBajoCount(piezas.length);

  // Actualizar badge de app
  await Notifications.setBadgeCountAsync(piezas.length);
};

// En el tab navigator de piezas:
<Tab.Screen
  name="Piezas"
  component={PiezasStack}
  options={{
    tabBarBadge: stockBajoCount > 0 ? stockBajoCount : undefined,
    tabBarBadgeStyle: { backgroundColor: colors.error },
  }}
/>
```

#### 6. Gestos Adicionales

**Long-press para opciones:**
```typescript
<TouchableOpacity
  onLongPress={() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', 'Editar', 'Eliminar', 'Compartir'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) handleEdit();
        if (buttonIndex === 2) handleDelete();
        if (buttonIndex === 3) handleShare();
      }
    );
  }}
>
  <PiezaCard pieza={pieza} />
</TouchableOpacity>
```

### Entregables del Día 9
- ✅ Swipe-to-delete en listas de piezas/vehículos
- ✅ Pull-to-refresh en todas las listas
- ✅ Pinch-to-zoom en visor de imágenes
- ✅ Sistema de notificaciones configurado
- ✅ Notificación automática de stock bajo
- ✅ Badge con contador en tab de piezas
- ✅ Long-press para menú contextual
- ✅ Navegación desde notificación a detalle

### Testing del Día 9
- [ ] Swipe izquierda en pieza → Botones editar/eliminar aparecen
- [ ] Pull-to-refresh en listado → Datos se recargan
- [ ] Pinch en imagen → Zoom funciona correctamente
- [ ] Crear pieza con stock = 0 → Notificación aparece
- [ ] Tap en notificación → Navega a detalle de pieza
- [ ] Verificar badge en tab con número correcto
- [ ] Long-press en card → Menú contextual aparece

---

## 📅 DÍA 10: PULIDO Y TESTING (6 enero)

### Objetivos del Día
Finalizar, pulir detalles, realizar testing exhaustivo y preparar entregables.

### Tareas Principales

#### 1. Revisar Flujos de Navegación

**Checklist de navegación:**
- [ ] Splash screen → Pantalla principal (animación suave)
- [ ] Tab bar con 4 tabs: Piezas, Vehículos, Inventario, Estadísticas
- [ ] Stack navigator en cada tab
- [ ] Deep linking desde notificaciones
- [ ] Botón "Atrás" consistente en todos los modales
- [ ] Prevenir navegación accidental (confirmación antes de descartar formularios con cambios)

**Implementar confirmación de descarte:**
```typescript
import { usePreventRemove } from '@react-navigation/native';

const PiezaFormScreen = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      '¿Descartar cambios?',
      'Tienes cambios sin guardar. ¿Deseas descartarlos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  // Detectar cambios en el formulario
  const { watch } = useForm();
  useEffect(() => {
    const subscription = watch(() => setHasUnsavedChanges(true));
    return () => subscription.unsubscribe();
  }, [watch]);
};
```

#### 2. Mejorar Animaciones

**Transiciones de pantallas:**
```typescript
// En AppNavigator.tsx
const Stack = createStackNavigator();

<Stack.Navigator
  screenOptions={{
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  }}
>
  {/* Screens */}
</Stack.Navigator>
```

**Animaciones en listas:**
```typescript
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

<FlatList
  data={piezas}
  renderItem={({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutUp}
    >
      <PiezaCard pieza={item} />
    </Animated.View>
  )}
/>
```

**Loading skeletons:**
```typescript
import ContentLoader, { Rect } from 'react-content-loader/native';

const PiezaCardSkeleton = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={100}
    viewBox="0 0 400 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="0" y="0" rx="5" ry="5" width="80" height="80" />
    <Rect x="100" y="10" rx="4" ry="4" width="250" height="15" />
    <Rect x="100" y="35" rx="3" ry="3" width="200" height="12" />
    <Rect x="100" y="60" rx="3" ry="3" width="150" height="10" />
  </ContentLoader>
);
```

#### 3. Ajustar Estilos Finales

**Revisar consistencia:**
- [ ] Espaciados consistentes (usar spacing.ts)
- [ ] Colores de tema aplicados (no valores hardcoded)
- [ ] Tipografía consistente (tamaños, pesos)
- [ ] Bordes redondeados uniformes (8dp para cards, 4dp para botones)
- [ ] Sombras consistentes (elevation Android, shadowOffset iOS)
- [ ] Estados de botones (disabled, loading)

**Tema oscuro (opcional):**
```typescript
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};
```

**Accesibilidad:**
```typescript
// Agregar labels a todos los touchables
<TouchableOpacity
  accessible
  accessibilityLabel="Eliminar pieza"
  accessibilityHint="Presiona dos veces para eliminar esta pieza"
  accessibilityRole="button"
  onPress={handleDelete}
>
  <MaterialIcons name="delete" />
</TouchableOpacity>

// Tamaños de fuente escalables
<Text style={{ fontSize: 16 * fontScale }}>
  {pieza.nombre}
</Text>
```

#### 4. Testing en Dispositivo Real

**Checklist de pruebas:**

**Funcionalidad:**
- [ ] Crear 20 piezas de diferentes categorías
- [ ] Crear 10 vehículos de diferentes marcas
- [ ] Asignar 30 piezas a vehículos
- [ ] Eliminar pieza (verificar CASCADE en inventario)
- [ ] Eliminar vehículo (verificar CASCADE en inventario)
- [ ] Buscar piezas por nombre (probar 5 términos diferentes)
- [ ] Buscar vehículos por matrícula (probar 5 matrículas)
- [ ] Filtrar por categoría de pieza
- [ ] Filtrar por estado de vehículo
- [ ] Ordenar por precio, fecha, kilometraje

**Validaciones:**
- [ ] Intentar matrícula duplicada (debe rechazar)
- [ ] Intentar código de pieza duplicado (debe rechazar)
- [ ] Intentar matrícula inválida "12345AB" (debe rechazar)
- [ ] Intentar código de pieza con minúsculas "abc-123" (debe rechazar)
- [ ] Intentar precio negativo (debe rechazar)
- [ ] Intentar stock negativo (debe rechazar)
- [ ] Intentar año fuera de rango (debe rechazar)
- [ ] Intentar asignar misma pieza 2 veces al mismo vehículo (debe rechazar)

**Cámara y Scanner:**
- [ ] Tomar foto de pieza (verificar Base64 guardado)
- [ ] Seleccionar foto de galería
- [ ] Escanear código QR
- [ ] Escanear código de barras

**Mapas:**
- [ ] Ver mapa con 5 vehículos
- [ ] Tap en marcador → Bottom sheet aparece
- [ ] Presionar "Cómo llegar" → Google Maps abre
- [ ] Obtener ubicación actual del dispositivo

**Notificaciones:**
- [ ] Crear pieza con stock 0 → Notificación aparece
- [ ] Tap en notificación → Navega a detalle
- [ ] Badge actualizado en tab

**Gestos:**
- [ ] Swipe-to-delete en lista
- [ ] Pull-to-refresh
- [ ] Pinch-to-zoom en imagen
- [ ] Long-press para menú contextual

**Rendimiento:**
- [ ] Scroll suave en lista de 100+ elementos
- [ ] Búsqueda en tiempo real sin lag
- [ ] Animaciones a 60fps
- [ ] Carga de imágenes sin bloquear UI

#### 5. Preparar APK/IPA

**Android (APK):**
```bash
# Producción
eas build --platform android

# O build local
expo build:android
```

**iOS (IPA - requiere Apple Developer):**
```bash
eas build --platform ios
```

**Configurar `eas.json`:**
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundler": "metro"
      }
    }
  }
}
```

#### 6. Grabar Video Demo

**Estructura del video (3-5 minutos):**

1. **Intro (15s)**
   - Mostrar splash screen
   - Pantalla principal con tabs

2. **CRUD de Piezas (60s)**
   - Crear nueva pieza con foto
   - Buscar pieza
   - Editar pieza
   - Eliminar pieza con swipe

3. **CRUD de Vehículos (60s)**
   - Crear vehículo con GPS
   - Asignar pieza a vehículo
   - Ver detalle con lista de piezas extraídas

4. **Funcionalidades Extra (90s)**
   - Escanear código QR
   - Ver mapa de vehículos
   - Recibir notificación de stock bajo
   - Pinch-to-zoom en imagen

5. **Estadísticas (15s)**
   - Mostrar gráficos

6. **Outro (15s)**
   - Resumen de features

**Herramientas para grabar:**
- **Android:** `adb shell screenrecord`
- **iOS:** QuickTime Player (Mac)
- **Edición:** iMovie, Adobe Premiere, DaVinci Resolve

#### 7. Preparar Presentación

**`PRESENTACION.md`:**
```markdown
# AutoCiclo Mobile - Aplicación de Gestión de Desguace

## Resumen
Aplicación móvil para empleados de desguace que permite gestionar vehículos, piezas e inventario.

## Tecnologías
- React Native + Expo
- TypeScript
- SQLite
- React Navigation
- React Hook Form + Zod
- Expo Camera, Location, Notifications, Maps

## Características Principales

### CRUD Completo
- ✅ Gestión de Piezas (11 campos)
- ✅ Gestión de Vehículos (12 campos)
- ✅ Inventario de asignaciones (7 campos)

### Validaciones
- ✅ 12 tipos de validaciones replicadas del desktop
- ✅ Formato de matrícula (1234ABC)
- ✅ Código de pieza alfanumérico
- ✅ Prevención de duplicados
- ✅ Integridad referencial (CASCADE)

### Funcionalidades Multimedia
- ✅ Cámara para fotos de piezas (Base64)
- ✅ Escáner QR/Código de barras
- ✅ Galería de imágenes con zoom

### Mapas y Localización
- ✅ Mapa de vehículos con GPS
- ✅ Navegación a vehículo
- ✅ Plano 2D del almacén

### Notificaciones
- ✅ Alertas de stock bajo
- ✅ Badge con contador
- ✅ Deep linking desde notificación

### Gestos
- ✅ Swipe-to-delete
- ✅ Pull-to-refresh
- ✅ Pinch-to-zoom

## Estadísticas
- 📊 ~50 archivos creados
- 📊 ~5,000 líneas de código
- 📊 3 tablas de BD con relaciones
- 📊 15+ dependencias
- 📊 10 días de desarrollo

## Instalación
\`\`\`bash
git clone [repo]
cd AutoCicloMobile
npm install
npx expo start
\`\`\`

## Demo
[Link al video demo]

## Autor
[Tu nombre]
[Fecha: 6 enero 2025]
```

### Entregables del Día 10
- ✅ Navegación revisada y pulida
- ✅ Animaciones mejoradas
- ✅ Estilos consistentes
- ✅ Testing completo en dispositivo real
- ✅ APK/IPA generado
- ✅ Video demo grabado (3-5 min)
- ✅ Presentación preparada
- ✅ README actualizado

### Checklist Final
- [ ] Código documentado
- [ ] Sin warnings en consola
- [ ] Sin errores TypeScript
- [ ] Todos los formularios validados
- [ ] Todas las pantallas navegables
- [ ] Todos los CRUDs funcionando
- [ ] Base de datos con datos de prueba
- [ ] Video demo grabado
- [ ] APK instalable
- [ ] Presentación lista

---

## 📊 RESUMEN DEL PROYECTO

### Estadísticas Finales Estimadas

**Archivos creados:** ~60
**Líneas de código:** ~6,000
**Componentes:** 25+
**Pantallas:** 15+
**Servicios:** 4
**Modelos:** 3
**Dependencias:** 20+

### Tecnologías Utilizadas

**Core:**
- React Native
- Expo SDK 52
- TypeScript
- SQLite

**Navegación:**
- React Navigation 6
- Stack Navigator
- Bottom Tabs Navigator

**Formularios:**
- React Hook Form
- Zod (validación)

**UI:**
- React Native Paper
- Expo Vector Icons
- React Native Reanimated

**Funcionalidades:**
- Expo Camera
- Expo Image Picker
- Expo Barcode Scanner
- React Native Maps
- Expo Location
- Expo Notifications

### Diferencias con Desktop

| Característica | Desktop (JavaFX) | Mobile (React Native) |
|----------------|------------------|----------------------|
| Base de datos | MySQL 8.0 | SQLite |
| Lenguaje | Java 24 | TypeScript |
| UI Framework | JavaFX | React Native |
| Navegación | Scene switching | React Navigation |
| Imágenes | Base64 (LONGTEXT) | Base64 (TEXT) |
| Estadísticas | BarChart, PieChart | react-native-chart-kit |
| Cámara | ❌ No | ✅ Expo Camera |
| GPS/Mapas | ❌ No | ✅ React Native Maps |
| Notificaciones | ❌ No | ✅ Expo Notifications |
| Gestos | Click/Hover | Touch/Swipe/Pinch |

### Funcionalidades Adicionales en Mobile

1. **Cámara integrada** - Fotos de piezas
2. **Escáner QR/Barras** - Búsqueda rápida
3. **GPS y mapas** - Ubicación de vehículos
4. **Notificaciones push** - Alertas de stock
5. **Gestos táctiles** - Swipe, pinch, long-press
6. **Portabilidad** - Uso en almacén sin PC

### Posibles Mejoras Futuras

**Post-Desarrollo (Día 11+):**
- [ ] Sincronización con servidor (API REST)
- [ ] Autenticación de usuarios
- [ ] Roles y permisos (admin/empleado)
- [ ] Exportar inventario a PDF/Excel
- [ ] Gráficos avanzados (Victory Charts)
- [ ] Modo offline con sync
- [ ] Chat interno entre empleados
- [ ] Historial de cambios (audit log)
- [ ] Backup automático a cloud
- [ ] Tema oscuro completo
- [ ] Soporte multi-idioma (i18n)
- [ ] Accesibilidad completa (WCAG)

---

## 🎯 CONCLUSIÓN

Este proyecto replica exitosamente las funcionalidades principales de la aplicación de escritorio AutoCiclo, adaptándolas al ecosistema móvil con mejoras significativas:

✅ **CRUD completo** de las 3 entidades principales
✅ **Validaciones exhaustivas** replicadas del desktop
✅ **Base de datos robusta** con integridad referencial
✅ **UI moderna** siguiendo Material Design 3
✅ **Funcionalidades extra** aprovechando capacidades móviles
✅ **Rendimiento optimizado** con paginación y lazy loading
✅ **UX mejorada** con gestos táctiles intuitivos

La planificación de 10 días es **realista** considerando:
- Reutilización del esquema de BD existente
- Uso de Expo para acelerar desarrollo
- Componentes base reutilizables
- TypeScript para reducir bugs
- React Hook Form para formularios rápidos

**Total estimado:** 60-70 horas de desarrollo distribuidas en 10 días.

---

**Fecha de creación:** 27 diciembre 2024
**Fecha de finalización prevista:** 6 enero 2025
**Autor:** [Tu nombre]
