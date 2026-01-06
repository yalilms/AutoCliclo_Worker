/**
 * Pantalla de Formulario de Vehículo
 * Permite crear y editar vehículos con validaciones
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VehiculosStackParamList } from '../../navigation/VehiculosNavigator';
import { Input } from '../../components/common/Input';
import { Boton } from '../../components/common/Boton';
import { Vehiculo, VehiculoFormData, formDataToVehiculo, vehiculoToFormData, formatearMatricula } from '../../models/Vehiculo';
import { VehiculoService } from '../../services/VehiculoService';
import { obtenerMarcas, obtenerModelos } from '../../utils/datosVehiculos';
import { ESTADO_VEHICULO, MATRICULA_REGEX, MIN_ANIO, MAX_ANIO } from '../../utils/constantes';
import { colores } from '../../theme/colores';
import { espaciado } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

type FormularioVehiculoRouteProp = RouteProp<VehiculosStackParamList, 'FormularioVehiculo'>;
type FormularioVehiculoNavigationProp = StackNavigationProp<VehiculosStackParamList, 'FormularioVehiculo'>;

export const FormularioVehiculoScreen: React.FC = () => {
  const route = useRoute<FormularioVehiculoRouteProp>();
  const navigation = useNavigation<FormularioVehiculoNavigationProp>();
  const vehiculoId = route.params?.vehiculoId;
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState<VehiculoFormData>({
    matricula: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear().toString(),
    color: '',
    fecha_entrada: new Date().toISOString().split('T')[0],
    estado: 'completo',
    precio_compra: '0',
    kilometraje: '0',
    ubicacion_gps: '',
    observaciones: '',
  });
  const [errores, setErrores] = useState<Partial<Record<keyof VehiculoFormData, string>>>({});
  const [marcas] = useState<string[]>(obtenerMarcas());
  const [modelos, setModelos] = useState<string[]>([]);

  const modoEdicion = !!vehiculoId;

  useEffect(() => {
    if (vehiculoId) {
      cargarVehiculo();
    }
  }, [vehiculoId]);

  useEffect(() => {
    if (formulario.marca) {
      setModelos(obtenerModelos(formulario.marca));
    } else {
      setModelos([]);
    }
  }, [formulario.marca]);

  const cargarVehiculo = async () => {
    try {
      setCargando(true);
      const vehiculo = await VehiculoService.obtenerPorId(vehiculoId!);
      if (vehiculo) {
        setFormulario(vehiculoToFormData(vehiculo));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el vehículo');
    } finally {
      setCargando(false);
    }
  };

  const actualizarCampo = (campo: keyof VehiculoFormData, valor: string) => {
    if (campo === 'matricula') {
      valor = formatearMatricula(valor);
    }
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const validarFormulario = async (): Promise<boolean> => {
    const nuevosErrores: Partial<Record<keyof VehiculoFormData, string>> = {};

    if (!formulario.matricula.trim()) {
      nuevosErrores.matricula = 'La matrícula es requerida';
    } else if (!MATRICULA_REGEX.test(formulario.matricula)) {
      nuevosErrores.matricula = 'Formato inválido (1234ABC)';
    } else if (!modoEdicion) {
      const existe = await VehiculoService.existeMatricula(formulario.matricula);
      if (existe) {
        nuevosErrores.matricula = 'Esta matrícula ya existe';
      }
    }

    if (!formulario.marca) {
      nuevosErrores.marca = 'La marca es requerida';
    }

    if (!formulario.modelo) {
      nuevosErrores.modelo = 'El modelo es requerido';
    }

    const anio = parseInt(formulario.anio);
    if (isNaN(anio) || anio < MIN_ANIO || anio > MAX_ANIO) {
      nuevosErrores.anio = `El año debe estar entre ${MIN_ANIO} y ${MAX_ANIO}`;
    }

    const precio = parseFloat(formulario.precio_compra);
    if (isNaN(precio) || precio < 0) {
      nuevosErrores.precio_compra = 'El precio debe ser >= 0';
    }

    const km = parseInt(formulario.kilometraje);
    if (isNaN(km) || km < 0) {
      nuevosErrores.kilometraje = 'El kilometraje debe ser >= 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    const esValido = await validarFormulario();
    if (!esValido) {
      Alert.alert('Errores', 'Por favor corrige los errores del formulario');
      return;
    }

    try {
      setCargando(true);
      const vehiculoData = formDataToVehiculo(formulario);

      if (modoEdicion) {
        await VehiculoService.actualizar(vehiculoId!, vehiculoData);
        Alert.alert('Éxito', 'Vehículo actualizado correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await VehiculoService.crear(vehiculoData);
        Alert.alert('Éxito', 'Vehículo creado correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar el vehículo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView style={estilos.scrollView}>
        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            {modoEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </Text>

          <Input
            etiqueta="Matrícula *"
            placeholder="1234ABC"
            value={formulario.matricula}
            onChangeText={(valor) => actualizarCampo('matricula', valor)}
            error={errores.matricula}
            editable={!modoEdicion}
            autoCapitalize="characters"
            maxLength={7}
          />

          <Text style={estilos.etiqueta}>Marca *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.selectContainer}>
            {marcas.map((marca) => (
              <TouchableOpacity
                key={marca}
                style={[
                  estilos.selectChip,
                  formulario.marca === marca && estilos.selectChipActivo,
                ]}
                onPress={() => {
                  actualizarCampo('marca', marca);
                  actualizarCampo('modelo', '');
                }}
              >
                <Text
                  style={[
                    estilos.selectTexto,
                    formulario.marca === marca && estilos.selectTextoActivo,
                  ]}
                >
                  {marca}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {formulario.marca && (
            <>
              <Text style={estilos.etiqueta}>Modelo *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.selectContainer}>
                {modelos.map((modelo) => (
                  <TouchableOpacity
                    key={modelo}
                    style={[
                      estilos.selectChip,
                      formulario.modelo === modelo && estilos.selectChipActivo,
                    ]}
                    onPress={() => actualizarCampo('modelo', modelo)}
                  >
                    <Text
                      style={[
                        estilos.selectTexto,
                        formulario.modelo === modelo && estilos.selectTextoActivo,
                      ]}
                    >
                      {modelo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <Input
            etiqueta="Año *"
            placeholder={MAX_ANIO.toString()}
            value={formulario.anio}
            onChangeText={(valor) => actualizarCampo('anio', valor)}
            error={errores.anio}
            keyboardType="number-pad"
            maxLength={4}
          />

          <Input
            etiqueta="Color"
            placeholder="Ej: Azul"
            value={formulario.color}
            onChangeText={(valor) => actualizarCampo('color', valor)}
          />

          <Text style={estilos.etiqueta}>Estado *</Text>
          <View style={estilos.estadosContainer}>
            {ESTADO_VEHICULO.map((estado) => (
              <TouchableOpacity
                key={estado}
                style={[
                  estilos.estadoChip,
                  formulario.estado === estado && estilos.estadoChipActivo,
                ]}
                onPress={() => actualizarCampo('estado', estado)}
              >
                <Text
                  style={[
                    estilos.estadoTexto,
                    formulario.estado === estado && estilos.estadoTextoActivo,
                  ]}
                >
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            etiqueta="Precio de Compra (€) *"
            placeholder="0.00"
            value={formulario.precio_compra}
            onChangeText={(valor) => actualizarCampo('precio_compra', valor)}
            error={errores.precio_compra}
            keyboardType="decimal-pad"
          />

          <Input
            etiqueta="Kilometraje *"
            placeholder="0"
            value={formulario.kilometraje}
            onChangeText={(valor) => actualizarCampo('kilometraje', valor)}
            error={errores.kilometraje}
            keyboardType="number-pad"
          />

          <Input
            etiqueta="Observaciones"
            placeholder="Notas adicionales..."
            value={formulario.observaciones}
            onChangeText={(valor) => actualizarCampo('observaciones', valor)}
            multiline
            numberOfLines={4}
          />

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
  selectContainer: {
    marginBottom: espaciado.md,
  },
  selectChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: espaciado.sm,
  },
  selectChipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  selectTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
  },
  selectTextoActivo: {
    color: colores.superficie,
    fontWeight: tipografia.pesoFuente.semibold as any,
  },
  estadosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
    marginBottom: espaciado.md,
  },
  estadoChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  estadoChipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  estadoTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.texto,
  },
  estadoTextoActivo: {
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
});
