/**
 * Servicio para operaciones CRUD de Vehículos
 * Replicado de FormularioVehiculoController.java del desktop
 */

import { ejecutarConsulta, obtenerResultados, obtenerUnResultado, existeRegistro } from '../database/dataBase';
import { Vehiculo, VehiculoConPiezas } from '../models/Vehiculo';
import { ELEMENTOS_POR_PAGINA } from '../utils/constantes';

export class VehiculoService {
  /**
   * CREATE - Insertar nuevo vehículo
   */
  static async crear(vehiculo: Omit<Vehiculo, 'id_vehiculo'>): Promise<number> {
    try {
      // Verificar matrícula duplicada
      const existe = await existeRegistro('vehiculos', 'matricula', vehiculo.matricula);
      if (existe) {
        throw new Error(`La matrícula "${vehiculo.matricula}" ya existe`);
      }

      const resultado = await ejecutarConsulta(
        `INSERT INTO vehiculos (
          matricula, marca, modelo, anio, color, fecha_entrada,
          estado, precio_compra, kilometraje, ubicacion_gps, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehiculo.matricula,
          vehiculo.marca,
          vehiculo.modelo,
          vehiculo.anio,
          vehiculo.color ?? '',
          vehiculo.fecha_entrada,
          vehiculo.estado,
          vehiculo.precio_compra,
          vehiculo.kilometraje,
          vehiculo.ubicacion_gps ?? '',
          vehiculo.observaciones ?? ''
        ]
      );

      console.log(`✅ Vehículo creado con ID: ${resultado.insertId}`);
      return resultado.insertId!;
    } catch (error) {
      console.error('❌ Error al crear vehículo:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener todos los vehículos con paginación y filtros
   */
  static async obtenerTodos(
    pagina: number = 1,
    limite: number = ELEMENTOS_POR_PAGINA,
    terminoBusqueda: string = '',
    filtroEstado?: string
  ): Promise<{ vehiculos: Vehiculo[]; total: number }> {
    try {
      const offset = (pagina - 1) * limite;

      // Construir cláusula WHERE
      const condiciones: string[] = [];
      const parametros: any[] = [];

      if (terminoBusqueda) {
        condiciones.push('(matricula LIKE ? OR marca LIKE ? OR modelo LIKE ?)');
        parametros.push(`%${terminoBusqueda}%`, `%${terminoBusqueda}%`, `%${terminoBusqueda}%`);
      }

      if (filtroEstado) {
        condiciones.push('estado = ?');
        parametros.push(filtroEstado);
      }

      const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

      // Contar total
      const countResult = await obtenerUnResultado<{ total: number }>(
        `SELECT COUNT(*) as total FROM vehiculos ${whereClause}`,
        parametros
      );
      const total = countResult?.total ?? 0;

      // Obtener vehículos paginados
      const vehiculos = await obtenerResultados<Vehiculo>(
        `SELECT * FROM vehiculos ${whereClause}
         ORDER BY fecha_entrada DESC
         LIMIT ? OFFSET ?`,
        [...parametros, limite, offset]
      );

      return { vehiculos, total };
    } catch (error) {
      console.error('❌ Error al obtener vehículos:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener vehículo por ID
   */
  static async obtenerPorId(id: number): Promise<Vehiculo | null> {
    try {
      const vehiculo = await obtenerUnResultado<Vehiculo>(
        'SELECT * FROM vehiculos WHERE id_vehiculo = ?',
        [id]
      );
      return vehiculo;
    } catch (error) {
      console.error('❌ Error al obtener vehículo por ID:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener vehículo con total de piezas
   */
  static async obtenerConPiezas(id: number): Promise<VehiculoConPiezas | null> {
    try {
      const vehiculo = await obtenerUnResultado<VehiculoConPiezas>(
        `SELECT v.*, COUNT(ip.id_pieza) as total_piezas
         FROM vehiculos v
         LEFT JOIN inventario_piezas ip ON v.id_vehiculo = ip.id_vehiculo
         WHERE v.id_vehiculo = ?
         GROUP BY v.id_vehiculo`,
        [id]
      );
      return vehiculo;
    } catch (error) {
      console.error('❌ Error al obtener vehículo con piezas:', error);
      throw error;
    }
  }

  /**
   * UPDATE - Actualizar vehículo
   * Nota: matricula NO es editable (como en desktop)
   */
  static async actualizar(id: number, vehiculo: Partial<Vehiculo>): Promise<void> {
    try {
      await ejecutarConsulta(
        `UPDATE vehiculos SET
          marca = ?, modelo = ?, anio = ?, color = ?,
          fecha_entrada = ?, estado = ?, precio_compra = ?,
          kilometraje = ?, ubicacion_gps = ?, observaciones = ?
        WHERE id_vehiculo = ?`,
        [
          vehiculo.marca,
          vehiculo.modelo,
          vehiculo.anio,
          vehiculo.color ?? '',
          vehiculo.fecha_entrada,
          vehiculo.estado,
          vehiculo.precio_compra,
          vehiculo.kilometraje,
          vehiculo.ubicacion_gps ?? '',
          vehiculo.observaciones ?? '',
          id
        ]
      );

      console.log(`✅ Vehículo actualizado: ${id}`);
    } catch (error) {
      console.error('❌ Error al actualizar vehículo:', error);
      throw error;
    }
  }

  /**
   * DELETE - Eliminar vehículo
   * Importante: Esto eliminará también las asignaciones en inventario (CASCADE)
   */
  static async eliminar(id: number): Promise<void> {
    try {
      await ejecutarConsulta(
        'DELETE FROM vehiculos WHERE id_vehiculo = ?',
        [id]
      );

      console.log(`✅ Vehículo eliminado: ${id}`);
    } catch (error) {
      console.error('❌ Error al eliminar vehículo:', error);
      throw error;
    }
  }

  /**
   * VALIDAR - Verificar si existe matrícula (para evitar duplicados)
   */
  static async existeMatricula(matricula: string, excludeId?: number): Promise<boolean> {
    try {
      return await existeRegistro('vehiculos', 'matricula', matricula, excludeId);
    } catch (error) {
      console.error('❌ Error al verificar matrícula:', error);
      throw error;
    }
  }

  /**
   * BUSCAR - Búsqueda avanzada (sin paginación)
   */
  static async buscar(termino: string): Promise<Vehiculo[]> {
    try {
      const vehiculos = await obtenerResultados<Vehiculo>(
        `SELECT * FROM vehiculos
         WHERE matricula LIKE ? OR marca LIKE ? OR modelo LIKE ?
         ORDER BY fecha_entrada DESC`,
        [`%${termino}%`, `%${termino}%`, `%${termino}%`]
      );

      return vehiculos;
    } catch (error) {
      console.error('❌ Error al buscar vehículos:', error);
      throw error;
    }
  }

  /**
   * ESTADO - Obtener vehículos por estado
   */
  static async obtenerPorEstado(estado: string): Promise<Vehiculo[]> {
    try {
      const vehiculos = await obtenerResultados<Vehiculo>(
        'SELECT * FROM vehiculos WHERE estado = ? ORDER BY fecha_entrada DESC',
        [estado]
      );

      return vehiculos;
    } catch (error) {
      console.error('❌ Error al obtener vehículos por estado:', error);
      throw error;
    }
  }

  /**
   * ESTADÍSTICAS - Contar vehículos por marca
   */
  static async contarPorMarca(): Promise<{ marca: string; total: number }[]> {
    try {
      const resultados = await obtenerResultados<{ marca: string; total: number }>(
        `SELECT marca, COUNT(*) as total
         FROM vehiculos
         GROUP BY marca
         ORDER BY total DESC`,
        []
      );

      return resultados;
    } catch (error) {
      console.error('❌ Error al contar vehículos por marca:', error);
      throw error;
    }
  }

  /**
   * ESTADÍSTICAS - Top vehículos por kilometraje
   */
  static async topPorKilometraje(limite: number = 5): Promise<Vehiculo[]> {
    try {
      const vehiculos = await obtenerResultados<Vehiculo>(
        'SELECT * FROM vehiculos ORDER BY kilometraje DESC LIMIT ?',
        [limite]
      );

      return vehiculos;
    } catch (error) {
      console.error('❌ Error al obtener top por kilometraje:', error);
      throw error;
    }
  }
}
