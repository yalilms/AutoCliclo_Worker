/**
 * Pantalla de Inventario
 * Permite asignar piezas a vehículos y ver el inventario completo
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { Boton } from '../../components/common/Boton';
import { InventarioPiezaDetalle } from '../../models/InventarioPieza';
import { InventarioService } from '../../services/InventarioService';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

export const InventarioScreen: React.FC = () => {
  const [inventario, setInventario] = useState<InventarioPiezaDetalle[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarInventario();
    }, [])
  );

  const cargarInventario = async () => {
    try {
      setCargando(true);
      // Obtener todo el inventario
      const resultado = await InventarioService.obtenerTodos();
      setInventario(resultado);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el inventario');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const refrescar = async () => {
    setRefrescando(true);
    await cargarInventario();
    setRefrescando(false);
  };

  const manejarEliminar = async (id: number) => {
    Alert.alert(
      'Eliminar asignación',
      '¿Estás seguro de eliminar esta asignación de pieza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await InventarioService.eliminar(id);
              cargarInventario();
              Alert.alert('Éxito', 'Asignación eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la asignación');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: InventarioPiezaDetalle }) => (
    <Card estilo={estilos.card}>
      <View style={estilos.cardHeader}>
        <View style={estilos.infoContainer}>
          <Text style={estilos.vehiculoTexto}>
            🚗 {item.marca} {item.modelo} ({item.matricula})
          </Text>
          <Text style={estilos.piezaTexto}>
            🔧 {item.nombre_pieza} ({item.codigo_pieza})
          </Text>
        </View>
        <TouchableOpacity
          style={estilos.botonEliminar}
          onPress={() => manejarEliminar(item.id_inventario!)}
        >
          <MaterialIcons name="delete" size={24} color={colores.error} />
        </TouchableOpacity>
      </View>

      <View style={estilos.detallesContainer}>
        <View style={estilos.detalle}>
          <Text style={estilos.etiquetaDetalle}>Cantidad:</Text>
          <Text style={estilos.valorDetalle}>{item.cantidad}</Text>
        </View>

        <View style={estilos.detalle}>
          <Text style={estilos.etiquetaDetalle}>Estado:</Text>
          <Text style={estilos.valorDetalle}>{item.estado_pieza}</Text>
        </View>

        <View style={estilos.detalle}>
          <Text style={estilos.etiquetaDetalle}>Precio:</Text>
          <Text style={estilos.valorDetalle}>€{item.precio_unitario.toFixed(2)}</Text>
        </View>

        <View style={estilos.detalle}>
          <Text style={estilos.etiquetaDetalle}>Fecha:</Text>
          <Text style={estilos.valorDetalle}>
            {new Date(item.fecha_extraccion).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      {item.notas && (
        <View style={estilos.notasContainer}>
          <Text style={estilos.notasTexto}>{item.notas}</Text>
        </View>
      )}
    </Card>
  );

  if (cargando && !refrescando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={estilos.textoCargando}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>📦 Inventario de Piezas</Text>
        <Text style={estilos.subtitulo}>
          {inventario.length} asignación{inventario.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {inventario.length === 0 ? (
        <View style={estilos.vacio}>
          <MaterialIcons
            name="inventory-2"
            size={80}
            color={colores.textoSecundario}
          />
          <Text style={estilos.textoVacio}>No hay asignaciones de piezas</Text>
          <Text style={estilos.textoVacioSecundario}>
            Las piezas asignadas a vehículos aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={inventario}
          renderItem={renderItem}
          keyExtractor={item => item.id_inventario!.toString()}
          contentContainerStyle={estilos.lista}
          refreshing={refrescando}
          onRefresh={refrescar}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  header: {
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.texto,
  },
  subtitulo: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginTop: espaciado.xs,
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
  lista: {
    padding: espaciado.md,
  },
  card: {
    marginBottom: espaciado.md,
    padding: espaciado.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: espaciado.md,
  },
  infoContainer: {
    flex: 1,
  },
  vehiculoTexto: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.xs,
  },
  piezaTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
  },
  botonEliminar: {
    padding: espaciado.xs,
  },
  detallesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.md,
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
  },
  etiquetaDetalle: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
  },
  valorDetalle: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  notasContainer: {
    marginTop: espaciado.md,
    paddingTop: espaciado.md,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  notasTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    fontStyle: 'italic',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.xl,
  },
  textoVacio: {
    fontSize: tipografia.tamanoFuente.lg,
    color: colores.textoSecundario,
    marginTop: espaciado.md,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  textoVacioSecundario: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginTop: espaciado.sm,
    textAlign: 'center',
  },
});
