/**
 * Componente de Captura de Cámara
 * Permite tomar fotos con la cámara o seleccionar de galería
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface CameraCaptureProps {
  visible: boolean;
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  visible,
  onCapture,
  onClose,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  /**
   * Tomar foto con la cámara
   */
  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        if (photo && photo.base64) {
          const base64Image = `data:image/jpeg;base64,${photo.base64}`;
          onCapture(base64Image);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
        console.error(error);
      }
    }
  };

  /**
   * Seleccionar imagen de la galería
   */
  const seleccionarDeGaleria = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onCapture(base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      console.error(error);
    }
  };

  /**
   * Cambiar entre cámara frontal y trasera
   */
  const cambiarCamara = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={estilos.contenedorPermiso}>
          <MaterialIcons name="camera-alt" size={80} color={colores.textoSecundario} />
          <Text style={estilos.textoPermiso}>
            Se necesita permiso para usar la cámara
          </Text>
          <TouchableOpacity style={estilos.botonPermiso} onPress={requestPermission}>
            <Text style={estilos.textoBotonPermiso}>Conceder permiso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botonCerrar} onPress={onClose}>
            <Text style={estilos.textoBotonCerrar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={estilos.contenedor}>
        <CameraView style={estilos.camara} facing={facing} ref={cameraRef}>
          {/* Header con botón cerrar */}
          <View style={estilos.header}>
            <TouchableOpacity style={estilos.botonHeader} onPress={onClose}>
              <MaterialIcons name="close" size={32} color={colores.superficie} />
            </TouchableOpacity>
            <Text style={estilos.titulo}>Capturar Imagen</Text>
            <View style={estilos.botonHeader} />
          </View>

          {/* Botones de acción */}
          <View style={estilos.botonesContainer}>
            {/* Botón Galería */}
            <TouchableOpacity
              style={estilos.botonAccion}
              onPress={seleccionarDeGaleria}
            >
              <MaterialIcons name="photo-library" size={32} color={colores.superficie} />
              <Text style={estilos.textoBoton}>Galería</Text>
            </TouchableOpacity>

            {/* Botón Capturar (grande) */}
            <TouchableOpacity style={estilos.botonCaptura} onPress={tomarFoto}>
              <View style={estilos.botonCapturaInterior} />
            </TouchableOpacity>

            {/* Botón Voltear Cámara */}
            <TouchableOpacity style={estilos.botonAccion} onPress={cambiarCamara}>
              <MaterialIcons
                name="flip-camera-ios"
                size={32}
                color={colores.superficie}
              />
              <Text style={estilos.textoBoton}>Voltear</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondoOscuro,
  },
  camara: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: espaciado.md,
    paddingBottom: espaciado.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  botonHeader: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.superficie,
  },
  botonesContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: espaciado.xl,
  },
  botonAccion: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.sm,
  },
  textoBoton: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.xs,
    marginTop: espaciado.xs,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  botonCaptura: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colores.primario,
  },
  botonCapturaInterior: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colores.primario,
  },
  contenedorPermiso: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    padding: espaciado.xl,
  },
  textoPermiso: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    textAlign: 'center',
    marginTop: espaciado.lg,
    marginBottom: espaciado.xl,
  },
  botonPermiso: {
    backgroundColor: colores.primario,
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.md,
    borderRadius: 8,
    marginBottom: espaciado.md,
  },
  textoBotonPermiso: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.negrita as any,
  },
  botonCerrar: {
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.md,
  },
  textoBotonCerrar: {
    color: colores.textoSecundario,
    fontSize: tipografia.tamanoFuente.md,
  },
});
