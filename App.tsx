/**
 * App Principal de AutoCiclo Mobile
 * Navegación con tabs para Piezas, Vehículos, Inventario y Estadísticas
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Navigation
import { PiezasNavigator } from './src/navigation/PiezasNavigator';
import { VehiculosNavigator } from './src/navigation/VehiculosNavigator';

// Screens
import { InventarioScreen } from './src/screens/inventario/InventarioScreen';
import { EstadisticasScreen } from './src/screens/estadisticas/EstadisticasScreen';

// Database
import { inicializarBaseDatos, sembrarDatosPrueba } from './src/database/dataBase';

// Theme
import { colores } from './src/theme/colores';
import { espaciado } from './src/theme/espaciado';
import { tipografia } from './src/theme/tipografia';

const Tab = createBottomTabNavigator();

export default function App() {
  const [dbInicializada, setDbInicializada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    iniciarApp();
  }, []);

  const iniciarApp = async () => {
    try {
      setCargando(true);
      console.log('🚀 Iniciando AutoCiclo Mobile...');

      // Inicializar base de datos
      await inicializarBaseDatos();
      console.log('✅ Base de datos inicializada');
      
      // ⚠️ FORZAR LIMPIEZA PARA DATOS DE PRUEBA (Solo para debugging)
      // Esto borrará todo y volverá a crear las tablas
      const { limpiarBaseDatos } = require('./src/database/dataBase');
      await limpiarBaseDatos();

      // Sembrar datos de prueba
      await sembrarDatosPrueba();
      
      // Sembrar datos de prueba si es necesario
      await sembrarDatosPrueba();

      setDbInicializada(true);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error al inicializar la app:', error);
      setError(error.message || 'Error al inicializar la aplicación');
      Alert.alert(
        'Error de Inicialización',
        'No se pudo inicializar la base de datos. Por favor, reinicia la aplicación.',
        [{ text: 'OK' }]
      );
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de carga
  if (cargando) {
    return (
      <View style={estilos.pantallaCarga}>
        <Text style={estilos.logo}>🚗</Text>
        <Text style={estilos.titulo}>AutoCiclo Mobile</Text>
        <Text style={estilos.subtitulo}>Gestión de Desguace</Text>
        <ActivityIndicator size="large" color={colores.primario} style={estilos.spinner} />
        <Text style={estilos.textoCarga}>Inicializando base de datos...</Text>
      </View>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <View style={estilos.pantallaError}>
        <Text style={estilos.errorIcono}>⚠️</Text>
        <Text style={estilos.errorTitulo}>Error de Inicialización</Text>
        <Text style={estilos.errorMensaje}>{error}</Text>
      </View>
    );
  }

  // App principal
  return (
    <NavigationContainer>
      <StatusBar style="dark" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

            if (route.name === 'Piezas') {
              iconName = 'build';
            } else if (route.name === 'Vehículos') {
              iconName = 'directions-car';
            } else if (route.name === 'Inventario') {
              iconName = 'inventory';
            } else if (route.name === 'Estadísticas') {
              iconName = 'bar-chart';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colores.primario,
          tabBarInactiveTintColor: colores.textoSecundario,
          tabBarStyle: {
            backgroundColor: colores.superficie,
            borderTopColor: colores.divisor,
            paddingBottom: espaciado.sm,
            paddingTop: espaciado.sm,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: tipografia.tamanoFuente.xs,
            fontWeight: tipografia.pesoFuente.medio as any,
          },
          headerStyle: {
            backgroundColor: colores.primario,
          },
          headerTintColor: colores.superficie,
          headerTitleStyle: {
            fontWeight: tipografia.pesoFuente.negrita as any,
          },
        })}
      >
        <Tab.Screen
          name="Piezas"
          component={PiezasNavigator}
          options={{
            headerTitle: '🔧 Gestión de Piezas',
          }}
        />
        <Tab.Screen
          name="Vehículos"
          component={VehiculosNavigator}
          options={{
            headerTitle: '🚗 Gestión de Vehículos',
          }}
        />
        <Tab.Screen
          name="Inventario"
          component={InventarioScreen}
          options={{
            headerTitle: '📦 Inventario',
          }}
        />
        <Tab.Screen
          name="Estadísticas"
          component={EstadisticasScreen}
          options={{
            headerTitle: '📊 Estadísticas',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  pantallaCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    padding: espaciado.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: espaciado.lg,
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.xxxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.primario,
    marginBottom: espaciado.xs,
  },
  subtitulo: {
    fontSize: tipografia.tamanoFuente.lg,
    color: colores.textoSecundario,
    marginBottom: espaciado.xl,
  },
  spinner: {
    marginVertical: espaciado.lg,
  },
  textoCarga: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
  },
  pantallaError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    padding: espaciado.xl,
  },
  errorIcono: {
    fontSize: 80,
    marginBottom: espaciado.lg,
  },
  errorTitulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.error,
    marginBottom: espaciado.md,
    textAlign: 'center',
  },
  errorMensaje: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    textAlign: 'center',
    lineHeight: tipografia.tamanoFuente.md * 1.5,
  },
});
