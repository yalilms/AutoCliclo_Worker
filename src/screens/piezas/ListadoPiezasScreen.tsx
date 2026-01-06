/**
 * Pantalla de Listado de Piezas
 * Muestra todas las piezas con búsqueda, paginación y navegación
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PiezasStackParamList } from '../../navigation/PiezasNavigator';
import { PiezaCard } from '../../components/pieza/PiezaCard';
import { Input } from '../../components/common/Input';
import { Boton } from '../../components/common/Boton';
import { Pieza } from '../../models/Pieza';
import { PiezaService } from '../../services/PiezaService';
import { usarDebounce } from '../../hooks/usarDebounce';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type NavigationProp = StackNavigationProp<PiezasStackParamList, 'ListadoPiezas'>;

export const ListadoPiezasScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPiezas, setTotalPiezas] = useState(0);

  // Debounce para búsqueda (espera 500ms después de que el usuario deje de escribir)
  const terminoDebounced = usarDebounce(terminoBusqueda, 500);

  /**
   * Cargar piezas desde la base de datos
   */
  const cargarPiezas = useCallback(async (pagina: number = 1, busqueda: string = '') => {
    try {
      setCargando(true);
      const { piezas: piezasObtenidas, total } = await PiezaService.obtenerTodos(
        pagina,
        10,
        busqueda
      );
      setPiezas(piezasObtenidas);
      setTotalPiezas(total);
      setPaginaActual(pagina);
    } catch (error) {
      console.error('Error al cargar piezas:', error);
      Alert.alert('Error', 'No se pudieron cargar las piezas');
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Refrescar listado (pull-to-refresh)
   */
  const refrescar = useCallback(async () => {
    setRefrescando(true);
    await cargarPiezas(1, terminoDebounced);
    setRefrescando(false);
  }, [cargarPiezas, terminoDebounced]);

  /**
   * Cargar piezas al montar el componente y cuando vuelva a estar en foco
   */
  useFocusEffect(
    useCallback(() => {
      cargarPiezas(paginaActual, terminoDebounced);
    }, [paginaActual, terminoDebounced])
  );

  /**
   * Recargar cuando cambie el término de búsqueda (debounced)
   * Nota: useFocusEffect ya maneja la recarga cuando cambia terminoDebounced,
   * por lo que este useEffect es redundante y ha sido removido para evitar
   * duplicación de llamadas a la base de datos.
   */

  /**
   * Manejar navegación a detalle de pieza
   */
  const manejarPressPieza = (pieza: Pieza) => {
    navigation.navigate('DetallePieza', { piezaId: pieza.id_pieza! });
  };

  /**
   * Manejar creación de nueva pieza
   */
  const manejarNuevaPieza = () => {
    navigation.navigate('FormularioPieza', {});
  };

  /**
   * Calcular número total de páginas
   */
  const totalPaginas = Math.ceil(totalPiezas / 10);

  /**
   * Renderizar item de la lista
   */
  const renderItem = ({ item }: { item: Pieza }) => (
    <PiezaCard pieza={item} onPress={() => manejarPressPieza(item)} />
  );

  /**
   * Renderizar lista vacía
   */
  const renderListaVacia = () => (
    <View style={estilos.listaVacia}>
      <Text style={estilos.listaVaciaTexto}>
        {terminoBusqueda
          ? `No se encontraron piezas con "${terminoBusqueda}"`
          : 'No hay piezas registradas'}
      </Text>
      {!terminoBusqueda && (
        <Boton
          titulo="Agregar primera pieza"
          onPress={manejarNuevaPieza}
          estilo={estilos.botonAgregar}
        />
      )}
    </View>
  );

  /**
   * Renderizar footer de la lista (contador de piezas)
   */
  const renderFooter = () => {
    if (totalPiezas === 0) return null;

    return (
      <View style={estilos.paginacion}>
        <Text style={estilos.paginacionTexto}>
          {totalPiezas} {totalPiezas === 1 ? 'pieza' : 'piezas'}
        </Text>
      </View>
    );
  };

  return (
    <View style={estilos.contenedor}>
      {/* Header */}
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Piezas</Text>

        {/* Buscador */}
        <Input
          placeholder="Buscar por nombre, código o categoría..."
          value={terminoBusqueda}
          onChangeText={setTerminoBusqueda}
          estiloContenedor={estilos.buscador}
        />

        {/* Botón nueva pieza */}
        <Boton
          titulo="+ Nueva Pieza"
          onPress={manejarNuevaPieza}
          variante="primario"
        />
      </View>

      {/* Lista de piezas */}
      {cargando && piezas.length === 0 ? (
        <View style={estilos.cargando}>
          <ActivityIndicator size="large" color={colores.primario} />
          <Text style={estilos.cargandoTexto}>Cargando piezas...</Text>
        </View>
      ) : (
        <FlatList
          data={piezas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_pieza!.toString()}
          ListEmptyComponent={renderListaVacia}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={refrescar}
              colors={[colores.primario]}
              tintColor={colores.primario}
            />
          }
          contentContainerStyle={piezas.length === 0 ? estilos.listaVaciaContainer : undefined}
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
    backgroundColor: colores.superficie,
    padding: espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.divisor,
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  buscador: {
    marginBottom: espaciado.md,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    marginTop: espaciado.md,
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
  },
  listaVaciaContainer: {
    flexGrow: 1,
  },
  listaVacia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.xl,
  },
  listaVaciaTexto: {
    fontSize: tipografia.tamanoFuente.lg,
    color: colores.textoSecundario,
    textAlign: 'center',
    marginBottom: espaciado.lg,
  },
  botonAgregar: {
    marginTop: espaciado.md,
  },
  paginacion: {
    padding: espaciado.md,
    alignItems: 'center',
  },
  paginacionTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
  },
});
