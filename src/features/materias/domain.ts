import type { Materia, MateriaFormErrors, MateriaFormValues } from './types';

export function normalizeMateriaName(nombre: string): string {
  return String(nombre ?? '').trim();
}

export function getMateriaNameKey(nombre: string): string {
  return normalizeMateriaName(nombre)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function existeMateriaDuplicada(materias: Materia[], nombre: string): boolean {
  const claveBuscada = getMateriaNameKey(nombre);

  return materias.some((materia) => getMateriaNameKey(materia.nombre) === claveBuscada);
}

export function validateMateriaForm(
  values: MateriaFormValues,
): MateriaFormErrors {
  const errors: MateriaFormErrors = {};
  const nombre = normalizeMateriaName(values.nombre ?? '');
  const nota = (values.notaPrimerBimestre ?? '').trim();

  if (!nombre) {
    errors.nombre = 'Ingresa el nombre de la materia.';
  }

  if (!nota) {
    errors.notaPrimerBimestre = 'Ingresa la nota del primer bimestre.';
    return errors;
  }

  if (nota.includes(',')) {
    errors.notaPrimerBimestre = 'Usa el punto decimal y un valor entre 0.00 y 20.00.';
    return errors;
  }

  const numeroNota = Number(nota);
  const tieneSignoNegativo = nota.startsWith('-');
  const notaSinSigno = tieneSignoNegativo ? nota.slice(1) : nota;

  if (!/^\d+(\.\d+)?$/.test(notaSinSigno)) {
    errors.notaPrimerBimestre = 'Usa el punto decimal y un valor entre 0.00 y 20.00.';
    return errors;
  }

  if (nota.includes('.') && nota.split('.')[1]?.length > 2) {
    errors.notaPrimerBimestre = 'Usa un valor con máximo dos decimales.';
    return errors;
  }

  if (numeroNota > 20 || numeroNota < 0) {
    errors.notaPrimerBimestre = 'La nota debe estar entre 0.00 y 20.00.';
    return errors;
  }

  return errors;
}

export function notaPrimerBimestreToCentimas(nota: string): number {
  const numeroNota = Number(nota);
  return Math.round(numeroNota * 100);
}

export function centimasToNota(notaCentimas: number): string {
  return (notaCentimas / 100).toFixed(2);
}

export function crearMateria(
  id: string,
  nombre: string,
  notaPrimerBimestre: string,
): Materia {
  const nombreNormalizado = normalizeMateriaName(nombre);

  return {
    id,
    nombre: nombreNormalizado,
    notaPrimerBimestre: notaPrimerBimestreToCentimas(notaPrimerBimestre),
    notaSegundoBimestre: null,
  };
}
