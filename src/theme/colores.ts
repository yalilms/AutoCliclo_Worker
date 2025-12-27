/**
 * Paleta de colores de AutoCiclo Mobile
 * Replicada de la aplicación de escritorio JavaFX
 */

export const colores = {
  // Colores principales
  primario: '#2196F3',
  secundario: '#FF9800',
  exito: '#4CAF50',
  error: '#F44336',
  advertencia: '#FFC107',
  info: '#00BCD4',

  // Fondos
  fondo: '#F5F5F5',
  superficie: '#FFFFFF',

  // Textos
  texto: '#212121',
  textoSecundario: '#757575',
  textoDeshabilitado: '#9E9E9E',

  // Bordes (replicados de ValidationUtils.java)
  borde: '#BDC3C7',           // NORMAL_STYLE
  bordeError: '#E74C3C',      // ERROR_STYLE
  bordeExito: '#27AE60',      // SUCCESS_STYLE
  divisor: '#BDBDBD',

  // Estados de vehículo (replicados del ENUM de MySQL)
  completo: '#4CAF50',      // Verde
  desguazando: '#FF9800',   // Naranja
  desguazado: '#9E9E9E',    // Gris

  // Categorías de piezas (replicadas del ENUM de MySQL)
  motor: '#F44336',         // Rojo
  carroceria: '#2196F3',    // Azul
  interior: '#9C27B0',      // Púrpura
  electronica: '#FF9800',   // Naranja
  ruedas: '#607D8B',        // Gris azulado
  otros: '#795548',         // Marrón

  // Estados de pieza en inventario
  nueva: '#4CAF50',         // Verde
  usada: '#FF9800',         // Naranja
  reparada: '#2196F3',      // Azul

  // Estados de stock
  stockNormal: '#4CAF50',   // Verde
  stockBajo: '#FFC107',     // Amarillo
  stockAgotado: '#F44336',  // Rojo
};
