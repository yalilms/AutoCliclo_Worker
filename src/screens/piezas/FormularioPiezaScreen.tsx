/**
 * Pantalla de Formulario de Pieza
 * Permite crear y editar piezas con validaciones
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { PiezasStackParamList } from '../../navigation/PiezasNavigator';
import { Input } from '../../components/common/Input';
import { Boton } from '../../components/common/Boton';
import { CameraCapture } from '../../components/common/CameraCapture';
import { BarcodeScanner } from '../../components/common/BarcodeScanner';
import { Pieza, PiezaFormData, formDataToPieza, piezaToFormData } from '../../models/Pieza';
import { PiezaService } from '../../services/PiezaService';
import { CATEGORIAS_PIEZA, CODIGO_PIEZA_REGEX } from '../../utils/constantes';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type FormularioPiezaRouteProp = RouteProp<PiezasStackParamList, 'FormularioPieza'>;
type FormularioPiezaNavigationProp = StackNavigationProp<PiezasStackParamList, 'FormularioPieza'>;

export const FormularioPiezaScreen: React.FC = () => {
  const route = useRoute<FormularioPiezaRouteProp>();
  const navigation = useNavigation<FormularioPiezaNavigationProp>();
  const piezaId = route.params?.piezaId;
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState<PiezaFormData>({
    codigo_pieza: '',
    nombre: '',
    categoria: 'motor',
    precio_venta: '0',
    stock_disponible: '0',
    stock_minimo: '1',
    ubicacion_almacen: '',
    compatible_marcas: '',
    descripcion: '',
  });
  const [errores, setErrores] = useState<Partial<Record<keyof PiezaFormData, string>>>({});
  const [imagen, setImagen] = useState<string | null>(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(false);

  const modoEdicion = !!piezaId;

  /**
   * Cargar pieza si estamos en modo edición
   */
  useEffect(() => {
    if (piezaId) {
      cargarPieza();
    }
  }, [piezaId]);

  const cargarPieza = async () => {
    try {
      setCargando(true);
      const pieza = await PiezaService.obtenerPorId(piezaId!);
      if (pieza) {
        setFormulario(piezaToFormData(pieza));
        if (pieza.imagen) {
          setImagen(pieza.imagen);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la pieza');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Manejar captura de imagen desde cámara
   */
  const manejarCapturaImagen = (base64: string) => {
    setImagen(base64);
    setMostrarCamara(false);
  };

  /**
   * Manejar escaneo de código QR/barras
   */
  const manejarEscaneo = (codigo: string) => {
    actualizarCampo('codigo_pieza', codigo.toUpperCase());
    setMostrarScanner(false);
    Alert.alert('Código escaneado', `Se ha completado el código: ${codigo.toUpperCase()}`);
  };

  /**
   * Eliminar imagen
   */
  const eliminarImagen = () => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro de eliminar la imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setImagen(null),
        },
      ]
    );
  };

  /**
   * Actualizar campo del formulario
   */
  const actualizarCampo = (campo: keyof PiezaFormData, valor: string) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo al escribir
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  /**
   * Validar formulario
   */
  const validarFormulario = async (): Promise<boolean> => {
    const nuevosErrores: Partial<Record<keyof PiezaFormData, string>> = {};

    // Código de pieza
    if (!formulario.codigo_pieza.trim()) {
      nuevosErrores.codigo_pieza = 'El código es requerido';
    } else if (!CODIGO_PIEZA_REGEX.test(formulario.codigo_pieza)) {
      nuevosErrores.codigo_pieza = 'Formato inválido (solo A-Z, 0-9 y -)';
    } else if (!modoEdicion) {
      // Verificar duplicado solo en modo creación
      const existe = await PiezaService.existeCodigoPieza(formulario.codigo_pieza);
      if (existe) {
        nuevosErrores.codigo_pieza = 'Este código ya existe';
      }
    }

    // Nombre
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    // Precio
    const precio = parseFloat(formulario.precio_venta);
    if (isNaN(precio) || precio < 0) {
      nuevosErrores.precio_venta = 'El precio debe ser >= 0';
    }

    // Stock disponible
    const stock = parseInt(formulario.stock_disponible);
    if (isNaN(stock) || stock < 0) {
      nuevosErrores.stock_disponible = 'El stock debe ser >= 0';
    }

    // Stock mínimo
    const stockMin = parseInt(formulario.stock_minimo);
    if (isNaN(stockMin) || stockMin < 1) {
      nuevosErrores.stock_minimo = 'El stock mínimo debe ser >= 1';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /**
   * Guardar pieza
   */
  const manejarGuardar = async () => {
    const esValido = await validarFormulario();
    if (!esValido) {
      Alert.alert('Errores', 'Por favor corrige los errores del formulario');
      return;
    }

    try {
      setCargando(true);
      const piezaData = formDataToPieza(formulario);

      // Añadir imagen si existe
      if (imagen) {
        piezaData.imagen = imagen;
      }

      if (modoEdicion) {
        await PiezaService.actualizar(piezaId!, piezaData);
        Alert.alert('Éxito', 'Pieza actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await PiezaService.crear(piezaData);
        Alert.alert('Éxito', 'Pieza creada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la pieza');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView style={estilos.scrollView}>
        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            {modoEdicion ? 'Editar Pieza' : 'Nueva Pieza'}
          </Text>

          {/* Código de pieza con scanner */}
          <View>
            <Input
              etiqueta="Código de Pieza *"
              placeholder="Ej: MOT-123"
              value={formulario.codigo_pieza}
              onChangeText={(valor) => actualizarCampo('codigo_pieza', valor.toUpperCase())}
              error={errores.codigo_pieza}
              editable={!modoEdicion} // No editable en modo edición
              autoCapitalize="characters"
            />
            {!modoEdicion && (
              <TouchableOpacity
                style={estilos.botonScanner}
                onPress={() => setMostrarScanner(true)}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color={colores.primario} />
                <Text style={estilos.textoBotonScanner}>Escanear código</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nombre */}
          <Input
            etiqueta="Nombre *"
            placeholder="Ej: Motor de arranque"
            value={formulario.nombre}
            onChangeText={(valor) => actualizarCampo('nombre', valor)}
            error={errores.nombre}
          />

          {/* Categoría */}
          <Text style={estilos.etiqueta}>Categoría *</Text>
          <View style={estilos.categoriasContainer}>
            {CATEGORIAS_PIEZA.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  estilos.categoriaChip,
                  formulario.categoria === cat && estilos.categoriaChipActivo,
                ]}
                onPress={() => actualizarCampo('categoria', cat)}
              >
                <Text
                  style={[
                    estilos.categoriaTexto,
                    formulario.categoria === cat && estilos.categoriaTextoActivo,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Precio */}
          <Input
            etiqueta="Precio de Venta (€) *"
            placeholder="0.00"
            value={formulario.precio_venta}
            onChangeText={(valor) => actualizarCampo('precio_venta', valor)}
            error={errores.precio_venta}
            keyboardType="decimal-pad"
          />

          {/* Stock disponible */}
          <Input
            etiqueta="Stock Disponible *"
            placeholder="0"
            value={formulario.stock_disponible}
            onChangeText={(valor) => actualizarCampo('stock_disponible', valor)}
            error={errores.stock_disponible}
            keyboardType="number-pad"
          />

          {/* Stock mínimo */}
          <Input
            etiqueta="Stock Mínimo *"
            placeholder="1"
            value={formulario.stock_minimo}
            onChangeText={(valor) => actualizarCampo('stock_minimo', valor)}
            error={errores.stock_minimo}
            keyboardType="number-pad"
          />

          {/* Ubicación almacén */}
          <Input
            etiqueta="Ubicación en Almacén"
            placeholder="Ej: A-1-2"
            value={formulario.ubicacion_almacen}
            onChangeText={(valor) => actualizarCampo('ubicacion_almacen', valor)}
            autoCapitalize="characters"
          />

          {/* Marcas compatibles */}
          <Input
            etiqueta="Marcas Compatibles"
            placeholder="Ej: Volkswagen Golf 2015-2020"
            value={formulario.compatible_marcas}
            onChangeText={(valor) => actualizarCampo('compatible_marcas', valor)}
            multiline
            numberOfLines={3}
          />

          {/* Descripción */}
          <Input
            etiqueta="Descripción"
            placeholder="Descripción detallada de la pieza..."
            value={formulario.descripcion}
            onChangeText={(valor) => actualizarCampo('descripcion', valor)}
            multiline
            numberOfLines={4}
          />

          {/* Imagen */}
          <Text style={estilos.etiqueta}>Imagen de la Pieza</Text>
          {imagen ? (
            <View style={estilos.imagenContainer}>
              <Image source={{ uri: imagen }} style={estilos.imagenPreview} />
              <View style={estilos.botonesImagen}>
                <TouchableOpacity
                  style={estilos.botonImagenAccion}
                  onPress={() => setMostrarCamara(true)}
                >
                  <MaterialIcons name="camera-alt" size={20} color={colores.primario} />
                  <Text style={estilos.textoBotonImagen}>Cambiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={estilos.botonImagenAccion}
                  onPress={eliminarImagen}
                >
                  <MaterialIcons name="delete" size={20} color={colores.error} />
                  <Text style={[estilos.textoBotonImagen, { color: colores.error }]}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={estilos.botonTomarFoto}
              onPress={() => setMostrarCamara(true)}
            >
              <MaterialIcons name="add-a-photo" size={48} color={colores.textoSecundario} />
              <Text style={estilos.textoTomarFoto}>Tomar foto de la pieza</Text>
            </TouchableOpacity>
          )}

          {/* Botones */}
          <View style={estilos.botonesContainer}>
            <Boton
              titulo="Cancelar"
              onPress={() => navigation.goBack()}
              variante="secundario"
              estilo={estilos.boton}
            />
            <Boton
              titulo={modoEdicion ? 'Actualizar' : 'Guardar'}
              onPress={manejarGuardar}
              variante="primario"
              cargando={cargando}
              estilo={estilos.boton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal de Cámara */}
      <CameraCapture
        visible={mostrarCamara}
        onCapture={manejarCapturaImagen}
        onClose={() => setMostrarCamara(false)}
      />

      {/* Modal de Scanner */}
      <BarcodeScanner
        visible={mostrarScanner}
        onScan={manejarEscaneo}
        onClose={() => setMostrarScanner(false)}
        titulo="Escanear Código de Pieza"
        mensaje="Apunta al código QR o de barras de la pieza"
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scrollView: {
    flex: 1,
  },
  formulario: {
    padding: espaciado.md,
  },
  titulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.texto,
    marginBottom: espaciado.lg,
  },
  etiqueta: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
    marginBottom: espaciado.md,
  },
  categoriaChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  categoriaChipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  categoriaTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
  },
  categoriaTextoActivo: {
    color: colores.superficie,
    fontWeight: tipografia.pesoFuente.semibold as any,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: espaciado.md,
    marginTop: espaciado.lg,
  },
  boton: {
    flex: 1,
  },
  botonScanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    marginTop: espaciado.sm,
    marginBottom: espaciado.md,
    backgroundColor: colores.superficie,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.primario,
    gap: espaciado.sm,
  },
  textoBotonScanner: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.primario,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  imagenContainer: {
    marginBottom: espaciado.md,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  imagenPreview: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  botonesImagen: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  botonImagenAccion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaciado.md,
    gap: espaciado.xs,
  },
  textoBotonImagen: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.primario,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
  botonTomarFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaciado.xxxl,
    marginBottom: espaciado.md,
    backgroundColor: colores.superficie,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colores.borde,
  },
  textoTomarFoto: {
    fontSize: tipografia.tamanoFuente.md,
    color: colores.textoSecundario,
    marginTop: espaciado.md,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
});
