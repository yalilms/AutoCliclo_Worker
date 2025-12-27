/**
 * Constantes de AutoCiclo Mobile
 * Replicadas de la aplicación de escritorio JavaFX
 */

// Estados de vehículo (replicados de MySQL ENUM)
export const ESTADO_VEHICULO = ['completo', 'desguazando', 'desguazado'] as const;
export type EstadoVehiculo = typeof ESTADO_VEHICULO[number];

// Categorías de piezas (replicadas de MySQL ENUM)
export const CATEGORIAS_PIEZA = ['motor', 'carroceria', 'interior', 'electronica', 'ruedas', 'otros'] as const;
export type CategoriaPieza = typeof CATEGORIAS_PIEZA[number];

// Estados de pieza en inventario (replicados de MySQL ENUM)
export const ESTADO_PIEZA = ['nueva', 'usada', 'reparada'] as const;
export type EstadoPieza = typeof ESTADO_PIEZA[number];

// Constantes de paginación
export const ELEMENTOS_POR_PAGINA = 10;

// Validaciones (replicadas de ValidationUtils.java)
export const MATRICULA_REGEX = /^\d{4}[A-Z]{3}$/;
export const CODIGO_PIEZA_REGEX = /^[A-Z0-9\-]+$/;

// Rangos de año de vehículo
export const MIN_ANIO = 1900;
export const MAX_ANIO = new Date().getFullYear();

// Stock
export const STOCK_MINIMO_DEFAULT = 1;
export const STOCK_BAJO_UMBRAL = 5; // Para notificaciones

// Constantes generales
export const CONSTANTES = {
  ELEMENTOS_POR_PAGINA,
  ESTADO_VEHICULO,
  CATEGORIAS_PIEZA,
  ESTADO_PIEZA,
  MATRICULA_REGEX,
  CODIGO_PIEZA_REGEX,
  MIN_ANIO,
  MAX_ANIO,
  STOCK_MINIMO_DEFAULT,
  STOCK_BAJO_UMBRAL,
};
