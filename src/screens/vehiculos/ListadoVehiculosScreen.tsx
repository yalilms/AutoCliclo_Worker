/**
 * Pantalla de Listado de Vehículos
 * Muestra todos los vehículos con búsqueda, filtros y paginación
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VehiculosStackParamList } from '../../navigation/VehiculosNavigator';
import { VehiculoCard } from '../../components/vehiculo/VehiculoCard';
import { Input } from '../../components/common/Input';
import { Boton } from '../../components/common/Boton';
import { Vehiculo } from '../../models/Vehiculo';
import { VehiculoService } from '../../services/VehiculoService';
import { usarDebounce } from '../../hooks/usarDebounce';
import { ESTADO_VEHICULO } from '../../utils/constantes';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type NavigationProp = StackNavigationProp<VehiculosStackParamList, 'ListadoVehiculos'>;

export const ListadoVehiculosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalVehiculos, setTotalVehiculos] = useState(0);

  const terminoDebounced = usarDebounce(terminoBusqueda, 500);

  const cargarVehiculos = useCallback(
    async (pagina: number = 1, busqueda: string = '', estado: string = '') => {
      try {
        setCargando(true);
        const { vehiculos: vehiculosObtenidos, total } = await VehiculoService.obtenerTodos(
          pagina,
          10,
          busqueda,
          estado || undefined
        );
        setVehiculos(vehiculosObtenidos);
        setTotalVehiculos(total);
        setPaginaActual(pagina);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        Alert.alert('Error', 'No se pudieron cargar los vehículos');
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const refrescar = useCallback(async () => {
    setRefrescando(true);
    await cargarVehiculos(1, terminoDebounced, filtroEstado);
    setRefrescando(false);
  }, [cargarVehiculos, terminoDebounced, filtroEstado]);

  useFocusEffect(
    useCallback(() => {
      cargarVehiculos(paginaActual, terminoDebounced, filtroEstado);
    }, [paginaActual, terminoDebounced, filtroEstado])
  );

  /**
   * Nota: useFocusEffect ya maneja la recarga cuando cambian terminoDebounced o filtroEstado,
   * por lo que no necesitamos un useEffect adicional.
   */

  const manejarPressVehiculo = (vehiculo: Vehiculo) => {
    navigation.navigate('DetalleVehiculo', { vehiculoId: vehiculo.id_vehiculo! });
  };

  const manejarNuevoVehiculo = () => {
    navigation.navigate('FormularioVehiculo', {});
  };

  const totalPaginas = Math.ceil(totalVehiculos / 10);

  const renderItem = ({ item }: { item: Vehiculo }) => (
    <VehiculoCard vehiculo={item} onPress={() => manejarPressVehiculo(item)} />
  );

  const renderListaVacia = () => (
    <View style={estilos.listaVacia}>
      <Text style={estilos.listaVaciaTexto}>
        {terminoBusqueda || filtroEstado
          ? 'No se encontraron vehículos'
          : 'No hay vehículos registrados'}
      </Text>
      {!terminoBusqueda && !filtroEstado && (
        <Boton
          titulo="Agregar primer vehículo"
          onPress={manejarNuevoVehiculo}
          estilo={estilos.botonAgregar}
        />
      )}
    </View>
  );

  const renderFooter = () => {
    if (totalVehiculos === 0) return null;

    return (
      <View style={estilos.paginacion}>
        <Text style={estilos.paginacionTexto}>
          Página {paginaActual} de {totalPaginas} ({totalVehiculos} vehículos)
        </Text>
        <View style={estilos.botonesNavegacion}>
          <Boton
            titulo="Anterior"
            onPress={() => cargarVehiculos(paginaActual - 1, terminoDebounced, filtroEstado)}
            deshabilitado={paginaActual === 1}
            estilo={estilos.botonNavegacion}
          />
          <Boton
            titulo="Siguiente"
            onPress={() => cargarVehiculos(paginaActual + 1, terminoDebounced, filtroEstado)}
            deshabilitado={paginaActual >= totalPaginas}
            estilo={estilos.botonNavegacion}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Vehículos</Text>

        <Input
          placeholder="Buscar por matrícula, marca o modelo..."
          value={terminoBusqueda}
          onChangeText={setTerminoBusqueda}
          estiloContenedor={estilos.buscador}
        />

        {/* Filtros de estado */}
        <View style={estilos.filtrosContainer}>
          <TouchableOpacity
            style={[estilos.filtroChip, !filtroEstado && estilos.filtroChipActivo]}
            onPress={() => setFiltroEstado('')}
          >
            <Text style={[estilos.filtroTexto, !filtroEstado && estilos.filtroTextoActivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          {ESTADO_VEHICULO.map((estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                estilos.filtroChip,
                filtroEstado === estado && estilos.filtroChipActivo,
              ]}
              onPress={() => setFiltroEstado(estado)}
            >
              <Text
                style={[
                  estilos.filtroTexto,
                  filtroEstado === estado && estilos.filtroTextoActivo,
                ]}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Boton titulo="+ Nuevo Vehículo" onPress={manejarNuevoVehiculo} variante="primario" />
      </View>

      {cargando && vehiculos.length === 0 ? (
        <View style={estilos.cargando}>
          <ActivityIndicator size="large" color={colores.primario} />
          <Text style={estilos.cargandoTexto}>Cargando vehículos...</Text>
        </View>
      ) : (
        <FlatList
          data={vehiculos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_vehiculo!.toString()}
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
          contentContainerStyle={
            vehiculos.length === 0 ? estilos.listaVaciaContainer : undefined
          }
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
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
    marginBottom: espaciado.md,
  },
  filtroChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  filtroChipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  filtroTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
  },
  filtroTextoActivo: {
    color: colores.superficie,
    fontWeight: tipografia.pesoFuente.semibold as any,
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
    marginBottom: espaciado.md,
  },
  botonesNavegacion: {
    flexDirection: 'row',
    gap: espaciado.md,
  },
  botonNavegacion: {
    flex: 1,
  },
});
