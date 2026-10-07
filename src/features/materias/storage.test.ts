import AsyncStorage from '@react-native-async-storage/async-storage';

import { readMaterias, saveMaterias } from './storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('materias storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lee y escribe la colección serializada con segundo bimestre pendiente', async () => {
    const materias = [
      { id: 'm-1', nombre: 'Algebra', notaPrimerBimestre: 1525, notaSegundoBimestre: null },
    ];

    await saveMaterias(materias);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'materias',
      JSON.stringify(materias),
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(materias));
    await expect(readMaterias()).resolves.toEqual(materias);
  });

  it('propaga el error si la escritura falla', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('storage failed'));

    await expect(saveMaterias([{ id: 'm-1', nombre: 'Algebra', notaPrimerBimestre: 1525, notaSegundoBimestre: null }])).rejects.toThrow('storage failed');
  });
});
