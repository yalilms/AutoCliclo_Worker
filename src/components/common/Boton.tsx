import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface BotonProps extends TouchableOpacityProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'peligro' | 'exito';
  cargando?: boolean;
  deshabilitado?: boolean;
  icono?: React.ReactNode;
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
}

export const Boton: React.FC<BotonProps> = ({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  icono,
  estilo,
  estiloTexto,
  ...props
}) => {
  const esDeshabilitado = deshabilitado || cargando;

  const obtenerColorBoton = (): string => {
    if (esDeshabilitado) return colores.textoDeshabilitado;

    switch (variante) {
      case 'primario':
        return colores.primario;
      case 'secundario':
        return colores.secundario;
      case 'peligro':
        return colores.error;
      case 'exito':
        return colores.exito;
      default:
        return colores.primario;
    }
  };

  return (
    <TouchableOpacity
      style={[
        estilos.boton,
        { backgroundColor: obtenerColorBoton() },
        estilo,
      ]}
      onPress={onPress}
      disabled={esDeshabilitado}
      activeOpacity={0.7}
      {...props}
    >
      {cargando ? (
        <ActivityIndicator color={colores.superficie} />
      ) : (
        <>
          {icono && <>{icono}</>}
          <Text style={[estilos.texto, estiloTexto]}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: borderRadius.sm,
    minHeight: 48,
  },
  texto: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold,
    marginLeft: espaciado.sm,
  },
});
