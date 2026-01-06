/**
 * Componente de Fila Deslizable
 * Permite deslizar para mostrar acciones de editar y eliminar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onDelete,
  onEdit,
}) => {
  // Nota: En una implementación completa usaríamos react-native-gesture-handler
  // Por ahora retornamos solo el children sin funcionalidad de swipe
  // Para implementar swipe completo se necesitaría:
  // import Swipeable from 'react-native-gesture-handler/Swipeable';

  return <View>{children}</View>;
};

// Para implementación futura con gesture-handler:
/*
import Swipeable from 'react-native-gesture-handler/Swipeable';

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onDelete,
  onEdit,
}) => {
  const renderRightActions = () => (
    <View style={estilos.actionsContainer}>
      {onEdit && (
        <TouchableOpacity style={[estilos.actionButton, estilos.editButton]} onPress={onEdit}>
          <MaterialIcons name="edit" size={24} color="white" />
          <Text style={estilos.actionText}>Editar</Text>
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity style={[estilos.actionButton, estilos.deleteButton]} onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={estilos.actionText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      {children}
    </Swipeable>
  );
};
*/

const estilos = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    width: 192,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colores.desguazando,
  },
  deleteButton: {
    backgroundColor: colores.error,
  },
  actionText: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.xs,
    marginTop: espaciado.xs,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
});
