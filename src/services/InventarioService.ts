/**
 * Servicio para operaciones CRUD de Inventario de Piezas
 * Gestiona la relación N:N entre Vehículos y Piezas
 */

import { ejecutarConsulta, obtenerResultados, obtenerUnResultado } from '../database/dataBase';
import { InventarioPieza, InventarioPiezaDetalle } from '../models/InventarioPieza';

export class InventarioService {
  /**
   * CREATE - Asignar pieza a vehículo
   */
  static async crear(inventario: InventarioPieza): Promise<void> {
    try {
      // Verificar si ya existe la asignación
      const existe = await this.existe(inventario.id_vehiculo, inventario.id_pieza);
      if (existe) {
        throw new Error('Esta pieza ya está asignada a este vehículo');
      }

      await ejecutarConsulta(
        `INSERT INTO inventario_piezas (
          id_vehiculo, id_pieza, cantidad, estado_pieza,
          fecha_extraccion, precio_unitario, notas
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          inventario.id_vehiculo,
          inventario.id_pieza,
          inventario.cantidad,
          inventario.estado_pieza,
          inventario.fecha_extraccion,
          inventario.precio_unitario,
          inventario.notas ?? ''
        ]
      );

      console.log(`✅ Pieza asignada al vehículo`);
    } catch (error) {
      console.error('❌ Error al asignar pieza:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener todas las asignaciones con detalles
   */
  static async obtenerTodos(): Promise<InventarioPiezaDetalle[]> {
    try {
      const resultados = await obtenerResultados<InventarioPiezaDetalle>(
        `SELECT
          ip.id_inventario,
          ip.id_vehiculo,
          ip.id_pieza,
          ip.cantidad,
          ip.estado_pieza,
          ip.fecha_extraccion,
          ip.precio_unitario,
          ip.notas,
          v.matricula,
          v.marca,
          v.modelo,
          p.codigo_pieza,
          p.nombre as nombre_pieza,
          p.categoria as categoria_pieza
         FROM inventario_piezas ip
         INNER JOIN vehiculos v ON ip.id_vehiculo = v.id_vehiculo
         INNER JOIN piezas p ON ip.id_pieza = p.id_pieza
         ORDER BY ip.fecha_extraccion DESC`,
        []
      );

      return resultados;
    } catch (error) {
      console.error('❌ Error al obtener inventario:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener piezas de un vehículo específico
   */
  static async obtenerPorVehiculo(idVehiculo: number): Promise<InventarioPiezaDetalle[]> {
    try {
      const resultados = await obtenerResultados<InventarioPiezaDetalle>(
        `SELECT
          ip.id_inventario,
          ip.id_vehiculo,
          ip.id_pieza,
          ip.cantidad,
          ip.estado_pieza,
          ip.fecha_extraccion,
          ip.precio_unitario,
          ip.notas,
          v.matricula,
          v.marca,
          v.modelo,
          p.codigo_pieza,
          p.nombre as nombre_pieza,
          p.categoria as categoria_pieza
         FROM inventario_piezas ip
         INNER JOIN vehiculos v ON ip.id_vehiculo = v.id_vehiculo
         INNER JOIN piezas p ON ip.id_pieza = p.id_pieza
         WHERE ip.id_vehiculo = ?
         ORDER BY ip.fecha_extraccion DESC`,
        [idVehiculo]
      );

      return resultados;
    } catch (error) {
      console.error('❌ Error al obtener piezas del vehículo:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener vehículos que tienen una pieza específica
   */
  static async obtenerPorPieza(idPieza: number): Promise<InventarioPiezaDetalle[]> {
    try {
      const resultados = await obtenerResultados<InventarioPiezaDetalle>(
        `SELECT
          ip.id_inventario,
          ip.id_vehiculo,
          ip.id_pieza,
          ip.cantidad,
          ip.estado_pieza,
          ip.fecha_extraccion,
          ip.precio_unitario,
          ip.notas,
          v.matricula,
          v.marca,
          v.modelo,
          p.codigo_pieza,
          p.nombre as nombre_pieza,
          p.categoria as categoria_pieza
         FROM inventario_piezas ip
         INNER JOIN vehiculos v ON ip.id_vehiculo = v.id_vehiculo
         INNER JOIN piezas p ON ip.id_pieza = p.id_pieza
         WHERE ip.id_pieza = ?
         ORDER BY ip.fecha_extraccion DESC`,
        [idPieza]
      );

      return resultados;
    } catch (error) {
      console.error('❌ Error al obtener vehículos con esta pieza:', error);
      throw error;
    }
  }

  /**
   * UPDATE - Actualizar asignación
   */
  static async actualizar(
    idVehiculo: number,
    idPieza: number,
    datos: Partial<InventarioPieza>
  ): Promise<void> {
    try {
      await ejecutarConsulta(
        `UPDATE inventario_piezas SET
          cantidad = ?, estado_pieza = ?, fecha_extraccion = ?,
          precio_unitario = ?, notas = ?
        WHERE id_vehiculo = ? AND id_pieza = ?`,
        [
          datos.cantidad,
          datos.estado_pieza,
          datos.fecha_extraccion,
          datos.precio_unitario,
          datos.notas ?? '',
          idVehiculo,
          idPieza
        ]
      );

      console.log(`✅ Asignación actualizada`);
    } catch (error) {
      console.error('❌ Error al actualizar asignación:', error);
      throw error;
    }
  }

  /**
   * DELETE - Eliminar asignación por ID
   */
  static async eliminar(idInventario: number): Promise<void> {
    try {
      await ejecutarConsulta(
        'DELETE FROM inventario_piezas WHERE id_inventario = ?',
        [idInventario]
      );

      console.log(`✅ Asignación eliminada`);
    } catch (error) {
      console.error('❌ Error al eliminar asignación:', error);
      throw error;
    }
  }

  /**
   * VALIDAR - Verificar si existe asignación
   */
  static async existe(idVehiculo: number, idPieza: number): Promise<boolean> {
    try {
      const resultado = await obtenerUnResultado<{ count: number }>(
        'SELECT COUNT(*) as count FROM inventario_piezas WHERE id_vehiculo = ? AND id_pieza = ?',
        [idVehiculo, idPieza]
      );

      return (resultado?.count ?? 0) > 0;
    } catch (error) {
      console.error('❌ Error al verificar asignación:', error);
      throw error;
    }
  }

  /**
   * ESTADÍSTICAS - Contar total de piezas extraídas
   */
  static async contarTotalPiezas(): Promise<number> {
    try {
      const resultado = await obtenerUnResultado<{ total: number }>(
        'SELECT SUM(cantidad) as total FROM inventario_piezas',
        []
      );

      return resultado?.total ?? 0;
    } catch (error) {
      console.error('❌ Error al contar piezas:', error);
      throw error;
    }
  }
}
