/**
 * Componente SelectorMultiple
 * Lista desplegable para seleccionar múltiples opciones
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface SelectorMultipleProps {
  etiqueta?: string;
  placeholder?: string;
  valores: string[];
  opciones: string[];
  onCambio: (valores: string[]) => void;
  error?: string;
  deshabilitado?: boolean;
}

export const SelectorMultiple: React.FC<SelectorMultipleProps> = ({
  etiqueta,
  placeholder = 'Selecciona opciones',
  valores,
  opciones,
  onCambio,
  error,
  deshabilitado = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleOpcion = (opcion: string) => {
    if (valores.includes(opcion)) {
      onCambio(valores.filter((v) => v !== opcion));
    } else {
      onCambio([...valores, opcion]);
    }
  };

  const limpiarSeleccion = () => {
    onCambio([]);
  };

  const textoMostrar = valores.length > 0 ? valores.join(', ') : placeholder;

  const renderOpcion = ({ item }: { item: string }) => {
    const seleccionada = valores.includes(item);

    return (
      <TouchableOpacity
        style={[
          estilos.opcion,
          seleccionada && estilos.opcionSeleccionada,
        ]}
        onPress={() => toggleOpcion(item)}
      >
        <Text
          style={[
            estilos.textoOpcion,
            seleccionada && estilos.textoOpcionSeleccionada,
          ]}
        >
          {item}
        </Text>
        <View
          style={[
            estilos.checkbox,
            seleccionada && estilos.checkboxSeleccionado,
          ]}
        >
          {seleccionada && (
            <MaterialIcons name="check" size={16} color={colores.superficie} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={estilos.contenedor}>
      {etiqueta && <Text style={estilos.etiqueta}>{etiqueta}</Text>}

      <TouchableOpacity
        style={[
          estilos.selector,
          error && estilos.selectorError,
          deshabilitado && estilos.selectorDeshabilitado,
        ]}
        onPress={() => !deshabilitado && setModalVisible(true)}
        disabled={deshabilitado}
      >
        <Text
          style={[
            estilos.textoSelector,
            valores.length === 0 && estilos.textoPlaceholder,
          ]}
          numberOfLines={1}
        >
          {textoMostrar}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={deshabilitado ? colores.textoDeshabilitado : colores.textoSecundario}
        />
      </TouchableOpacity>

      {error && <Text style={estilos.textoError}>{error}</Text>}

      {/* Chips de selección */}
      {valores.length > 0 && (
        <View style={estilos.chipsContainer}>
          {valores.map((valor) => (
            <View key={valor} style={estilos.chip}>
              <Text style={estilos.chipTexto}>{valor}</Text>
              <TouchableOpacity
                onPress={() => toggleOpcion(valor)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <MaterialIcons name="close" size={16} color={colores.superficie} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Modal de opciones */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={estilos.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={estilos.modalContenido}>
            <View style={estilos.modalHeader}>
              <Text style={estilos.modalTitulo}>
                {etiqueta || 'Selecciona opciones'}
              </Text>
              <View style={estilos.headerBotones}>
                {valores.length > 0 && (
                  <TouchableOpacity
                    onPress={limpiarSeleccion}
                    style={estilos.botonLimpiar}
                  >
                    <Text style={estilos.textoLimpiar}>Limpiar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={colores.texto} />
                </TouchableOpacity>
              </View>
            </View>

            {valores.length > 0 && (
              <View style={estilos.contadorContainer}>
                <Text style={estilos.contadorTexto}>
                  {valores.length} {valores.length === 1 ? 'seleccionada' : 'seleccionadas'}
                </Text>
              </View>
            )}

            <FlatList
              data={opciones}
              renderItem={renderOpcion}
              keyExtractor={(item) => item}
              style={estilos.lista}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </Pressable>
      </Modal>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: borderRadius.sm,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.md,
    minHeight: 50,
  },
  selectorError: {
    borderColor: colores.error,
  },
  selectorDeshabilitado: {
    backgroundColor: colores.fondo,
    opacity: 0.6,
  },
  textoSelector: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.texto,
    flex: 1,
  },
  textoPlaceholder: {
    color: colores.textoSecundario,
  },
  textoError: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.error,
    marginTop: espaciado.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
    marginTop: espaciado.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primario,
    borderRadius: borderRadius.redondo,
    paddingVertical: espaciado.xs,
    paddingHorizontal: espaciado.sm,
    gap: espaciado.xs,
  },
  chipTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.superficie,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.lg,
  },
  modalContenido: {
    backgroundColor: colores.superficie,
    borderRadius: borderRadius.md,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.divisor,
  },
  modalTitulo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    flex: 1,
  },
  headerBotones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
  },
  botonLimpiar: {
    paddingHorizontal: espaciado.sm,
  },
  textoLimpiar: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.primario,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  contadorContainer: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    backgroundColor: colores.fondo,
  },
  contadorTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
  },
  lista: {
    maxHeight: 400,
  },
  opcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.divisor,
  },
  opcionSeleccionada: {
    backgroundColor: colores.primarioClaro,
  },
  textoOpcion: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.texto,
    flex: 1,
  },
  textoOpcionSeleccionada: {
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.primario,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSeleccionado: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
});
