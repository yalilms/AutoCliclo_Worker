/**
 * Hook usarDebounce
 * Retrasa la actualización de un valor para evitar llamadas excesivas
 * Útil para búsquedas en tiempo real
 */

import { useEffect, useState } from 'react';

export const usarDebounce = <T,>(valor: T, retraso: number = 500): T => {
  const [valorRetrasado, setValorRetrasado] = useState<T>(valor);

  useEffect(() => {
    // Establecer timeout para actualizar el valor
    const manejador = setTimeout(() => {
      setValorRetrasado(valor);
    }, retraso);

    // Limpiar timeout si el valor cambia antes de que expire
    return () => {
      clearTimeout(manejador);
    };
  }, [valor, retraso]);

  return valorRetrasado;
};
