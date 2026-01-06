/**
 * Navegador de Stack para Vehículos
 * Maneja la navegación entre listado, formulario y detalle de vehículos
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ListadoVehiculosScreen } from '../screens/vehiculos/ListadoVehiculosScreen';
import { FormularioVehiculoScreen } from '../screens/vehiculos/FormularioVehiculoScreen';
import { DetalleVehiculoScreen } from '../screens/vehiculos/DetalleVehiculoScreen';
import { colores } from '../theme/colores';
import { tipografia } from '../theme/tipografia';

export type VehiculosStackParamList = {
  ListadoVehiculos: undefined;
  FormularioVehiculo: { vehiculoId?: number };
  DetalleVehiculo: { vehiculoId: number };
};

const Stack = createStackNavigator<VehiculosStackParamList>();

export const VehiculosNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colores.primario,
        },
        headerTintColor: colores.superficie,
        headerTitleStyle: {
          fontWeight: tipografia.pesoFuente.negrita as any,
        },
      }}
    >
      <Stack.Screen
        name="ListadoVehiculos"
        component={ListadoVehiculosScreen}
        options={{
          headerShown: false, // Ya tiene header desde el tab
        }}
      />
      <Stack.Screen
        name="FormularioVehiculo"
        component={FormularioVehiculoScreen}
        options={({ route }) => ({
          title: route.params?.vehiculoId ? 'Editar Vehículo' : 'Nuevo Vehículo',
        })}
      />
      <Stack.Screen
        name="DetalleVehiculo"
        component={DetalleVehiculoScreen}
        options={{
          title: 'Detalle de Vehículo',
        }}
      />
    </Stack.Navigator>
  );
};
