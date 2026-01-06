/**
 * Modelo de datos para Vehículos
 * Replicado del modelo Vehiculo.java del desktop
 */

import { EstadoVehiculo } from '../utils/constantes';

/**
 * Interface principal de Vehículo
 * Corresponde a la tabla 'vehiculos' en SQLite
 */
export interface Vehiculo {
  id_vehiculo?: number;
  matricula: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  fecha_entrada: string; // ISO 8601 (YYYY-MM-DD)
  estado: EstadoVehiculo;
  precio_compra: number;
  kilometraje: number;
  ubicacion_gps?: string;
  observaciones?: string;
}

/**
 * Interface para vehículo con piezas asociadas
 */
export interface VehiculoConPiezas extends Vehiculo {
  total_piezas: number;
}

/**
 * Interface para datos de formulario
 * Los campos numéricos son strings para facilitar input
 */
export interface VehiculoFormData {
  matricula: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  fecha_entrada: string;
  estado: EstadoVehiculo;
  precio_compra: string;
  kilometraje: string;
  ubicacion_gps: string;
  observaciones: string;
}

/**
 * Convertir VehiculoFormData a Vehiculo
 */
export const formDataToVehiculo = (formData: VehiculoFormData): Omit<Vehiculo, 'id_vehiculo'> => {
  return {
    matricula: formData.matricula.toUpperCase(), // Siempre en mayúsculas
    marca: formData.marca,
    modelo: formData.modelo,
    anio: parseInt(formData.anio) || new Date().getFullYear(),
    color: formData.color,
    fecha_entrada: formData.fecha_entrada || new Date().toISOString().split('T')[0],
    estado: formData.estado,
    precio_compra: parseFloat(formData.precio_compra) || 0,
    kilometraje: parseInt(formData.kilometraje) || 0,
    ubicacion_gps: formData.ubicacion_gps,
    observaciones: formData.observaciones,
  };
};

/**
 * Convertir Vehiculo a VehiculoFormData
 */
export const vehiculoToFormData = (vehiculo: Vehiculo): VehiculoFormData => {
  return {
    matricula: vehiculo.matricula,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    anio: vehiculo.anio.toString(),
    color: vehiculo.color || '',
    fecha_entrada: vehiculo.fecha_entrada,
    estado: vehiculo.estado,
    precio_compra: vehiculo.precio_compra.toString(),
    kilometraje: vehiculo.kilometraje.toString(),
    ubicacion_gps: vehiculo.ubicacion_gps || '',
    observaciones: vehiculo.observaciones || '',
  };
};

/**
 * Formatear matrícula (formato español: 1234ABC)
 */
export const formatearMatricula = (matricula: string): string => {
  const limpia = matricula.toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (limpia.length <= 4) return limpia;
  return limpia.slice(0, 4) + limpia.slice(4, 7);
};
