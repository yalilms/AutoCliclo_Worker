/**
 * Navegador de Stack para Piezas
 * Maneja la navegación entre listado, formulario y detalle de piezas
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ListadoPiezasScreen } from '../screens/piezas/ListadoPiezasScreen';
import { FormularioPiezaScreen } from '../screens/piezas/FormularioPiezaScreen';
import { DetallePiezaScreen } from '../screens/piezas/DetallePiezaScreen';
import { colores } from '../theme/colores';
import { tipografia } from '../theme/tipografia';

export type PiezasStackParamList = {
  ListadoPiezas: undefined;
  FormularioPieza: { piezaId?: number };
  DetallePieza: { piezaId: number };
};

const Stack = createStackNavigator<PiezasStackParamList>();

export const PiezasNavigator: React.FC = () => {
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
        name="ListadoPiezas"
        component={ListadoPiezasScreen}
        options={{
          headerShown: false, // Ya tiene header desde el tab
        }}
      />
      <Stack.Screen
        name="FormularioPieza"
        component={FormularioPiezaScreen}
        options={({ route }) => ({
          title: route.params?.piezaId ? 'Editar Pieza' : 'Nueva Pieza',
        })}
      />
      <Stack.Screen
        name="DetallePieza"
        component={DetallePiezaScreen}
        options={{
          title: 'Detalle de Pieza',
        }}
      />
    </Stack.Navigator>
  );
};
