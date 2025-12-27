/**
 * Sistema de tipografía
 * Tamaños y pesos de fuente consistentes
 */

export const tipografia = {
  // Tamaños de fuente
  tamanoFuente: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Pesos de fuente
  pesoFuente: {
    regular: '400' as const,
    medio: '500' as const,
    semibold: '600' as const,
    negrita: '700' as const,
  },

  // Alturas de línea
  alturaLinea: {
    ajustada: 1.2,
    normal: 1.5,
    relajada: 1.8,
  },
};
