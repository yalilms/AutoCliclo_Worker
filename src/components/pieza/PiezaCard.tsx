/**
 * Componente PiezaCard
 * Tarjeta para mostrar información resumida de una pieza en listas
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Pieza } from '../../models/Pieza';
import { colores } from '../../theme/colores';
import { espaciado, borderRadius } from '../../theme/espaciado';
import { tipografia } from '../../theme/tipografia';

interface PiezaCardProps {
  pieza: Pieza;
  onPress: () => void;
}

export const PiezaCard: React.FC<PiezaCardProps> = ({ pieza, onPress }) => {
  // Obtener color según categoría
  const obtenerColorCategoria = (): string => {
    switch (pieza.categoria) {
      case 'motor':
        return colores.motor;
      case 'carroceria':
        return colores.carroceria;
      case 'interior':
        return colores.interior;
      case 'electronica':
        return colores.electronica;
      case 'ruedas':
        return colores.ruedas;
      case 'otros':
        return colores.otros;
      default:
        return colores.primario;
    }
  };

  // Obtener estado de stock
  const obtenerEstadoStock = (): { color: string; texto: string } => {
    if (pieza.stock_disponible === 0) {
      return { color: colores.stockAgotado, texto: 'Sin stock' };
    } else if (pieza.stock_disponible < pieza.stock_minimo) {
      return { color: colores.stockBajo, texto: 'Stock bajo' };
    } else {
      return { color: colores.stockNormal, texto: 'Stock normal' };
    }
  };

  const estadoStock = obtenerEstadoStock();

  return (
    <TouchableOpacity style={estilos.card} onPress={onPress} activeOpacity={0.7}>
      <View style={estilos.contenido}>
        {/* Imagen o placeholder */}
        <View style={estilos.imagenContainer}>
          {pieza.imagen ? (
            <Image
              source={{ uri: pieza.imagen }}
              style={estilos.imagen}
              resizeMode="cover"
            />
          ) : (
            <View style={estilos.placeholderImagen}>
              <Text style={estilos.placeholderTexto}>📦</Text>
            </View>
          )}
        </View>

        {/* Información principal */}
        <View style={estilos.info}>
          {/* Código y nombre */}
          <View style={estilos.header}>
            <Text style={estilos.codigo}>{pieza.codigo_pieza}</Text>
            {/* Chip de categoría */}
            <View
              style={[
                estilos.chipCategoria,
                { backgroundColor: obtenerColorCategoria() },
              ]}
            >
              <Text style={estilos.categoriaTexto}>
                {pieza.categoria.charAt(0).toUpperCase() + pieza.categoria.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={estilos.nombre} numberOfLines={2}>
            {pieza.nombre}
          </Text>

          {/* Precio y stock */}
          <View style={estilos.footer}>
            <Text style={estilos.precio}>€{pieza.precio_venta.toFixed(2)}</Text>
            <View style={estilos.stockContainer}>
              <View style={[estilos.indicadorStock, { backgroundColor: estadoStock.color }]} />
              <Text style={estilos.stockTexto}>
                Stock: {pieza.stock_disponible}/{pieza.stock_minimo}
              </Text>
            </View>
          </View>

          {/* Estado de stock */}
          <Text style={[estilos.estadoStock, { color: estadoStock.color }]}>
            {estadoStock.texto}
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
  imagenContainer: {
    width: 80,
    height: 80,
    marginRight: espaciado.md,
  },
  imagen: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  placeholderImagen: {
    width: '100%',
    height: '100%',
    backgroundColor: colores.fondo,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTexto: {
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
  codigo: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.primario,
  },
  chipCategoria: {
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.redondo,
  },
  categoriaTexto: {
    fontSize: tipografia.tamanoFuente.xs,
    fontWeight: tipografia.pesoFuente.semibold as any,
    color: colores.superficie,
  },
  nombre: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.medio as any,
    color: colores.texto,
    marginBottom: espaciado.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.xs,
  },
  precio: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.negrita as any,
    color: colores.exito,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicadorStock: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: espaciado.xs,
  },
  stockTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    color: colores.textoSecundario,
  },
  estadoStock: {
    fontSize: tipografia.tamanoFuente.xs,
    fontWeight: tipografia.pesoFuente.medio as any,
  },
});
