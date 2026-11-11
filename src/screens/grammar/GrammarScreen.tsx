import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { ExerciseCard } from '../../components/learning/ExerciseCard';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { grammarLessons } from '../../data/grammar';
import { GrammarLesson, CEFRLevel } from '../../types';

interface GrammarScreenProps {
  onBack?: () => void;
}

export const GrammarScreen: React.FC<GrammarScreenProps> = ({ onBack }) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const filteredLessons = grammarLessons.filter(l =>
    selectedLevelFilter === 'ALL' ? true : l.cefrLevel === selectedLevelFilter
  );
  const currentLesson: GrammarLesson = filteredLessons[selectedLessonIndex] || filteredLessons[0] || grammarLessons[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <EditorialText variant="bodySmall" color={colors.text.secondary}>
              ← Volver
            </EditorialText>
          </Pressable>
        )}
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Gramática Progresiva
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Estructuras claras de A1 a B2 sin enredos lingüísticos
        </EditorialText>
      </View>

      {/* CEFR Level Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.lessonSelector, { paddingBottom: 2 }]}
      >
        {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map(lvl => {
          const isSelected = selectedLevelFilter === lvl;
          return (
            <Pressable
              key={lvl}
              onPress={() => {
                setSelectedLevelFilter(lvl);
                setSelectedLessonIndex(0);
              }}
              style={[
                styles.lessonPill,
                {
                  backgroundColor: isSelected ? colors.burntOrange : '#FFF9F0',
                  borderColor: isSelected ? colors.burntOrange : colors.border.subtle,
                },
              ]}
            >
              <EditorialText
                variant="caption"
                color={isSelected ? colors.text.inverse : colors.text.secondary}
                style={{ fontWeight: isSelected ? '700' : '500' }}
              >
                {lvl === 'ALL' ? 'Todos' : `Nivel ${lvl}`}
              </EditorialText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lesson Selector Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lessonSelector}
      >
        {filteredLessons.map((lesson, idx) => {
          const isSelected = idx === selectedLessonIndex;
          return (
            <Pressable
              key={lesson.id}
              onPress={() => setSelectedLessonIndex(idx)}
              style={[
                styles.lessonPill,
                isSelected ? styles.lessonPillActive : styles.lessonPillInactive,
              ]}
            >
              <EditorialText
                variant="caption"
                color={isSelected ? colors.text.inverse : colors.text.primary}
                style={{ fontWeight: isSelected ? '700' : '500' }}
              >
                {lesson.cefrLevel} • {lesson.title.split(':')[0]}
              </EditorialText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson Hero Header */}
        <EducationalCard variant="cream" style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Badge label={`Nivel ${currentLesson.cefrLevel}`} variant="forest" />
            <EditorialText variant="caption" color={colors.text.secondary}>
              Lección {currentLesson.order} de {grammarLessons.length}
            </EditorialText>
          </View>

          <EditorialText variant="displayMedium" color={colors.text.primary} style={styles.lessonTitle}>
            {currentLesson.title}
          </EditorialText>

          <EditorialText variant="bodyRegular" color={colors.text.secondary} style={styles.lessonSubtitle}>
            {currentLesson.subtitle}
          </EditorialText>

          <View style={styles.summaryBox}>
            <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700', marginBottom: 4 }}>
              💡 EN RESUMEN:
            </EditorialText>
            <EditorialText variant="bodySmall" color={colors.text.primary}>
              {currentLesson.summary}
            </EditorialText>
          </View>
        </EducationalCard>

        {/* Comparison Cards if present (e.g. Ser vs Estar / DOCTOGRAM vs PLACE) */}
        {currentLesson.comparisonCards && currentLesson.comparisonCards.map((cmp, i) => (
          <EducationalCard key={`cmp-${i}`} variant="ivory" style={styles.cmpCard}>
            <EditorialText variant="subheadline" color={colors.forestGreen} style={styles.cmpTitle}>
              ⚖️ {cmp.title}
            </EditorialText>

            <View style={styles.cmpGrid}>
              <View style={[styles.cmpColumn, styles.cmpColumnLeft]}>
                <EditorialText variant="caption" color={colors.forestGreen} style={styles.cmpColHeader}>
                  {cmp.leftConcept.label}
                </EditorialText>
                {cmp.leftConcept.rules.map((r, rIdx) => (
                  <EditorialText key={`l-${rIdx}`} variant="caption" color={colors.text.primary}>
                    • {r}
                  </EditorialText>
                ))}
              </View>

              <View style={[styles.cmpColumn, styles.cmpColumnRight]}>
                <EditorialText variant="caption" color={colors.burntOrange} style={styles.cmpColHeader}>
                  {cmp.rightConcept.label}
                </EditorialText>
                {cmp.rightConcept.rules.map((r, rIdx) => (
                  <EditorialText key={`r-${rIdx}`} variant="caption" color={colors.text.primary}>
                    • {r}
                  </EditorialText>
                ))}
              </View>
            </View>
          </EducationalCard>
        ))}

        {/* Rule Cards */}
        <View style={styles.sectionHeader}>
          <EditorialText variant="headline" color={colors.text.primary}>
            Reglas de uso explicadas
          </EditorialText>
        </View>

        {currentLesson.ruleCards.map(rule => (
          <EducationalCard key={rule.id} variant="cream" style={styles.ruleCard}>
            <EditorialText variant="subheadline" color={colors.forestGreen} style={styles.ruleTitle}>
              📌 {rule.title}
            </EditorialText>
            <EditorialText variant="bodyRegular" color={colors.text.primary} style={styles.ruleExplanation}>
              {rule.explanation}
            </EditorialText>

            <View style={styles.examplesList}>
              {rule.examples.map((ex, exIdx) => (
                <View key={`ex-${exIdx}`} style={styles.exampleRow}>
                  <EditorialText variant="readingQuote" color={colors.text.primary}>
                    "{ex.spanish}"
                  </EditorialText>
                  <EditorialText variant="bodySmall" color={colors.text.secondary}>
                    "{ex.english}"
                  </EditorialText>
                </View>
              ))}
            </View>
          </EducationalCard>
        ))}

        {/* Common Mistakes Callout */}
        {currentLesson.commonMistakes.length > 0 && (
          <View style={styles.mistakesSection}>
            <EditorialText variant="headline" color={colors.text.primary} style={{ marginBottom: 10 }}>
              ⚠️ Errores comunes a evitar
            </EditorialText>
            {currentLesson.commonMistakes.map((m, mIdx) => (
              <EducationalCard key={`m-${mIdx}`} variant="peach" style={styles.mistakeCard}>
                <View style={styles.mistakeRow}>
                  <EditorialText variant="bodySmall" color="#B91C1C" style={{ fontWeight: '700' }}>
                    ✕ No digas:
                  </EditorialText>
                  <EditorialText variant="bodySmall" color={colors.text.primary} style={{ fontStyle: 'italic' }}>
                    "{m.incorrect}"
                  </EditorialText>
                </View>

                <View style={styles.mistakeRow}>
                  <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '700' }}>
                    ✓ Di mejor:
                  </EditorialText>
                  <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '700' }}>
                    "{m.correct}"
                  </EditorialText>
                </View>

                <EditorialText variant="caption" color={colors.text.secondary} style={{ marginTop: 4 }}>
                  {m.explanation}
                </EditorialText>
              </EducationalCard>
            ))}
          </View>
        )}

        {/* Practice Exercises embedded right in lesson */}
        <View style={styles.practiceSection}>
          <EditorialText variant="headline" color={colors.text.primary} style={{ marginBottom: 12 }}>
            Practica lo aprendido
          </EditorialText>
          {currentLesson.practiceQuestions.map(q => (
            <ExerciseCard
              key={q.id}
              exercise={q}
              onComplete={isCorrect => {
                // handle answer
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    marginBottom: 6,
  },
  lessonSelector: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 10,
  },
  lessonPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
  },
  lessonPillActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  lessonPillInactive: {
    backgroundColor: '#FFF9F0',
    borderColor: colors.border.subtle,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  heroCard: {
    padding: 20,
    gap: 8,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonTitle: {
    lineHeight: 32,
  },
  lessonSubtitle: {
    lineHeight: 20,
  },
  summaryBox: {
    backgroundColor: '#FFF4EE',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.burntOrange,
  },
  cmpCard: {
    padding: 16,
    gap: 12,
  },
  cmpTitle: {
    fontWeight: '700',
  },
  cmpGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  cmpColumn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  cmpColumnLeft: {
    backgroundColor: '#E8F0EC',
  },
  cmpColumnRight: {
    backgroundColor: '#FDEEE8',
  },
  cmpColHeader: {
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionHeader: {
    marginTop: 8,
  },
  ruleCard: {
    padding: 18,
    gap: 10,
  },
  ruleTitle: {
    fontWeight: '700',
  },
  ruleExplanation: {
    lineHeight: 22,
  },
  examplesList: {
    gap: 8,
    marginTop: 4,
  },
  exampleRow: {
    backgroundColor: 'rgba(23, 23, 21, 0.03)',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.forestGreen,
    gap: 2,
  },
  mistakesSection: {
    gap: 10,
  },
  mistakeCard: {
    padding: 14,
    gap: 6,
  },
  mistakeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  practiceSection: {
    gap: 12,
    marginTop: 10,
  },
});

