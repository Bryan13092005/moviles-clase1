export type Materia = {
  id: string;
  nombre: string;
  notaPrimerBimestre: number;
  notaSegundoBimestre: number | null;
};

export type MateriaFormValues = {
  nombre: string;
  notaPrimerBimestre: string;
};

export type MateriaFormErrors = Partial<Record<'nombre' | 'notaPrimerBimestre', string>>;
