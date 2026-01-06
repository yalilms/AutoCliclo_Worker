/**
 * Componente Visor de Imágenes con Zoom
 * Permite ver imágenes a pantalla completa con pinch-to-zoom
 */

import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';

const { width, height } = Dimensions.get('window');

interface ImageViewerProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  imageUrl,
  onClose,
  onDelete,
  onShare,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={estilos.contenedor}>
        {/* Header con controles */}
        <View style={estilos.header}>
          <TouchableOpacity style={estilos.botonHeader} onPress={onClose}>
            <MaterialIcons name="close" size={28} color={colores.superficie} />
          </TouchableOpacity>

          <View style={estilos.botonesAccion}>
            {onShare && (
              <TouchableOpacity style={estilos.botonHeader} onPress={onShare}>
                <MaterialIcons name="share" size={24} color={colores.superficie} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={estilos.botonHeader} onPress={onDelete}>
                <MaterialIcons name="delete" size={24} color={colores.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Imagen */}
        <View style={estilos.imagenContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={estilos.imagen}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondoOscuro,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: espaciado.md,
    paddingBottom: espaciado.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  botonHeader: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonesAccion: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  imagenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: width,
    height: height - 100,
  },
});
