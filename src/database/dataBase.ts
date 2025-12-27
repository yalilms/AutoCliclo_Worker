/**
 * Configuración de la base de datos SQLite
 * Replicada del esquema MySQL de la aplicación de escritorio AutoCiclo
 */

import * as SQLite from 'expo-sqlite';

// Abrir/crear base de datos
export const db = SQLite.openDatabaseSync('autociclo.db');

/**
 * Inicializar la base de datos con las 3 tablas principales
 * Replica exactamente el esquema de MySQL del desktop
 */
export const inicializarBaseDatos = async (): Promise<void> => {
  try {
    // Habilitar claves foráneas (importante para CASCADE)
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // ============================================================
    // TABLA 1: VEHICULOS (replicada de MySQL)
    // ============================================================
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vehiculos (
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
      );
    `);

    // ============================================================
    // TABLA 2: PIEZAS (replicada de MySQL)
    // ============================================================
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS piezas (
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
      );
    `);

    // ============================================================
    // TABLA 3: INVENTARIO_PIEZAS (tabla de relación N:N)
    // ============================================================
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS inventario_piezas (
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
      );
    `);

    // ============================================================
    // ÍNDICES PARA MEJORAR RENDIMIENTO
    // ============================================================
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_vehiculos_matricula ON vehiculos(matricula);
      CREATE INDEX IF NOT EXISTS idx_vehiculos_estado ON vehiculos(estado);
      CREATE INDEX IF NOT EXISTS idx_vehiculos_marca ON vehiculos(marca);
      CREATE INDEX IF NOT EXISTS idx_piezas_codigo ON piezas(codigo_pieza);
      CREATE INDEX IF NOT EXISTS idx_piezas_categoria ON piezas(categoria);
      CREATE INDEX IF NOT EXISTS idx_piezas_nombre ON piezas(nombre);
      CREATE INDEX IF NOT EXISTS idx_inventario_vehiculo ON inventario_piezas(id_vehiculo);
      CREATE INDEX IF NOT EXISTS idx_inventario_pieza ON inventario_piezas(id_pieza);
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

/**
 * Limpiar la base de datos (SOLO PARA DESARROLLO/TESTING)
 * ⚠️ CUIDADO: Esto borra todos los datos
 */
export const limpiarBaseDatos = async (): Promise<void> => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS inventario_piezas;
      DROP TABLE IF EXISTS piezas;
      DROP TABLE IF EXISTS vehiculos;
    `);
    console.log('✅ Base de datos limpiada');
    await inicializarBaseDatos();
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    throw error;
  }
};

/**
 * Ejecutar una consulta SQL con parámetros (INSERT, UPDATE, DELETE)
 * @param sql Consulta SQL con placeholders (?)
 * @param params Parámetros para reemplazar los placeholders
 * @returns Resultado de la ejecución
 */
export const ejecutarConsulta = async (
  sql: string,
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> => {
  try {
    const resultado = await db.runAsync(sql, params);
    return resultado;
  } catch (error) {
    console.error('❌ Error en consulta SQL:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Obtener múltiples resultados de una consulta SELECT
 * @param sql Consulta SQL SELECT con placeholders (?)
 * @param params Parámetros para reemplazar los placeholders
 * @returns Array de resultados
 */
export const obtenerResultados = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> => {
  try {
    const resultado = await db.getAllAsync<T>(sql, params);
    return resultado;
  } catch (error) {
    console.error('❌ Error al obtener resultados:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Obtener un solo resultado de una consulta SELECT
 * @param sql Consulta SQL SELECT con placeholders (?)
 * @param params Parámetros para reemplazar los placeholders
 * @returns Primer resultado o null si no hay resultados
 */
export const obtenerUnResultado = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> => {
  try {
    const resultado = await db.getFirstAsync<T>(sql, params);
    return resultado || null;
  } catch (error) {
    console.error('❌ Error al obtener resultado:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Ejecutar múltiples consultas en una transacción
 * Si alguna falla, se hace rollback automático
 * @param callback Función que ejecuta las consultas
 */
export const ejecutarTransaccion = async (
  callback: () => Promise<void>
): Promise<void> => {
  try {
    await db.withTransactionAsync(async () => {
      await callback();
    });
    console.log('✅ Transacción completada');
  } catch (error) {
    console.error('❌ Error en transacción (rollback automático):', error);
    throw error;
  }
};

/**
 * Verificar si existe un registro
 * @param tabla Nombre de la tabla
 * @param campo Campo a verificar
 * @param valor Valor a buscar
 * @param excludeId ID a excluir (para edición)
 * @returns true si existe, false si no
 */
export const existeRegistro = async (
  tabla: string,
  campo: string,
  valor: any,
  excludeId?: number
): Promise<boolean> => {
  try {
    let sql = `SELECT COUNT(*) as count FROM ${tabla} WHERE ${campo} = ?`;
    const params: any[] = [valor];

    if (excludeId) {
      sql += ` AND id_${tabla.slice(0, -1)} != ?`;
      params.push(excludeId);
    }

    const resultado = await obtenerUnResultado<{ count: number }>(sql, params);
    return (resultado?.count ?? 0) > 0;
  } catch (error) {
    console.error('❌ Error al verificar registro:', error);
    throw error;
  }
};
