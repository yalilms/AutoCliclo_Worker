/**
 * Pantalla de Detalle de Pieza
 * Muestra toda la información de una pieza en modo solo lectura
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PiezasStackParamList } from '../../navigation/PiezasNavigator';
import { Boton } from '../../components/common/Boton';
import { Card } from '../../components/common/Card';
import { Pieza } from '../../models/Pieza';
import { PiezaService } from '../../services/PiezaService';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type DetallePiezaRouteProp = RouteProp<PiezasStackParamList, 'DetallePieza'>;
type DetallePiezaNavigationProp = StackNavigationProp<PiezasStackParamList, 'DetallePieza'>;

export const DetallePiezaScreen: React.FC = () => {
  const route = useRoute<DetallePiezaRouteProp>();
  const navigation = useNavigation<DetallePiezaNavigationProp>();
  const piezaId = route.params.piezaId;
  const [pieza, setPieza] = useState<Pieza | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPieza();
  }, [piezaId]);

  const cargarPieza = async () => {
    try {
      setCargando(true);
      const piezaObtenida = await PiezaService.obtenerPorId(piezaId);
      setPieza(piezaObtenida);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la pieza', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setCargando(false);
    }
  };

  const manejarEditar = () => {
    navigation.navigate('FormularioPieza', { piezaId });
  };

  const manejarEliminar = () => {
    Alert.alert(
      'Eliminar Pieza',
      `¿Estás seguro de eliminar "${pieza?.nombre}"?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await PiezaService.eliminar(piezaId);
              Alert.alert('Éxito', 'Pieza eliminada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la pieza');
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={estilos.cargandoTexto}>Cargando pieza...</Text>
      </View>
    );
  }

  if (!pieza) {
    return (
      <View style={estilos.cargando}>
        <Text style={estilos.errorTexto}>Pieza no encontrada</Text>
        <Boton titulo="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const obtenerColorCategoria = (): string => {
    switch (pieza.categoria) {
      case 'motor':
        return colores.motor;
      case 'carroceria':
        return colores.carroceria;
      case 'interior':
        return colores.interior;
      case 'electronica':
        return colores.electronica;
      case 'ruedas':
        return colores.ruedas;
      case 'otros':
        return colores.otros;
      default:
        return colores.primario;
    }
  };

  const obtenerEstadoStock = (): { color: string; texto: string } => {
    if (pieza.stock_disponible === 0) {
      return { color: colores.stockAgotado, texto: 'Sin stock' };
    } else if (pieza.stock_disponible < pieza.stock_minimo) {
      return { color: colores.stockBajo, texto: 'Stock bajo' };
    } else {
      return { color: colores.stockNormal, texto: 'Stock normal' };
    }
  };

  const estadoStock = obtenerEstadoStock();

  return (
    <View style={estilos.contenedor}>
      <ScrollView style={estilos.scrollView}>
        {/* Imagen */}
        {pieza.imagen ? (
          <Image source={{ uri: pieza.imagen }} style={estilos.imagen} resizeMode="cover" />
        ) : (
          <View style={estilos.placeholderImagen}>
            <Text style={estilos.placeholderTexto}>📦</Text>
            <Text style={estilos.placeholderSubtexto}>Sin imagen</Text>
          </View>
        )}

        <View style={estilos.contenido}>
          {/* Código y categoría */}
          <View style={estilos.header}>
            <Text style={estilos.codigo}>{pieza.codigo_pieza}</Text>
            <View
              style={[estilos.chipCategoria, { backgroundColor: obtenerColorCategoria() }]}
            >
              <Text style={estilos.categoriaTexto}>
                {pieza.categoria.charAt(0).toUpperCase() + pieza.categoria.slice(1)}
              </Text>
            </View>
          </View>

          {/* Nombre */}
          <Text style={estilos.nombre}>{pieza.nombre}</Text>

          {/* Información principal */}
          <Card>
            <CampoDetalle etiqueta="Precio de Venta" valor={`€${pieza.precio_venta.toFixed(2)}`} />
            <CampoDetalle
              etiqueta="Stock Disponible"
              valor={`${pieza.stock_disponible} unidades`}
            />
            <CampoDetalle
              etiqueta="Stock Mínimo"
              valor={`${pieza.stock_minimo} unidades`}
            />
            <View style={estilos.estadoStockContainer}>
              <View style={[estilos.indicadorStock, { backgroundColor: estadoStock.color }]} />
              <Text style={[estilos.estadoStockTexto, { color: estadoStock.color }]}>
                {estadoStock.texto}
              </Text>
            </View>
          </Card>

          {/* Ubicación y compatibilidad */}
          <Card>
            {pieza.ubicacion_almacen && (
              <CampoDetalle etiqueta="Ubicación en Almacén" valor={pieza.ubicacion_almacen} />
            )}
            {pieza.compatible_marcas && (
              <CampoDetalle etiqueta="Marcas Compatibles" valor={pieza.compatible_marcas} />
            )}
          </Card>

          {/* Descripción */}
          {pieza.descripcion && (
            <Card>
              <Text style={estilos.etiqueta}>Descripción</Text>
              <Text style={estilos.descripcion}>{pieza.descripcion}</Text>
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

// Componente auxiliar para campos de detalle
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
  imagen: {
    width: '100%',
    height: 300,
  },
  placeholderImagen: {
    width: '100%',
    height: 300,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTexto: {
    fontSize: 80,
  },
  placeholderSubtexto: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    marginTop: espaciado.sm,
  },
  contenido: {
    padding: espaciado.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  codigo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.primario,
  },
  chipCategoria: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: borderRadius.redondo,
  },
  categoriaTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.superficie,
  },
  nombre: {
    fontSize: tipografia.tamanoFuente.xxxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.texto,
    marginBottom: espaciado.lg,
  },
  etiqueta: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  descripcion: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    lineHeight: tipografia.tamanoFuente.md * 1.5,
  },
  estadoStockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espaciado.sm,
  },
  indicadorStock: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: espaciado.sm,
  },
  estadoStockTexto: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
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
