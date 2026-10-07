import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  centimasToNota,
  crearMateria,
  existeMateriaDuplicada,
  normalizeMateriaName,
  validateMateriaForm,
} from '@/features/materias/domain';
import { readMaterias, saveMaterias } from '@/features/materias/storage';
import type { Materia, MateriaFormErrors, MateriaFormValues } from '@/features/materias/types';

const EMPTY_FORM: MateriaFormValues = {
  nombre: '',
  notaPrimerBimestre: '',
};

export default function MateriasScreen() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<MateriaFormValues>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<MateriaFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMaterias = async () => {
    try {
      const stored = await readMaterias();
      setMaterias(stored);
    } catch {
      setSaveError('No se pudieron cargar las materias guardadas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadMaterias();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  function updateField(field: keyof MateriaFormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => {
      if (!(field in current)) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (saveError) {
      setSaveError(null);
    }
  }

  async function handleSubmit() {
    const errors = validateMateriaForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const nombreNormalizado = normalizeMateriaName(formValues.nombre);
    if (existeMateriaDuplicada(materias, nombreNormalizado)) {
      setSaveError('La materia ya está registrada.');
      return;
    }

    const nuevaMateria = crearMateria(
      `materia-${Date.now()}`,
      nombreNormalizado,
      formValues.notaPrimerBimestre,
    );

    try {
      const siguienteListado = [...materias, nuevaMateria];
      await saveMaterias(siguienteListado);
      setMaterias(siguienteListado);
      setFormValues(EMPTY_FORM);
      setFormErrors({});
      setSaveError(null);
      setShowForm(false);
    } catch {
      setSaveError('No se pudo guardar la materia. Inténtalo de nuevo.');
    }
  }

  function renderMateria({ item }: { item: Materia }) {
    const estado = item.notaSegundoBimestre === null ? 'Pendiente' : `2do: ${centimasToNota(item.notaSegundoBimestre)}`;

    return (
      <View style={styles.materiaCard}>
        <View style={styles.materiaInfo}>
          <Text style={styles.materiaNombre}>{item.nombre}</Text>
          <Text style={styles.materiaNota}>1er bimestre: {centimasToNota(item.notaPrimerBimestre)}</Text>
        </View>

        <Text style={styles.materiaEstado}>{estado}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Materias</Text>
        {!showForm && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Registrar una materia"
            style={styles.primaryButton}
            onPress={() => setShowForm(true)}>
            <Text style={styles.primaryButtonText}>Registrar materia</Text>
          </Pressable>
        )}
      </View>

      {showForm ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.formWrapper}>
          <ScrollView
            contentContainerStyle={styles.formScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Nueva materia</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                value={formValues.nombre}
                onChangeText={(value) => updateField('nombre', value)}
                placeholder="Ej. Álgebra"
                autoCapitalize="words"
                style={[styles.input, formErrors.nombre ? styles.inputError : null]}
                accessibilityLabel="Nombre de la materia"
              />
              {formErrors.nombre ? <Text style={styles.errorText}>{formErrors.nombre}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nota del primer bimestre</Text>
              <TextInput
                value={formValues.notaPrimerBimestre}
                onChangeText={(value) => updateField('notaPrimerBimestre', value)}
                placeholder="8.75"
                keyboardType="decimal-pad"
                style={[styles.input, formErrors.notaPrimerBimestre ? styles.inputError : null]}
                accessibilityLabel="Nota del primer bimestre"
              />
              {formErrors.notaPrimerBimestre ? (
                <Text style={styles.errorText}>{formErrors.notaPrimerBimestre}</Text>
              ) : null}
            </View>

            {saveError ? <Text style={styles.generalError}>{saveError}</Text> : null}

            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancelar registro de materia"
                style={[styles.secondaryButton, styles.buttonMinHeight]}
                onPress={() => {
                  setShowForm(false);
                  setFormValues(EMPTY_FORM);
                  setFormErrors({});
                  setSaveError(null);
                }}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Guardar materia"
                style={[styles.primaryButton, styles.buttonMinHeight]}
                onPress={() => {
                  void handleSubmit();
                }}>
                <Text style={styles.primaryButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>
          {isLoading ? (
            <Text style={styles.emptyText}>Cargando materias...</Text>
          ) : materias.length === 0 ? (
            <Text style={styles.emptyText}>Todavía no hay materias guardadas.</Text>
          ) : (
            <FlatList
              data={materias}
              keyExtractor={(item) => item.id}
              renderItem={renderMateria}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d2433',
  },
  primaryButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  formWrapper: {
    flex: 1,
  },
  formScroll: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d2433',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 6,
  },
  generalError: {
    color: '#b91c1c',
    fontSize: 14,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonMinHeight: {
    minHeight: 44,
  },
  listContent: {
    paddingBottom: 24,
  },
  materiaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  materiaInfo: {
    flex: 1,
    marginRight: 12,
  },
  materiaNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  materiaNota: {
    fontSize: 13,
    color: '#475569',
  },
  materiaEstado: {
    fontSize: 13,
    color: '#0f766e',
    fontWeight: '600',
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
