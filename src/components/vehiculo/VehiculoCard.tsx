/**
 * Componente VehiculoCard
 * Tarjeta para mostrar información resumida de un vehículo en listas
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Vehiculo } from '../../models/Vehiculo';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  onPress: () => void;
}

export const VehiculoCard: React.FC<VehiculoCardProps> = ({ vehiculo, onPress }) => {
  // Obtener color según estado
  const obtenerColorEstado = (): string => {
    switch (vehiculo.estado) {
      case 'completo':
        return colores.completo;
      case 'desguazando':
        return colores.desguazando;
      case 'desguazado':
        return colores.desguazado;
      default:
        return colores.primario;
    }
  };

  // Formatear kilometraje
  const formatearKilometraje = (km: number): string => {
    return km.toLocaleString('es-ES') + ' km';
  };

  // Formatear precio
  const formatearPrecio = (precio: number): string => {
    return '€' + precio.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <TouchableOpacity style={estilos.card} onPress={onPress} activeOpacity={0.7}>
      <View style={estilos.contenido}>
        {/* Icono del vehículo */}
        <View style={estilos.iconoContainer}>
          <Text style={estilos.icono}>🚗</Text>
        </View>

        {/* Información principal */}
        <View style={estilos.info}>
          {/* Matrícula y estado */}
          <View style={estilos.header}>
            <Text style={estilos.matricula}>{vehiculo.matricula}</Text>
            <View
              style={[
                estilos.chipEstado,
                { backgroundColor: obtenerColorEstado() },
              ]}
            >
              <Text style={estilos.estadoTexto}>
                {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
              </Text>
            </View>
          </View>

          {/* Marca y modelo */}
          <Text style={estilos.marcaModelo} numberOfLines={1}>
            {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
          </Text>

          {/* Detalles */}
          <View style={estilos.detalles}>
            <View style={estilos.detalle}>
              <Text style={estilos.detalleLabel}>Kilometraje:</Text>
              <Text style={estilos.detalleValor}>{formatearKilometraje(vehiculo.kilometraje)}</Text>
            </View>
            <View style={estilos.detalle}>
              <Text style={estilos.detalleLabel}>Precio compra:</Text>
              <Text style={estilos.detalleValor}>{formatearPrecio(vehiculo.precio_compra)}</Text>
            </View>
          </View>

          {/* Fecha de entrada */}
          <Text style={estilos.fecha}>
            Entrada: {new Date(vehiculo.fecha_entrada).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: colores.superficie,
    borderRadius: borderRadius.md,
    marginVertical: espaciado.sm,
    marginHorizontal: espaciado.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contenido: {
    flexDirection: 'row',
    padding: espaciado.md,
  },
  iconoContainer: {
    width: 60,
    height: 60,
    marginRight: espaciado.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: borderRadius.md,
  },
  icono: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.xs,
  },
  matricula: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.primario,
  },
  chipEstado: {
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.redondo,
  },
  estadoTexto: {
    fontSize: tipografia.tamanoFuente.xs,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.superficie,
  },
  marcaModelo: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  detalles: {
    marginBottom: espaciado.xs,
  },
  detalle: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  detalleLabel: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
    marginRight: espaciado.xs,
  },
  detalleValor: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
  },
  fecha: {
    fontSize: tipografia.tamanoFuente.xs,
    color: colores.textoSecundario,
  },
});
