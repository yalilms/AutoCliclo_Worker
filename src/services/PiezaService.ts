/**
 * Servicio para operaciones CRUD de Piezas
 * Replicado de FormularioPiezaController.java del desktop
 */

import { ejecutarConsulta, obtenerResultados, obtenerUnResultado, existeRegistro } from '../database/dataBase';
import { Pieza } from '../models/Pieza';
import { ELEMENTOS_POR_PAGINA } from '../utils/constantes';

export class PiezaService {
  /**
   * CREATE - Insertar nueva pieza
   */
  static async crear(pieza: Omit<Pieza, 'id_pieza'>): Promise<number> {
    try {
      // Verificar código duplicado
      const existe = await existeRegistro('piezas', 'codigo_pieza', pieza.codigo_pieza);
      if (existe) {
        throw new Error(`El código de pieza "${pieza.codigo_pieza}" ya existe`);
      }

      const resultado = await ejecutarConsulta(
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
        ]
      );

      console.log(`✅ Pieza creada con ID: ${resultado.insertId}`);
      return resultado.insertId!;
    } catch (error) {
      console.error('❌ Error al crear pieza:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener todas las piezas con paginación
   */
  static async obtenerTodos(
    pagina: number = 1,
    limite: number = ELEMENTOS_POR_PAGINA,
    terminoBusqueda: string = ''
  ): Promise<{ piezas: Pieza[]; total: number }> {
    try {
      const offset = (pagina - 1) * limite;

      // Construir cláusula WHERE para búsqueda
      const whereClause = terminoBusqueda
        ? `WHERE nombre LIKE ? OR codigo_pieza LIKE ? OR categoria LIKE ?`
        : '';

      const searchParams = terminoBusqueda
        ? [`%${terminoBusqueda}%`, `%${terminoBusqueda}%`, `%${terminoBusqueda}%`]
        : [];

      // Contar total
      const countResult = await obtenerUnResultado<{ total: number }>(
        `SELECT COUNT(*) as total FROM piezas ${whereClause}`,
        searchParams
      );
      const total = countResult?.total ?? 0;

      // Obtener piezas paginadas
      const piezas = await obtenerResultados<Pieza>(
        `SELECT * FROM piezas ${whereClause}
         ORDER BY nombre ASC
         LIMIT ? OFFSET ?`,
        [...searchParams, limite, offset]
      );

      return { piezas, total };
    } catch (error) {
      console.error('❌ Error al obtener piezas:', error);
      throw error;
    }
  }

  /**
   * READ - Obtener pieza por ID
   */
  static async obtenerPorId(id: number): Promise<Pieza | null> {
    try {
      const pieza = await obtenerUnResultado<Pieza>(
        'SELECT * FROM piezas WHERE id_pieza = ?',
        [id]
      );
      return pieza;
    } catch (error) {
      console.error('❌ Error al obtener pieza por ID:', error);
      throw error;
    }
  }

  /**
   * UPDATE - Actualizar pieza
   * Nota: codigo_pieza NO es editable (como en desktop)
   */
  static async actualizar(id: number, pieza: Partial<Pieza>): Promise<void> {
    try {
      await ejecutarConsulta(
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
          pieza.ubicacion_almacen ?? '',
          pieza.compatible_marcas ?? '',
          pieza.imagen ?? '',
          pieza.descripcion ?? '',
          id
        ]
      );

      console.log(`✅ Pieza actualizada: ${id}`);
    } catch (error) {
      console.error('❌ Error al actualizar pieza:', error);
      throw error;
    }
  }

  /**
   * DELETE - Eliminar pieza
   * Importante: Esto eliminará también las asignaciones en inventario (CASCADE)
   */
  static async eliminar(id: number): Promise<void> {
    try {
      await ejecutarConsulta(
        'DELETE FROM piezas WHERE id_pieza = ?',
        [id]
      );

      console.log(`✅ Pieza eliminada: ${id}`);
    } catch (error) {
      console.error('❌ Error al eliminar pieza:', error);
      throw error;
    }
  }

  /**
   * VALIDAR - Verificar si existe código de pieza (para evitar duplicados)
   */
  static async existeCodigoPieza(codigo: string, excludeId?: number): Promise<boolean> {
    try {
      return await existeRegistro('piezas', 'codigo_pieza', codigo, excludeId);
    } catch (error) {
      console.error('❌ Error al verificar código de pieza:', error);
      throw error;
    }
  }

  /**
   * BUSCAR - Búsqueda avanzada (sin paginación)
   */
  static async buscar(termino: string): Promise<Pieza[]> {
    try {
      const piezas = await obtenerResultados<Pieza>(
        `SELECT * FROM piezas
         WHERE nombre LIKE ? OR codigo_pieza LIKE ? OR categoria LIKE ?
         ORDER BY nombre ASC`,
        [`%${termino}%`, `%${termino}%`, `%${termino}%`]
      );

      return piezas;
    } catch (error) {
      console.error('❌ Error al buscar piezas:', error);
      throw error;
    }
  }

  /**
   * STOCK BAJO - Obtener piezas con stock bajo (para notificaciones)
   */
  static async obtenerStockBajo(): Promise<Pieza[]> {
    try {
      const piezas = await obtenerResultados<Pieza>(
        'SELECT * FROM piezas WHERE stock_disponible < stock_minimo',
        []
      );

      return piezas;
    } catch (error) {
      console.error('❌ Error al obtener piezas con stock bajo:', error);
      throw error;
    }
  }

  /**
   * CATEGORÍA - Obtener piezas por categoría
   */
  static async obtenerPorCategoria(categoria: string): Promise<Pieza[]> {
    try {
      const piezas = await obtenerResultados<Pieza>(
        'SELECT * FROM piezas WHERE categoria = ? ORDER BY nombre ASC',
        [categoria]
      );

      return piezas;
    } catch (error) {
      console.error('❌ Error al obtener piezas por categoría:', error);
      throw error;
    }
  }

  /**
   * ESTADÍSTICAS - Contar piezas por categoría
   */
  static async contarPorCategoria(): Promise<{ categoria: string; total: number }[]> {
    try {
      const resultados = await obtenerResultados<{ categoria: string; total: number }>(
        `SELECT categoria, COUNT(*) as total
         FROM piezas
         GROUP BY categoria
         ORDER BY total DESC`,
        []
      );

      return resultados;
    } catch (error) {
      console.error('❌ Error al contar piezas por categoría:', error);
      throw error;
    }
  }
}
