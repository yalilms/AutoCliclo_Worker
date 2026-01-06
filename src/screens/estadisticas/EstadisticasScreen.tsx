/**
 * Pantalla de Estadísticas
 * Muestra gráficos y métricas del desguace
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Card } from '../../components/common/Card';
import { PiezaService } from '../../services/PiezaService';
import { VehiculoService } from '../../services/VehiculoService';
import { CATEGORIAS_PIEZA } from '../../utils/constantes';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

const screenWidth = Dimensions.get('window').width;

interface EstadisticasPiezas {
  total: number;
  porCategoria: { [key: string]: number };
  stockBajo: number;
}

interface EstadisticasVehiculos {
  total: number;
  porEstado: { completo: number; desguazando: number; desguazado: number };
}

export const EstadisticasScreen: React.FC = () => {
  const [cargando, setCargando] = useState(true);
  const [estadisticasPiezas, setEstadisticasPiezas] = useState<EstadisticasPiezas>({
    total: 0,
    porCategoria: {},
    stockBajo: 0,
  });
  const [estadisticasVehiculos, setEstadisticasVehiculos] =
    useState<EstadisticasVehiculos>({
      total: 0,
      porEstado: { completo: 0, desguazando: 0, desguazado: 0 },
    });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);

      // =====================================================
      // OPTIMIZACIÓN: Usar funciones especializadas de Services
      // en lugar de cargar todos los registros manualmente
      // =====================================================

      // Cargar estadísticas de piezas de forma optimizada
      const [
        { piezas: todasPiezas, total: totalPiezas },
        piezasStockBajo,
        categoriasPiezas
      ] = await Promise.all([
        PiezaService.obtenerTodos(1, 1), // Solo necesitamos el total
        PiezaService.obtenerStockBajo(), // Función optimizada
        PiezaService.contarPorCategoria() // Función optimizada
      ]);

      // Convertir resultado de contarPorCategoria a objeto
      const porCategoria: { [key: string]: number } = {};
      categoriasPiezas.forEach(cat => {
        porCategoria[cat.categoria] = cat.total;
      });

      setEstadisticasPiezas({
        total: totalPiezas,
        porCategoria,
        stockBajo: piezasStockBajo.length,
      });

      // Cargar estadísticas de vehículos de forma optimizada
      const [
        { vehiculos: todosVehiculos, total: totalVehiculos },
        marcasVehiculos
      ] = await Promise.all([
        VehiculoService.obtenerTodos(1, 1), // Solo necesitamos el total
        VehiculoService.contarPorMarca() // Función optimizada
      ]);

      // Calcular vehículos por estado (aún requiere cargar todos)
      // Nota: Podríamos crear una función VehiculoService.contarPorEstado() en el futuro
      const { vehiculos } = await VehiculoService.obtenerTodos(1, 10000);
      const porEstado = {
        completo: 0,
        desguazando: 0,
        desguazado: 0,
      };

      vehiculos.forEach(vehiculo => {
        if (vehiculo.estado in porEstado) {
          porEstado[vehiculo.estado as keyof typeof porEstado]++;
        }
      });

      setEstadisticasVehiculos({
        total: totalVehiculos,
        porEstado,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar las estadísticas. Por favor, intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={estilos.textoCargando}>Cargando estadísticas...</Text>
      </View>
    );
  }

  // Preparar datos para gráfico de barras (piezas por categoría)
  const dataBarras = {
    labels: CATEGORIAS_PIEZA.map(cat => cat.substring(0, 3).toUpperCase()),
    datasets: [
      {
        data: CATEGORIAS_PIEZA.map(
          cat => estadisticasPiezas.porCategoria[cat] || 0
        ),
      },
    ],
  };

  // Preparar datos para gráfico de torta (vehículos por estado)
  const dataTorta = [
    {
      name: 'Completo',
      population: estadisticasVehiculos.porEstado.completo,
      color: colores.completo,
      legendFontColor: colores.texto,
      legendFontSize: 12,
    },
    {
      name: 'Desguazando',
      population: estadisticasVehiculos.porEstado.desguazando,
      color: colores.desguazando,
      legendFontColor: colores.texto,
      legendFontSize: 12,
    },
    {
      name: 'Desguazado',
      population: estadisticasVehiculos.porEstado.desguazado,
      color: colores.desguazado,
      legendFontColor: colores.texto,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: colores.superficie,
    backgroundGradientFrom: colores.superficie,
    backgroundGradientTo: colores.superficie,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={estilos.contenedor}>
      <View style={estilos.contenido}>
        <Text style={estilos.titulo}>📊 Estadísticas del Desguace</Text>

        {/* Resumen General */}
        <View style={estilos.resumenContainer}>
          <Card estilo={estilos.tarjetaResumen}>
            <Text style={estilos.numeroGrande}>{estadisticasPiezas.total}</Text>
            <Text style={estilos.etiquetaResumen}>Total Piezas</Text>
          </Card>

          <Card estilo={estilos.tarjetaResumen}>
            <Text style={estilos.numeroGrande}>{estadisticasVehiculos.total}</Text>
            <Text style={estilos.etiquetaResumen}>Total Vehículos</Text>
          </Card>

          <Card estilo={[estilos.tarjetaResumen, { backgroundColor: colores.error + '20' }]}>
            <Text style={[estilos.numeroGrande, { color: colores.error }]}>
              {estadisticasPiezas.stockBajo}
            </Text>
            <Text style={estilos.etiquetaResumen}>Stock Bajo</Text>
          </Card>
        </View>

        {/* Gráfico de Barras - Piezas por Categoría */}
        <Card estilo={estilos.tarjetaGrafico}>
          <Text style={estilos.tituloGrafico}>Piezas por Categoría</Text>
          <BarChart
            data={dataBarras}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={estilos.grafico}
          />
        </Card>

        {/* Gráfico de Torta - Vehículos por Estado */}
        <Card estilo={estilos.tarjetaGrafico}>
          <Text style={estilos.tituloGrafico}>Vehículos por Estado</Text>
          <PieChart
            data={dataTorta}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={estilos.grafico}
          />
        </Card>

        {/* Detalles por Categoría */}
        <Card estilo={estilos.tarjetaDetalle}>
          <Text style={estilos.tituloSeccion}>Detalle por Categorías</Text>
          {CATEGORIAS_PIEZA.map(categoria => (
            <View key={categoria} style={estilos.filaDetalle}>
              <Text style={estilos.nombreCategoria}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </Text>
              <Text style={estilos.valorCategoria}>
                {estadisticasPiezas.porCategoria[categoria] || 0} piezas
              </Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    padding: espaciado.md,
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.texto,
    marginBottom: espaciado.lg,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
  textoCargando: {
    marginTop: espaciado.md,
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
  },
  resumenContainer: {
    flexDirection: 'row',
    gap: espaciado.sm,
    marginBottom: espaciado.md,
  },
  tarjetaResumen: {
    flex: 1,
    alignItems: 'center',
    padding: espaciado.md,
  },
  numeroGrande: {
    fontSize: 32,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.primario,
  },
  etiquetaResumen: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginTop: espaciado.xs,
    textAlign: 'center',
  },
  tarjetaGrafico: {
    padding: espaciado.md,
    marginBottom: espaciado.md,
  },
  tituloGrafico: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  grafico: {
    marginVertical: espaciado.sm,
    borderRadius: 16,
  },
  tarjetaDetalle: {
    padding: espaciado.md,
    marginBottom: espaciado.md,
  },
  tituloSeccion: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: espaciado.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  nombreCategoria: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.texto,
  },
  valorCategoria: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
});
