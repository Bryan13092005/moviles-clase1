import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Materia } from './types';

const STORAGE_KEY = 'materias';

export async function readMaterias(): Promise<Materia[]> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);

  if (!value) {
    return [];
  }

  const parsed = JSON.parse(value) as Materia[];
  return Array.isArray(parsed) ? parsed : [];
}

export async function saveMaterias(materias: Materia[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}
