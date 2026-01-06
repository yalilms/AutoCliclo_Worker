/**
 * Componente Selector
 * Lista desplegable para seleccionar opciones
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

interface SelectorProps {
  etiqueta?: string;
  placeholder?: string;
  valor: string;
  opciones: string[];
  onSeleccionar: (opcion: string) => void;
  error?: string;
  deshabilitado?: boolean;
}

export const Selector: React.FC<SelectorProps> = ({
  etiqueta,
  placeholder = 'Selecciona una opción',
  valor,
  opciones,
  onSeleccionar,
  error,
  deshabilitado = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const manejarSeleccion = (opcion: string) => {
    onSeleccionar(opcion);
    setModalVisible(false);
  };

  const renderOpcion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        estilos.opcion,
        item === valor && estilos.opcionSeleccionada,
      ]}
      onPress={() => manejarSeleccion(item)}
    >
      <Text
        style={[
          estilos.textoOpcion,
          item === valor && estilos.textoOpcionSeleccionada,
        ]}
      >
        {item}
      </Text>
      {item === valor && (
        <MaterialIcons name="check" size={20} color={colores.primario} />
      )}
    </TouchableOpacity>
  );

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
            !valor && estilos.textoPlaceholder,
          ]}
        >
          {valor || placeholder}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={deshabilitado ? colores.textoDeshabilitado : colores.textoSecundario}
        />
      </TouchableOpacity>

      {error && <Text style={estilos.textoError}>{error}</Text>}

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
              <Text style={estilos.modalTitulo}>{etiqueta || 'Selecciona una opción'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colores.texto} />
              </TouchableOpacity>
            </View>

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
});
