/**
 * Pantalla de Formulario para Extraer Pieza de un Vehículo
 * Crea una nueva pieza y la asigna automáticamente al vehículo
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { VehiculosStackParamList } from '../../navigation/VehiculosNavigator';
import { Input } from '../../components/common/Input';
import { Boton } from '../../components/common/Boton';
import { Selector } from '../../components/common/Selector';
import { SelectorMultiple } from '../../components/common/SelectorMultiple';
import { CameraCapture } from '../../components/common/CameraCapture';
import { PiezaFormData, formDataToPieza } from '../../models/Pieza';
import { PiezaService } from '../../services/PiezaService';
import { InventarioService } from '../../services/InventarioService';
import { CATEGORIAS_PIEZA, CODIGO_PIEZA_REGEX, ESTADO_PIEZA } from '../../utils/constantes';
import { obtenerUbicacionesPiezas, obtenerMarcas } from '../../utils/datosVehiculos';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type FormularioExtraerPiezaRouteProp = RouteProp<VehiculosStackParamList, 'FormularioExtraerPieza'>;
type FormularioExtraerPiezaNavigationProp = StackNavigationProp<VehiculosStackParamList, 'FormularioExtraerPieza'>;

export const FormularioExtraerPiezaScreen: React.FC = () => {
  const route = useRoute<FormularioExtraerPiezaRouteProp>();
  const navigation = useNavigation<FormularioExtraerPiezaNavigationProp>();
  const { vehiculoId, matricula, marca, modelo } = route.params;

  const [formulario, setFormulario] = useState<PiezaFormData>({
    codigo_pieza: '',
    nombre: '',
    categoria: 'motor',
    precio_venta: '',
    stock_disponible: '1',
    stock_minimo: '1',
    ubicacion_almacen: '',
    compatible_marcas: `${marca}`,
    descripcion: '',
  });
  const [errores, setErrores] = useState<Partial<Record<keyof PiezaFormData, string>>>({});
  const [imagen, setImagen] = useState<string | null>(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);

  // Datos de inventario
  const [cantidad, setCantidad] = useState('1');
  const [estadoPieza, setEstadoPieza] = useState<'nueva' | 'usada' | 'reparada'>('usada');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [notas, setNotas] = useState('');

  const actualizarCampo = (campo: keyof PiezaFormData, valor: string) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo al escribir
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const manejarCapturaImagen = (base64: string) => {
    setImagen(base64);
    setMostrarCamara(false);
  };

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

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<Record<keyof PiezaFormData, string>> = {};

    // Validar código de pieza
    if (!formulario.codigo_pieza.trim()) {
      nuevosErrores.codigo_pieza = 'El código de pieza es obligatorio';
    } else if (!CODIGO_PIEZA_REGEX.test(formulario.codigo_pieza)) {
      nuevosErrores.codigo_pieza = 'Formato inválido. Use XXX-999 (ej: MOT-123)';
    }

    // Validar nombre
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar precio de venta
    const precio = parseFloat(formulario.precio_venta);
    if (!formulario.precio_venta || isNaN(precio) || precio <= 0) {
      nuevosErrores.precio_venta = 'El precio debe ser mayor a 0';
    }

    // Validar stock disponible
    const stock = parseInt(formulario.stock_disponible);
    if (!formulario.stock_disponible || isNaN(stock) || stock < 0) {
      nuevosErrores.stock_disponible = 'El stock debe ser 0 o mayor';
    }

    // Validar stock mínimo
    const stockMin = parseInt(formulario.stock_minimo);
    if (!formulario.stock_minimo || isNaN(stockMin) || stockMin < 1) {
      nuevosErrores.stock_minimo = 'El stock mínimo debe ser al menos 1';
    }

    // Validar cantidad de extracción
    const cant = parseInt(cantidad);
    if (!cantidad || isNaN(cant) || cant < 1) {
      Alert.alert('Error', 'La cantidad extraída debe ser al menos 1');
      return false;
    }

    // Validar precio unitario de extracción
    const precioUnit = parseFloat(precioUnitario);
    if (!precioUnitario || isNaN(precioUnit) || precioUnit < 0) {
      Alert.alert('Error', 'El precio unitario debe ser 0 o mayor');
      return false;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error de Validación', 'Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      // 1. Crear la pieza
      const piezaData = formDataToPieza(formulario);
      const piezaConImagen = imagen ? { ...piezaData, imagen } : piezaData;
      const piezaId = await PiezaService.crear(piezaConImagen);

      // 2. Asignar pieza al vehículo (inventario)
      await InventarioService.crear({
        id_vehiculo: vehiculoId,
        id_pieza: piezaId,
        cantidad: parseInt(cantidad),
        estado_pieza: estadoPieza,
        fecha_extraccion: new Date().toISOString().split('T')[0],
        precio_unitario: parseFloat(precioUnitario),
        notas: notas || undefined,
      });

      Alert.alert(
        'Éxito',
        `Pieza "${formulario.nombre}" extraída y registrada correctamente`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error al extraer pieza:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar la pieza');
    }
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView style={estilos.scrollView}>
        <View style={estilos.formulario}>
          {/* Info del vehículo */}
          <View style={estilos.infoVehiculo}>
            <MaterialIcons name="directions-car" size={24} color={colores.primario} />
            <View style={estilos.infoTextos}>
              <Text style={estilos.infoTitulo}>Extrayendo pieza de:</Text>
              <Text style={estilos.infoVehiculoTexto}>
                {marca} {modelo} - {matricula}
              </Text>
            </View>
          </View>

          <Text style={estilos.seccionTitulo}>📋 Información de la Pieza</Text>

          {/* Código de pieza */}
          <Input
            etiqueta="Código de Pieza *"
            placeholder="Ej: MOT-123"
            value={formulario.codigo_pieza}
            onChangeText={(valor) => actualizarCampo('codigo_pieza', valor.toUpperCase())}
            error={errores.codigo_pieza}
            autoCapitalize="characters"
          />

          {/* Nombre */}
          <Input
            etiqueta="Nombre *"
            placeholder="Ej: Motor de arranque"
            value={formulario.nombre}
            onChangeText={(valor) => actualizarCampo('nombre', valor)}
            error={errores.nombre}
          />

          {/* Categoría */}
          <Selector
            etiqueta="Categoría *"
            placeholder="Selecciona una categoría"
            valor={formulario.categoria}
            opciones={CATEGORIAS_PIEZA.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))}
            onSeleccionar={(valor) => actualizarCampo('categoria', valor.toLowerCase())}
          />

          {/* Precio de venta */}
          <Input
            etiqueta="Precio de Venta *"
            placeholder="0.00"
            value={formulario.precio_venta}
            onChangeText={(valor) => actualizarCampo('precio_venta', valor)}
            error={errores.precio_venta}
            keyboardType="decimal-pad"
          />

          {/* Stock disponible */}
          <Input
            etiqueta="Stock Disponible *"
            placeholder="1"
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
          <Selector
            etiqueta="Ubicación en Almacén"
            placeholder="Selecciona una ubicación"
            valor={formulario.ubicacion_almacen}
            opciones={obtenerUbicacionesPiezas()}
            onSeleccionar={(valor) => actualizarCampo('ubicacion_almacen', valor)}
          />

          {/* Marcas compatibles */}
          <SelectorMultiple
            etiqueta="Marcas Compatibles"
            placeholder="Selecciona las marcas compatibles"
            valores={formulario.compatible_marcas ? formulario.compatible_marcas.split(', ') : []}
            opciones={obtenerMarcas()}
            onCambio={(marcas) => actualizarCampo('compatible_marcas', marcas.join(', '))}
          />

          {/* Descripción */}
          <Input
            etiqueta="Descripción"
            placeholder="Descripción detallada de la pieza..."
            value={formulario.descripcion}
            onChangeText={(valor) => actualizarCampo('descripcion', valor)}
            multilinea
            numeroLineas={4}
          />

          <Text style={estilos.seccionTitulo}>🔧 Detalles de la Extracción</Text>

          {/* Cantidad extraída */}
          <Input
            etiqueta="Cantidad Extraída *"
            placeholder="1"
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="number-pad"
          />

          {/* Estado de la pieza */}
          <Selector
            etiqueta="Estado de la Pieza *"
            placeholder="Selecciona el estado"
            valor={estadoPieza.charAt(0).toUpperCase() + estadoPieza.slice(1)}
            opciones={ESTADO_PIEZA.map(e => e.charAt(0).toUpperCase() + e.slice(1))}
            onSeleccionar={(valor) => setEstadoPieza(valor.toLowerCase() as any)}
          />

          {/* Precio unitario */}
          <Input
            etiqueta="Precio Unitario de Extracción *"
            placeholder="0.00"
            value={precioUnitario}
            onChangeText={setPrecioUnitario}
            keyboardType="decimal-pad"
          />

          {/* Notas */}
          <Input
            etiqueta="Notas / Observaciones"
            placeholder="Notas adicionales sobre la extracción..."
            value={notas}
            onChangeText={setNotas}
            multilinea
            numeroLineas={3}
          />

          {/* Imagen */}
          {imagen ? (
            <View style={estilos.imagenContainer}>
              <Image source={{ uri: imagen }} style={estilos.imagen} resizeMode="cover" />
              <TouchableOpacity style={estilos.botonEliminarImagen} onPress={eliminarImagen}>
                <MaterialIcons name="close" size={24} color={colores.superficie} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={estilos.botonTomarFoto}
              onPress={() => setMostrarCamara(true)}
            >
              <MaterialIcons name="camera-alt" size={48} color={colores.textoSecundario} />
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
              titulo="Guardar Pieza"
              onPress={manejarGuardar}
              variante="primario"
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
  infoVehiculo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    padding: espaciado.md,
    borderRadius: 8,
    marginBottom: espaciado.lg,
    borderLeftWidth: 4,
    borderLeftColor: colores.primario,
  },
  infoTextos: {
    marginLeft: espaciado.md,
    flex: 1,
  },
  infoTitulo: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginBottom: espaciado.xs,
  },
  infoVehiculoTexto: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
  },
  seccionTitulo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.texto,
    marginTop: espaciado.lg,
    marginBottom: espaciado.md,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: espaciado.md,
    marginTop: espaciado.lg,
  },
  boton: {
    flex: 1,
  },
  imagenContainer: {
    marginBottom: espaciado.md,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  imagen: {
    width: '100%',
    height: 200,
  },
  botonEliminarImagen: {
    position: 'absolute',
    top: espaciado.sm,
    right: espaciado.sm,
    backgroundColor: colores.error,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonTomarFoto: {
    backgroundColor: colores.superficie,
    padding: espaciado.xl,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.md,
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
