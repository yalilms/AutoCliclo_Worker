import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius, elevacion } from '../../theme/espaciado';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  estilo?: ViewStyle;
  presionable?: boolean;
  elevacionCard?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  estilo,
  presionable = false,
  elevacionCard = 'sm',
}) => {
  const obtenerElevacion = (): number => {
    switch (elevacionCard) {
      case 'sm':
        return elevacion.sm;
      case 'md':
        return elevacion.md;
      case 'lg':
        return elevacion.lg;
      default:
        return elevacion.sm;
    }
  };

  const contenido = (
    <View
      style={[
        estilos.card,
        { elevation: obtenerElevacion() },
        estilo,
      ]}
    >
      {children}
    </View>
  );

  if (presionable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={estilo}
      >
        {contenido}
      </TouchableOpacity>
    );
  }

  return contenido;
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: colores.superficie,
    borderRadius: borderRadius.md,
    padding: espaciado.md,
    marginVertical: espaciado.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
