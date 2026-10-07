import {
  centimasToNota,
  existeMateriaDuplicada,
  getMateriaNameKey,
  normalizeMateriaName,
  notaPrimerBimestreToCentimas,
  validateMateriaForm,
} from './domain';

describe('materias domain', () => {
  it('requiere nombre y nota para guardar una materia', () => {
    expect(validateMateriaForm({ nombre: '', notaPrimerBimestre: '' })).toEqual({
      nombre: 'Ingresa el nombre de la materia.',
      notaPrimerBimestre: 'Ingresa la nota del primer bimestre.',
    });
  });

  it('acepta el punto decimal y rechaza la coma', () => {
    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '8,5' })).toEqual({
      notaPrimerBimestre: 'Usa el punto decimal y un valor entre 0.00 y 20.00.',
    });
  });

  it('valida hasta dos decimales y el rango inclusivo', () => {
    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '8.555' })).toEqual({
      notaPrimerBimestre: 'Usa un valor con máximo dos decimales.',
    });

    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '20.00' })).toEqual({});
    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '0.00' })).toEqual({});
    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '20.01' })).toEqual({
      notaPrimerBimestre: 'La nota debe estar entre 0.00 y 20.00.',
    });
    expect(validateMateriaForm({ nombre: 'Algebra', notaPrimerBimestre: '-0.01' })).toEqual({
      notaPrimerBimestre: 'La nota debe estar entre 0.00 y 20.00.',
    });
  });

  it('normaliza los espacios del nombre y compara sin distinguir mayúsculas', () => {
    expect(normalizeMateriaName('  Algebra  ')).toBe('Algebra');
    expect(getMateriaNameKey('  Álgebra  ')).toBe('algebra');
    expect(getMateriaNameKey('algebra')).toBe('algebra');
  });

  it('convierte a centésimas y formatea la nota para mostrar', () => {
    expect(notaPrimerBimestreToCentimas('15.25')).toBe(1525);
    expect(centimasToNota(1525)).toBe('15.25');
  });

  it('detecta duplicados ignorando mayúsculas y espacios externos', () => {
    expect(
      existeMateriaDuplicada(
        [{ id: '1', nombre: 'Álgebra', notaPrimerBimestre: 1500, notaSegundoBimestre: null }],
        '  algebra  ',
      ),
    ).toBe(true);
  });
});
