import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { espaciado, borderRadius, elevacion } from './espaciado';
import { tipografia } from './tipografia';

export const estilosGlobales = StyleSheet.create({
  // Contenedores
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenedorCentrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
  contenedorPadding: {
    flex: 1,
    padding: espaciado.md,
    backgroundColor: colores.fondo,
  },

  // Cards
  card: {
    backgroundColor: colores.superficie,
    borderRadius: borderRadius.md,
    padding: espaciado.md,
    marginVertical: espaciado.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: elevacion.sm,
  },

  // Textos
  titulo: {
    fontSize: tipografia.tamanoFuente.xxl,
    fontWeight: tipografia.pesoFuente.negrita,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  subtitulo: {
    fontSize: tipografia.tamanoFuente.lg,
    fontWeight: tipografia.pesoFuente.semibold,
    color: colores.texto,
    marginBottom: espaciado.sm,
  },
  textoNormal: {
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.regular,
    color: colores.texto,
  },
  textoSecundario: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.regular,
    color: colores.textoSecundario,
  },

  // Inputs
  input: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: borderRadius.sm,
    padding: espaciado.md,
    fontSize: tipografia.tamanoFuente.md,
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  inputError: {
    borderColor: colores.bordeError,
  },
  inputExito: {
    borderColor: colores.bordeExito,
  },

  // Botones
  boton: {
    backgroundColor: colores.primario,
    borderRadius: borderRadius.sm,
    padding: espaciado.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: colores.superficie,
    fontSize: tipografia.tamanoFuente.md,
    fontWeight: tipografia.pesoFuente.semibold,
  },
  botonSecundario: {
    backgroundColor: colores.secundario,
  },
  botonDeshabilitado: {
    backgroundColor: colores.textoDeshabilitado,
  },

  // Separadores
  divisor: {
    height: 1,
    backgroundColor: colores.divisor,
    marginVertical: espaciado.md,
  },

  // Chips/Tags
  chip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: borderRadius.redondo,
    alignSelf: 'flex-start',
  },
  chipTexto: {
    fontSize: tipografia.tamanoFuente.sm,
    fontWeight: tipografia.pesoFuente.medio,
  },

  // Estados
  estadoCompleto: {
    backgroundColor: colores.completo,
  },
  estadoDesguazando: {
    backgroundColor: colores.desguazando,
  },
  estadoDesguazado: {
    backgroundColor: colores.desguazado,
  },

  // Mensajes
  mensajeError: {
    color: colores.error,
    fontSize: tipografia.tamanoFuente.sm,
    marginTop: espaciado.xs,
  },
  mensajeExito: {
    color: colores.exito,
    fontSize: tipografia.tamanoFuente.sm,
    marginTop: espaciado.xs,
  },
  mensajeAdvertencia: {
    color: colores.advertencia,
    fontSize: tipografia.tamanoFuente.sm,
    marginTop: espaciado.xs,
  },

  // Listas
  itemLista: {
    backgroundColor: colores.superficie,
    padding: espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.divisor,
  },

  // Sombras
  sombraLigera: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: elevacion.sm,
  },
  sombraMedia: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: elevacion.md,
  },
  sombraFuerte: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: elevacion.lg,
  },
});
