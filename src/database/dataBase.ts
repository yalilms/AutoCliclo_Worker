/**
 * Configuración de la base de datos SQLite con react-native-sqlite-storage
 * Siguiendo el tutorial del profesor (Bare Workflow)
 */

import SQLite from 'react-native-sqlite-storage';

// Configuración de SQLite
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

/**
 * Abrir/crear base de datos
 */
export const abrirBaseDatos = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabase({
      name: 'autociclo.db',
      location: 'default',
    });
    console.log('✅ Base de datos abierta correctamente');
    return db;
  } catch (error) {
    console.error('❌ Error al abrir la base de datos:', error);
    throw error;
  }
};

/**
 * Obtener instancia de la base de datos
 */
export const obtenerDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await abrirBaseDatos();
  }
  return db;
};

/**
 * Inicializar la base de datos con las 3 tablas principales
 * Replica exactamente el esquema de MySQL del desktop
 */
export const inicializarBaseDatos = async (): Promise<void> => {
  try {
    const database = await obtenerDB();

    // Habilitar claves foráneas (importante para CASCADE)
    await database.executeSql('PRAGMA foreign_keys = ON;');

    // ============================================================
    // TABLA 1: VEHICULOS (replicada de MySQL)
    // ============================================================
    await database.executeSql(`
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
    await database.executeSql(`
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
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS inventario_piezas (
        id_inventario INTEGER PRIMARY KEY AUTOINCREMENT,
        id_vehiculo INTEGER NOT NULL,
        id_pieza INTEGER NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 1,
        estado_pieza TEXT NOT NULL CHECK(estado_pieza IN ('nueva', 'usada', 'reparada')),
        fecha_extraccion TEXT NOT NULL,
        precio_unitario REAL DEFAULT 0,
        notas TEXT,
        FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE,
        FOREIGN KEY (id_pieza) REFERENCES piezas(id_pieza) ON DELETE CASCADE
      );
    `);

    // ============================================================
    // ÍNDICES PARA MEJORAR RENDIMIENTO
    // ============================================================
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_vehiculos_matricula ON vehiculos(matricula);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_vehiculos_estado ON vehiculos(estado);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_vehiculos_marca ON vehiculos(marca);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_piezas_codigo ON piezas(codigo_pieza);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_piezas_categoria ON piezas(categoria);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_piezas_nombre ON piezas(nombre);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_inventario_vehiculo ON inventario_piezas(id_vehiculo);'
    );
    await database.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_inventario_pieza ON inventario_piezas(id_pieza);'
    );

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
    const database = await obtenerDB();
    await database.executeSql('DROP TABLE IF EXISTS inventario_piezas;');
    await database.executeSql('DROP TABLE IF EXISTS piezas;');
    await database.executeSql('DROP TABLE IF EXISTS vehiculos;');
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
 * @returns Resultado de la ejecución con lastInsertRowId
 */
export const ejecutarConsulta = async (
  sql: string,
  params: any[] = []
): Promise<{ insertId?: number; rowsAffected: number }> => {
  try {
    const database = await obtenerDB();
    const [resultSet] = await database.executeSql(sql, params);

    return {
      insertId: resultSet.insertId,
      rowsAffected: resultSet.rowsAffected,
    };
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
    const database = await obtenerDB();
    const [resultSet] = await database.executeSql(sql, params);

    // Convertir ResultSet a array
    const resultados: T[] = [];
    for (let i = 0; i < resultSet.rows.length; i++) {
      resultados.push(resultSet.rows.item(i));
    }

    return resultados;
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
    const database = await obtenerDB();
    const [resultSet] = await database.executeSql(sql, params);

    if (resultSet.rows.length > 0) {
      return resultSet.rows.item(0) as T;
    }

    return null;
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
  callback: (tx: any) => Promise<void>
): Promise<void> => {
  try {
    const database = await obtenerDB();
    await database.transaction(async (tx: any) => {
      await callback(tx);
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


/**
 * Sembrar datos de prueba (Vehículos, Piezas e Inventario)
 * Se ejecuta si la base de datos está vacía
 */
export const sembrarDatosPrueba = async (): Promise<void> => {
  try {
    const db = await obtenerDB();

    // 1. Verificar si ya existen datos
    const conteoVehiculos = await obtenerUnResultado<{ count: number }>(
      'SELECT COUNT(*) as count FROM vehiculos'
    );

    if ((conteoVehiculos?.count ?? 0) > 0) {
      console.log('ℹ️ La base de datos ya tiene datos, saltando siembra.');
      return;
    }

    console.log('🌱 Sembrando datos de prueba...');

    await db.transaction(async (tx) => {
      // 2. Insertar 5 Vehículos
      // -------------------------------------------------------------
      tx.executeSql(`
        INSERT INTO vehiculos (matricula, marca, modelo, anio, color, fecha_entrada, estado, precio_compra, kilometraje, ubicacion_gps, observaciones)
        VALUES 
        ('1234ABC', 'Toyota', 'Corolla', 2018, 'Blanco', '2025-01-01', 'completo', 5000, 120000, '40.4168,-3.7038', 'Vehículo en buen estado general'),
        ('5678DEF', 'Ford', 'Focus', 2015, 'Azul', '2025-01-02', 'desguazando', 3000, 180000, '40.4168,-3.7038', 'Golpe frontal'),
        ('9012GHI', 'Seat', 'Ibiza', 2010, 'Rojo', '2025-01-03', 'desguazado', 1500, 250000, '40.4168,-3.7038', 'Motor gripado'),
        ('3456JKL', 'Volkswagen', 'Golf', 2020, 'Negro', '2025-01-04', 'completo', 8000, 80000, '40.4168,-3.7038', 'Recuperado de robo'),
        ('7890MNO', 'Renault', 'Clio', 2012, 'Gris', '2025-01-05', 'desguazando', 2000, 200000, '40.4168,-3.7038', 'Avería eléctrica');
      `);

      // 3. Insertar 5 Piezas
      // -------------------------------------------------------------
      tx.executeSql(`
        INSERT INTO piezas (codigo_pieza, nombre, categoria, precio_venta, stock_disponible, stock_minimo, ubicacion_almacen, descripcion)
        VALUES
        ('M-001', 'Alternador', 'motor', 150.00, 5, 2, 'Estantería A1', 'Alternador válido para varios modelos'),
        ('C-001', 'Paragolpes Delantero', 'carroceria', 80.00, 3, 1, 'Estantería B2', 'Paragolpes color negro, arañazos leves'),
        ('I-001', 'Asiento Conductor', 'interior', 120.00, 2, 1, 'Estantería C3', 'Asiento de tela, sin roturas'),
        ('E-001', 'Centralita Motor', 'electronica', 300.00, 1, 1, 'Caja fuerte', 'ECU reprogramada'),
        ('R-001', 'Llanta Aleación 17"', 'ruedas', 90.00, 4, 4, 'Patio', 'Modelo deportivo 5 radios');
      `);

      // 4. Insertar 5 Registros de Inventario (Relación N:N)
      // Asumimos que los IDs son 1-5 porque acabamos de insertar (y es autoincrement)
      // -------------------------------------------------------------
      tx.executeSql(`
        INSERT INTO inventario_piezas (id_vehiculo, id_pieza, cantidad, estado_pieza, fecha_extraccion, precio_unitario, notas)
        VALUES
        (1, 1, 1, 'usada', '2025-01-06', 150.00, 'Extraído de Toyota Corolla'),
        (2, 2, 1, 'reparada', '2025-01-06', 80.00, 'Paragolpes de Ford Focus, reparado'),
        (3, 3, 1, 'usada', '2025-01-06', 120.00, 'Asiento de Seat Ibiza'),
        (4, 4, 1, 'nueva', '2025-01-06', 300.00, 'Centralita de Golf casi nueva'),
        (5, 5, 4, 'usada', '2025-01-06', 90.00, 'Juego completo de llantas Clio');
      `);
    });

    console.log('✅ Datos de prueba sembrados correctamente');
  } catch (error) {
    console.error('❌ Error al sembrar datos:', error);
    // No lanzamos error para no detener la app, solo logueamos
  }
};

/**
 * Cerrar la base de datos
 */
export const cerrarBaseDatos = async (): Promise<void> => {
  try {
    if (db) {
      await db.close();
      console.log('✅ Base de datos cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar la base de datos:', error);
    throw error;
  }
};
