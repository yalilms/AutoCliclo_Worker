import { colores } from './colores';
import { espaciado, borderRadius, elevacion } from './espaciado';
import { tipografia } from './tipografia';

export const tema = {
  colores,
  espaciado,
  borderRadius,
  elevacion,
  tipografia,
};

export type Tema = typeof tema;
