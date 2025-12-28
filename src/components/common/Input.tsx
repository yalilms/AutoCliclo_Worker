import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface InputProps extends TextInputProps {
  etiqueta?: string;
  error?: string;
  exito?: boolean;
  estiloContenedor?: ViewStyle;
  iconoDerecha?: React.ReactNode;
  iconoIzquierda?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  etiqueta,
  error,
  exito = false,
  estiloContenedor,
  iconoDerecha,
  iconoIzquierda,
  ...props
}) => {
  const [estaEnfocado, setEstaEnfocado] = useState(false);

  const obtenerColorBorde = (): string => {
    if (error) return colores.bordeError;
    if (exito) return colores.bordeExito;
    if (estaEnfocado) return colores.primario;
    return colores.borde;
  };

  return (
    <View style={[estilos.contenedor, estiloContenedor]}>
      {etiqueta && <Text style={estilos.etiqueta}>{etiqueta}</Text>}

      <View style={[estilos.inputContenedor, { borderColor: obtenerColorBorde() }]}>
        {iconoIzquierda && (
          <View style={estilos.iconoIzquierda}>{iconoIzquierda}</View>
        )}

        <TextInput
          style={[
            estilos.input,
            iconoIzquierda ? estilos.inputConIconoIzquierda : undefined,
            iconoDerecha ? estilos.inputConIconoDerecha : undefined,
          ]}
          placeholderTextColor={colores.textoSecundario}
          onFocus={() => setEstaEnfocado(true)}
          onBlur={() => setEstaEnfocado(false)}
          {...props}
        />

        {iconoDerecha && (
          <View style={estilos.iconoDerecha}>{iconoDerecha}</View>
        )}
      </View>

      {error && <Text style={estilos.textoError}>{error}</Text>}
      {exito && !error && <Text style={estilos.textoExito}>✓ Válido</Text>}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: espaciado.md,
  },
  etiqueta: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderWidth: 1.5,
    borderRadius: borderRadius.sm,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.md,
    fontSize: tipografia.tamanoFuente.md,
    color: colores.texto,
  },
  inputConIconoIzquierda: {
    paddingLeft: espaciado.xs,
  },
  inputConIconoDerecha: {
    paddingRight: espaciado.xs,
  },
  iconoIzquierda: {
    paddingLeft: espaciado.md,
  },
  iconoDerecha: {
    paddingRight: espaciado.md,
  },
  textoError: {
    color: colores.error,
    fontSize: tipografia.tamanoFuente.sm,
    marginTop: espaciado.xs,
  },
  textoExito: {
    color: colores.exito,
    fontSize: tipografia.tamanoFuente.sm,
    marginTop: espaciado.xs,
  },
});
