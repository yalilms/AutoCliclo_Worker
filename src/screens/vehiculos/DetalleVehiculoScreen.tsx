/**
 * Pantalla de Detalle de Vehículo
 * Muestra toda la información de un vehículo + piezas extraídas
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VehiculosStackParamList } from '../../navigation/VehiculosNavigator';
import { Boton } from '../../components/common/Boton';
import { Card } from '../../components/common/Card';
import { VehiculoConPiezas } from '../../models/Vehiculo';
import { InventarioPiezaDetalle } from '../../models/InventarioPieza';
import { VehiculoService } from '../../services/VehiculoService';
import { InventarioService } from '../../services/InventarioService';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type DetalleVehiculoRouteProp = RouteProp<VehiculosStackParamList, 'DetalleVehiculo'>;
type DetalleVehiculoNavigationProp = StackNavigationProp<VehiculosStackParamList, 'DetalleVehiculo'>;

export const DetalleVehiculoScreen: React.FC = () => {
  const route = useRoute<DetalleVehiculoRouteProp>();
  const navigation = useNavigation<DetalleVehiculoNavigationProp>();
  const vehiculoId = route.params.vehiculoId;
  const [vehiculo, setVehiculo] = useState<VehiculoConPiezas | null>(null);
  const [piezas, setPiezas] = useState<InventarioPiezaDetalle[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [vehiculoId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [vehiculoData, piezasData] = await Promise.all([
        VehiculoService.obtenerConPiezas(vehiculoId),
        InventarioService.obtenerPorVehiculo(vehiculoId),
      ]);
      setVehiculo(vehiculoData);
      setPiezas(piezasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el vehículo', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setCargando(false);
    }
  };

  const manejarEditar = () => {
    navigation.navigate('FormularioVehiculo', { vehiculoId });
  };

  const manejarEliminar = () => {
    Alert.alert(
      'Eliminar Vehículo',
      `¿Estás seguro de eliminar el vehículo ${vehiculo?.matricula}?\n\nSe eliminarán también todas las piezas asignadas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await VehiculoService.eliminar(vehiculoId);
              Alert.alert('Éxito', 'Vehículo eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el vehículo');
            }
          },
        },
      ]
    );
  };

  const manejarExtraerPieza = () => {
    if (!vehiculo) return;
    navigation.navigate('FormularioExtraerPieza', {
      vehiculoId: vehiculo.id_vehiculo!,
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
    });
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={estilos.cargandoTexto}>Cargando vehículo...</Text>
      </View>
    );
  }

  if (!vehiculo) {
    return (
      <View style={estilos.cargando}>
        <Text style={estilos.errorTexto}>Vehículo no encontrado</Text>
        <Boton titulo="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const obtenerColorEstado = (): string => {
    switch (vehiculo.estado) {
      case 'completo':
        return colores.completo;
      case 'desguazando':
        return colores.desguazando;
      case 'desguazado':
        return colores.desguazado;
      default:
        return colores.primario;
    }
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView style={estilos.scrollView}>
        {/* Header */}
        <View style={estilos.header}>
          <View style={estilos.headerInfo}>
            <Text style={estilos.matricula}>{vehiculo.matricula}</Text>
            <View style={[estilos.chipEstado, { backgroundColor: obtenerColorEstado() }]}>
              <Text style={estilos.estadoTexto}>
                {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={estilos.marcaModelo}>
            {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
          </Text>
        </View>

        <View style={estilos.contenido}>
          {/* Información principal */}
          <Card>
            <CampoDetalle etiqueta="Color" valor={vehiculo.color || 'No especificado'} />
            <CampoDetalle
              etiqueta="Kilometraje"
              valor={vehiculo.kilometraje.toLocaleString('es-ES') + ' km'}
            />
            <CampoDetalle
              etiqueta="Precio de Compra"
              valor={'€' + vehiculo.precio_compra.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            />
            <CampoDetalle
              etiqueta="Fecha de Entrada"
              valor={new Date(vehiculo.fecha_entrada).toLocaleDateString('es-ES')}
            />
          </Card>

          {/* Piezas extraídas */}
          <Card>
            <View style={estilos.piezasHeader}>
              <Text style={estilos.seccionTitulo}>
                Piezas Extraídas ({vehiculo.total_piezas})
              </Text>
              <Boton
                titulo="+ Extraer Pieza"
                onPress={manejarExtraerPieza}
                variante="primario"
                estilo={estilos.botonExtraer}
              />
            </View>

            {piezas.length > 0 ? (
              <View>
                {piezas.map((pieza, index) => (
                  <View key={index} style={estilos.piezaItem}>
                    <View style={estilos.piezaHeader}>
                      <Text style={estilos.piezaNombre}>{pieza.nombre_pieza}</Text>
                      <Text style={estilos.piezaCodigo}>{pieza.codigo_pieza}</Text>
                    </View>
                    <View style={estilos.piezaDetalles}>
                      <Text style={estilos.piezaDetalle}>
                        Estado: {pieza.estado_pieza} | Cantidad: {pieza.cantidad}x
                      </Text>
                      <Text style={estilos.piezaDetalle}>
                        Precio: €{pieza.precio_unitario.toFixed(2)} c/u
                      </Text>
                      <Text style={estilos.piezaFecha}>
                        Extraído: {new Date(pieza.fecha_extraccion).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text style={estilos.sinPiezas}>No hay piezas extraídas todavía</Text>
                <Text style={estilos.sinPiezasSubtexto}>
                  Pulsa "Extraer Pieza" para registrar una nueva pieza de este vehículo
                </Text>
              </View>
            )}
          </Card>

          {/* Observaciones */}
          {vehiculo.observaciones && (
            <Card>
              <Text style={estilos.etiqueta}>Observaciones</Text>
              <Text style={estilos.observaciones}>{vehiculo.observaciones}</Text>
            </Card>
          )}

          {/* Botones de acción */}
          <View style={estilos.botonesContainer}>
            <Boton
              titulo="Editar"
              onPress={manejarEditar}
              variante="secundario"
              estilo={estilos.boton}
            />
            <Boton
              titulo="Eliminar"
              onPress={manejarEliminar}
              variante="peligro"
              estilo={estilos.boton}
            />
          </View>

          <Boton titulo="Volver" onPress={() => navigation.goBack()} variante="primario" />
        </View>
      </ScrollView>
    </View>
  );
};

const CampoDetalle: React.FC<{ etiqueta: string; valor: string }> = ({ etiqueta, valor }) => (
  <View style={estilosCampo.contenedor}>
    <Text style={estilosCampo.etiqueta}>{etiqueta}</Text>
    <Text style={estilosCampo.valor}>{valor}</Text>
  </View>
);

const estilosCampo = StyleSheet.create({
  contenedor: {
    marginBottom: espaciado.md,
  },
  etiqueta: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginBottom: espaciado.xs,
  },
  valor: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
  },
});

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scrollView: {
    flex: 1,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.xl,
  },
  cargandoTexto: {
    marginTop: espaciado.md,
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
  },
  errorTexto: {
    fontSize: tipografia.tamanoFuente.lg,
    color: colores.error,
    marginBottom: espaciado.lg,
  },
  header: {
    backgroundColor: colores.superficie,
    padding: espaciado.lg,
    borderBottomWidth: 1,
    borderBottomColor: colores.divisor,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  matricula: {
    fontSize: tipografia.tamanoFuente.xxxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.primario,
  },
  chipEstado: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: borderRadius.redondo,
  },
  estadoTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.superficie,
  },
  marcaModelo: {
    fontSize: tipografia.tamanoFuente.xl,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
  },
  contenido: {
    padding: espaciado.md,
  },
  etiqueta: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  seccionTitulo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  piezasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  botonExtraer: {
    paddingHorizontal: espaciado.md,
    minWidth: 120,
  },
  piezaItem: {
    borderLeftWidth: 3,
    borderLeftColor: colores.primario,
    paddingLeft: espaciado.md,
    marginBottom: espaciado.md,
  },
  piezaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.xs,
  },
  piezaNombre: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    flex: 1,
  },
  piezaCodigo: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.primario,
    fontWeight: tipografia.pesoFuente.semibold as any,
  },
  piezaDetalles: {
    marginTop: espaciado.xs,
  },
  piezaDetalle: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginBottom: 2,
  },
  piezaFecha: {
    fontSize: tipografia.tamanoFuente.xs,
    color: colores.textoSecundario,
    marginTop: espaciado.xs,
  },
  sinPiezas: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sinPiezasSubtexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    textAlign: 'center',
    marginTop: espaciado.sm,
  },
  observaciones: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    lineHeight: tipografia.tamanoFuente.md * 1.5,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: espaciado.md,
    marginBottom: espaciado.md,
  },
  boton: {
    flex: 1,
  },
});
