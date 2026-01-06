/**
 * Pantalla de Mapa del Almacén
 * Muestra la ubicación de los vehículos en el mapa
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { Vehiculo } from '../../models/Vehiculo';
import { VehiculoService } from '../../services/VehiculoService';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

export const MapaAlmacenScreen: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [region, setRegion] = useState({
    latitude: 40.4168, // Madrid (default)
    longitude: -3.7038,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Cargar vehículos y ubicación actual
   */
  const cargarDatos = async () => {
    try {
      setCargando(true);

      // Obtener ubicación actual
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      // Cargar vehículos con GPS
      const resultado = await VehiculoService.obtenerTodos(1, 1000);
      const vehiculosConGPS = resultado.vehiculos.filter(v => v.ubicacion_gps);
      setVehiculos(vehiculosConGPS);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los vehículos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Parsear coordenadas GPS
   */
  const parseGPS = (gps: string): [number, number] | null => {
    try {
      const [lat, lng] = gps.split(',').map(s => parseFloat(s.trim()));
      if (isNaN(lat) || isNaN(lng)) return null;
      return [lat, lng];
    } catch {
      return null;
    }
  };

  /**
   * Obtener color según estado del vehículo
   */
  const getColorByEstado = (estado: string): string => {
    switch (estado) {
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

  /**
   * Centrar mapa en ubicación actual
   */
  const centrarEnUbicacionActual = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    }
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={estilos.textoCargando}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={estilos.mapa}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {vehiculos.map(vehiculo => {
          if (!vehiculo.ubicacion_gps) return null;

          const coords = parseGPS(vehiculo.ubicacion_gps);
          if (!coords) return null;

          const [lat, lng] = coords;
          return (
            <Marker
              key={vehiculo.id_vehiculo}
              coordinate={{ latitude: lat, longitude: lng }}
              title={vehiculo.matricula}
              description={`${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.estado}`}
              pinColor={getColorByEstado(vehiculo.estado)}
            />
          );
        })}
      </MapView>

      {/* Botón para centrar en ubicación actual */}
      <TouchableOpacity
        style={estilos.botonUbicacion}
        onPress={centrarEnUbicacionActual}
      >
        <MaterialIcons name="my-location" size={24} color={colores.primario} />
      </TouchableOpacity>

      {/* Info */}
      <View style={estilos.infoContainer}>
        <Text style={estilos.infoTexto}>
          {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} en el mapa
        </Text>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  mapa: {
    flex: 1,
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
  botonUbicacion: {
    position: 'absolute',
    bottom: 80,
    right: espaciado.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: espaciado.md,
    backgroundColor: colores.superficie,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
});
