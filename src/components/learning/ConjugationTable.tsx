import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { VerbItem, ConjugationForms } from '../../types';

interface ConjugationTableProps {
  verb: VerbItem;
  selectedTense: keyof VerbItem['tenses'];
  onSelectTense: (tense: keyof VerbItem['tenses']) => void;
  onPronounceForm?: (form: string) => void;
}

const tenseDisplayNames: Record<keyof VerbItem['tenses'], string> = {
  presente: 'Presente',
  preteritoPerfecto: 'Pretérito Indefinido',
  imperfecto: 'Imperfecto',
  futuro: 'Futuro',
  condicional: 'Condicional',
  subjuntivo: 'Subjuntivo',
};

const pronounsOrder: Array<{ key: keyof ConjugationForms; label: string }> = [
  { key: 'yo', label: 'yo' },
  { key: 'tu', label: 'tú' },
  { key: 'elEllaUsted', label: 'él / ella / usted' },
  { key: 'nosotros', label: 'nosotros / nosotras' },
  { key: 'vosotros', label: 'vosotros / vosotras' },
  { key: 'ellosEllasUstedes', label: 'ellos / ellas / ustedes' },
];

export const ConjugationTable: React.FC<ConjugationTableProps> = ({
  verb,
  selectedTense,
  onSelectTense,
  onPronounceForm,
}) => {
  const currentForms = verb.tenses[selectedTense];

  return (
    <View style={styles.container}>
      {/* Verb Header Card */}
      <EducationalCard variant="cream" style={styles.headerCard}>
        <View style={styles.titleRow}>
          <View>
            <EditorialText variant="displayMedium" color={colors.text.primary}>
              {verb.infinitive}
            </EditorialText>
            <EditorialText variant="bodySmall" color={colors.text.secondary}>
              {verb.translation}
            </EditorialText>
          </View>
          <View style={styles.badgeRow}>
            <Badge
              label={verb.group}
              variant="forest"
            />
            <Badge
              label={verb.isRegular ? 'Regular' : 'Irregular'}
              variant={verb.isRegular ? 'sage' : 'orange'}
            />
          </View>
        </View>
      </EducationalCard>

      {/* Tense Selector Chips */}
      <View style={styles.tenseSelectorScroll}>
        {(Object.keys(tenseDisplayNames) as Array<keyof VerbItem['tenses']>).map(tenseKey => {
          const isActive = selectedTense === tenseKey;
          return (
            <Pressable
              key={tenseKey}
              onPress={() => onSelectTense(tenseKey)}
              style={[
                styles.tenseChip,
                isActive ? styles.tenseChipActive : styles.tenseChipInactive,
              ]}
            >
              <EditorialText
                variant="caption"
                color={isActive ? colors.text.inverse : colors.text.secondary}
                style={{ fontWeight: isActive ? '700' : '500' }}
              >
                {tenseDisplayNames[tenseKey]}
              </EditorialText>
            </Pressable>
          );
        })}
      </View>

      {/* Conjugation Grid Card */}
      <EducationalCard variant="ivory" style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <EditorialText variant="caption" color={colors.text.secondary} style={styles.colPronoun}>
            PRONOMBRE
          </EditorialText>
          <EditorialText variant="caption" color={colors.text.secondary} style={styles.colForm}>
            CONJUGACIÓN
          </EditorialText>
        </View>

        {pronounsOrder.map((p, idx) => {
          const conjugatedWord = currentForms[p.key];
          const isEven = idx % 2 === 0;

          return (
            <Pressable
              key={p.key}
              onPress={() => onPronounceForm?.(conjugatedWord)}
              style={[
                styles.tableRow,
                isEven && styles.tableRowEven,
              ]}
            >
              <EditorialText
                variant="bodySmall"
                color={colors.text.secondary}
                style={styles.colPronoun}
              >
                {p.label}
              </EditorialText>
              <View style={styles.formContainer}>
                <EditorialText
                  variant="subheadline"
                  color={colors.forestGreen}
                  style={styles.colFormText}
                >
                  {conjugatedWord}
                </EditorialText>
                {onPronounceForm && <EditorialText style={styles.soundIcon}>🔊</EditorialText>}
              </View>
            </Pressable>
          );
        })}
      </EducationalCard>

      {/* Example Sentences */}
      <View style={styles.examplesSection}>
        <EditorialText variant="subheadline" color={colors.text.primary} style={styles.examplesTitle}>
          Ejemplos en oraciones
        </EditorialText>
        {verb.examples.map((ex, i) => (
          <View key={`ex-${i}`} style={styles.exampleBubble}>
            <EditorialText variant="readingQuote" color={colors.text.primary}>
              "{ex.spanish}"
            </EditorialText>
            <EditorialText variant="bodySmall" color={colors.text.secondary}>
              "{ex.english}"
            </EditorialText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerCard: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tenseSelectorScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tenseChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
  },
  tenseChipActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  tenseChipInactive: {
    backgroundColor: '#FFF9F0',
    borderColor: colors.border.subtle,
  },
  tableCard: {
    padding: 16,
    borderRadius: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    paddingBottom: 8,
    marginBottom: 4,
  },
  colPronoun: {
    flex: 1.2,
    fontWeight: '600',
  },
  colForm: {
    flex: 1.4,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  tableRowEven: {
    backgroundColor: 'rgba(255, 249, 240, 0.6)',
  },
  formContainer: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colFormText: {
    fontWeight: '700',
  },
  soundIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  examplesSection: {
    gap: 10,
  },
  examplesTitle: {
    fontWeight: '700',
  },
  exampleBubble: {
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.burntOrange,
    gap: 4,
  },
});

