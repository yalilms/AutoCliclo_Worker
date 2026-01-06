/**
 * Modelo de datos para Piezas
 * Replicado del modelo Pieza.java del desktop
 */

import { CategoriaPieza } from '../utils/constantes';

/**
 * Interface principal de Pieza
 * Corresponde a la tabla 'piezas' en SQLite
 */
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

/**
 * Interface para datos de formulario
 * Los campos numéricos son strings para facilitar input
 */
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

/**
 * Convertir PiezaFormData a Pieza
 */
export const formDataToPieza = (formData: PiezaFormData): Omit<Pieza, 'id_pieza'> => {
  return {
    codigo_pieza: formData.codigo_pieza.toUpperCase(), // Siempre en mayúsculas
    nombre: formData.nombre,
    categoria: formData.categoria,
    precio_venta: parseFloat(formData.precio_venta) || 0,
    stock_disponible: parseInt(formData.stock_disponible) || 0,
    stock_minimo: parseInt(formData.stock_minimo) || 1,
    ubicacion_almacen: formData.ubicacion_almacen,
    compatible_marcas: formData.compatible_marcas,
    descripcion: formData.descripcion,
  };
};

/**
 * Convertir Pieza a PiezaFormData
 */
export const piezaToFormData = (pieza: Pieza): PiezaFormData => {
  return {
    codigo_pieza: pieza.codigo_pieza,
    nombre: pieza.nombre,
    categoria: pieza.categoria,
    precio_venta: pieza.precio_venta.toString(),
    stock_disponible: pieza.stock_disponible.toString(),
    stock_minimo: pieza.stock_minimo.toString(),
    ubicacion_almacen: pieza.ubicacion_almacen || '',
    compatible_marcas: pieza.compatible_marcas || '',
    descripcion: pieza.descripcion || '',
  };
};
