/**
 * Utilidades para cargar datos de vehículos desde JSON
 * Replicado de la carga de datos del desktop
 */

import vehiculosJson from '../data/vehiculos.json';
import ubicacionesJson from '../data/ubicaciones.json';

/**
 * Obtener todas las marcas disponibles (ordenadas alfabéticamente)
 */
export const obtenerMarcas = (): string[] => {
  return Object.keys(vehiculosJson).sort();
};

/**
 * Obtener modelos de una marca específica
 */
export const obtenerModelos = (marca: string): string[] => {
  return vehiculosJson[marca as keyof typeof vehiculosJson] || [];
};

/**
 * Obtener ubicaciones disponibles para vehículos
 */
export const obtenerUbicacionesVehiculos = (): string[] => {
  return ubicacionesJson.vehiculos;
};

/**
 * Obtener ubicaciones disponibles para piezas
 */
export const obtenerUbicacionesPiezas = (): string[] => {
  return ubicacionesJson.piezas;
};

/**
 * Verificar si una marca existe
 */
export const existeMarca = (marca: string): boolean => {
  return marca in vehiculosJson;
};

/**
 * Verificar si un modelo existe para una marca
 */
export const existeModelo = (marca: string, modelo: string): boolean => {
  const modelos = obtenerModelos(marca);
  return modelos.includes(modelo);
};
