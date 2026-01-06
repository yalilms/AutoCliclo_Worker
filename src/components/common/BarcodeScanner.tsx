/**
 * Componente Escáner de Códigos QR y Barras
 * Permite escanear códigos para búsqueda rápida
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Vibration,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface BarcodeScannerProps {
  visible: boolean;
  onScan: (data: string) => void;
  onClose: () => void;
  titulo?: string;
  mensaje?: string;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  visible,
  onScan,
  onClose,
  titulo = 'Escanear Código',
  mensaje = 'Apunta al código QR o de barras',
}) => {
  const [escaneado, setEscaneado] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible) {
      setEscaneado(false);
      if (!permission?.granted) {
        requestPermission();
      }
    }
  }, [visible]);

  /**
   * Manejar código escaneado
   */
  const manejarEscaneo = ({ data }: { data: string }) => {
    if (!escaneado && data) {
      setEscaneado(true);

      // Vibración para feedback
      if (Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }

      onScan(data);
    }
  };

  /**
   * Resetear escáner
   */
  const escanearDeNuevo = () => {
    setEscaneado(false);
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={estilos.contenedorPermiso}>
          <MaterialIcons name="qr-code-scanner" size={80} color={colores.textoSecundario} />
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
        <CameraView
          style={estilos.camara}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'ean13',
              'ean8',
              'code128',
              'code39',
              'code93',
              'upc_a',
              'upc_e',
            ],
          }}
          onBarcodeScanned={escaneado ? undefined : manejarEscaneo}
        >
          {/* Header */}
          <View style={estilos.header}>
            <TouchableOpacity style={estilos.botonHeader} onPress={onClose}>
              <MaterialIcons name="close" size={32} color={colores.superficie} />
            </TouchableOpacity>
            <Text style={estilos.titulo}>{titulo}</Text>
            <View style={estilos.botonHeader} />
          </View>

          {/* Overlay de enfoque */}
          <View style={estilos.overlayContainer}>
            <View style={estilos.overlay}>
              {/* Esquinas del marco de escaneo */}
              <View style={[estilos.esquina, estilos.esquinaSuperiorIzquierda]} />
              <View style={[estilos.esquina, estilos.esquinaSuperiorDerecha]} />
              <View style={[estilos.esquina, estilos.esquinaInferiorIzquierda]} />
              <View style={[estilos.esquina, estilos.esquinaInferiorDerecha]} />
            </View>
          </View>

          {/* Mensaje de instrucciones */}
          <View style={estilos.mensajeContainer}>
            <Text style={estilos.mensaje}>{mensaje}</Text>
          </View>

          {/* Botón de re-escanear */}
          {escaneado && (
            <View style={estilos.botonContainer}>
              <TouchableOpacity
                style={estilos.botonReescanear}
                onPress={escanearDeNuevo}
              >
                <MaterialIcons name="refresh" size={24} color={colores.superficie} />
                <Text style={estilos.textoBotonReescanear}>Escanear de nuevo</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  esquina: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colores.exito,
  },
  esquinaSuperiorIzquierda: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  esquinaSuperiorDerecha: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  esquinaInferiorIzquierda: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  esquinaInferiorDerecha: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  mensajeContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mensaje: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: espaciado.lg,
    paddingVertical: espaciado.md,
    borderRadius: 8,
  },
  botonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  botonReescanear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primario,
    paddingHorizontal: espaciado.lg,
    paddingVertical: espaciado.md,
    borderRadius: 8,
    gap: espaciado.sm,
  },
  textoBotonReescanear: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.negrita as any,
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
