/**
 * Modelo de datos para Inventario de Piezas
 * Relación N:N entre Vehículos y Piezas
 */

import { EstadoPieza } from '../utils/constantes';

/**
 * Interface principal de InventarioPieza
 * Corresponde a la tabla 'inventario_piezas' en SQLite
 */
export interface InventarioPieza {
  id_vehiculo: number;
  id_pieza: number;
  cantidad: number;
  estado_pieza: EstadoPieza;
  fecha_extraccion: string; // ISO 8601 (YYYY-MM-DD)
  precio_unitario: number;
  notas?: string;
}

/**
 * Interface extendida con información de vehículo y pieza
 */
export interface InventarioPiezaDetalle extends InventarioPieza {
  id_inventario?: number;
  matricula: string;
  marca: string;
  modelo: string;
  codigo_pieza: string;
  nombre_pieza: string;
  categoria_pieza: string;
}

/**
 * Interface para datos de formulario
 */
export interface InventarioPiezaFormData {
  id_vehiculo: string;
  id_pieza: string;
  cantidad: string;
  estado_pieza: EstadoPieza;
  fecha_extraccion: string;
  precio_unitario: string;
  notas: string;
}

/**
 * Convertir FormData a InventarioPieza
 */
export const formDataToInventario = (formData: InventarioPiezaFormData): InventarioPieza => {
  return {
    id_vehiculo: parseInt(formData.id_vehiculo),
    id_pieza: parseInt(formData.id_pieza),
    cantidad: parseInt(formData.cantidad) || 1,
    estado_pieza: formData.estado_pieza,
    fecha_extraccion: formData.fecha_extraccion || new Date().toISOString().split('T')[0],
    precio_unitario: parseFloat(formData.precio_unitario) || 0,
    notas: formData.notas,
  };
};

/**
 * Convertir InventarioPieza a FormData
 */
export const inventarioToFormData = (inventario: InventarioPieza): InventarioPiezaFormData => {
  return {
    id_vehiculo: inventario.id_vehiculo.toString(),
    id_pieza: inventario.id_pieza.toString(),
    cantidad: inventario.cantidad.toString(),
    estado_pieza: inventario.estado_pieza,
    fecha_extraccion: inventario.fecha_extraccion,
    precio_unitario: inventario.precio_unitario.toString(),
    notas: inventario.notas || '',
  };
};
