import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { Badge } from '../common/Badge';
import { PillButton } from '../common/PillButton';
import { colors } from '../../theme/colors';

export interface MatchPair {
  id: string;
  spanish: string;
  english: string;
}

interface WordMatchExerciseProps {
  instruction?: string;
  pairs: MatchPair[];
  onComplete: (score: number) => void;
}

export const WordMatchExercise: React.FC<WordMatchExerciseProps> = ({
  instruction = 'Empareja cada palabra en español con su traducción',
  pairs,
  onComplete,
}) => {
  const [selectedSpanishId, setSelectedSpanishId] = useState<string | null>(null);
  const [selectedEnglishId, setSelectedEnglishId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Shuffle english column deterministically
  const [shuffledEnglish] = useState(() => {
    return [...pairs].sort((a, b) => b.spanish.localeCompare(a.spanish));
  });

  const handleSelectSpanish = (id: string) => {
    if (matchedIds.includes(id)) return;
    setWrongAttempt(false);
    setSelectedSpanishId(id);

    if (selectedEnglishId) {
      checkMatch(id, selectedEnglishId);
    }
  };

  const handleSelectEnglish = (id: string) => {
    if (matchedIds.includes(id)) return;
    setWrongAttempt(false);
    setSelectedEnglishId(id);

    if (selectedSpanishId) {
      checkMatch(selectedSpanishId, id);
    }
  };

  const checkMatch = (spanId: string, engId: string) => {
    if (spanId === engId) {
      // Correct pair!
      const newMatched = [...matchedIds, spanId];
      setMatchedIds(newMatched);
      setSelectedSpanishId(null);
      setSelectedEnglishId(null);

      if (newMatched.length === pairs.length) {
        onComplete(100);
      }
    } else {
      // Mismatch
      setWrongAttempt(true);
      setTimeout(() => {
        setSelectedSpanishId(null);
        setSelectedEnglishId(null);
        setWrongAttempt(false);
      }, 700);
    }
  };

  const isAllMatched = matchedIds.length === pairs.length;

  return (
    <EducationalCard variant="cream" style={styles.card}>
      <View style={styles.header}>
        <Badge label="Emparejar Palabras" variant="orange" />
        <EditorialText variant="caption" color={colors.text.secondary}>
          {matchedIds.length} / {pairs.length} parejas
        </EditorialText>
      </View>

      <EditorialText variant="caption" color={colors.forestGreen} style={{ fontWeight: '700' }}>
        {instruction}
      </EditorialText>

      {wrongAttempt && (
        <View style={styles.wrongBanner}>
          <EditorialText variant="caption" color={colors.feedback.error}>
            No coinciden. ¡Inténtalo de nuevo!
          </EditorialText>
        </View>
      )}

      {/* Two-column Matching Area */}
      <View style={styles.columnsContainer}>
        {/* Spanish Column */}
        <View style={styles.column}>
          <EditorialText variant="caption" color={colors.text.secondary} style={styles.colLabel}>
            ESPAÑOL
          </EditorialText>
          {pairs.map(pair => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedSpanishId === pair.id;

            return (
              <Pressable
                key={`es-${pair.id}`}
                onPress={() => handleSelectSpanish(pair.id)}
                disabled={isMatched}
                style={[
                  styles.cardChip,
                  isSelected && styles.chipSelected,
                  isMatched && styles.chipMatched,
                ]}
              >
                <EditorialText
                  variant="bodySmall"
                  color={
                    isMatched
                      ? colors.feedback.success
                      : isSelected
                      ? colors.burntOrange
                      : colors.text.primary
                  }
                  style={{ fontWeight: isSelected || isMatched ? '700' : '500' }}
                >
                  {isMatched ? '✓ ' : ''}{pair.spanish}
                </EditorialText>
              </Pressable>
            );
          })}
        </View>

        {/* English Column */}
        <View style={styles.column}>
          <EditorialText variant="caption" color={colors.text.secondary} style={styles.colLabel}>
            INGLÉS
          </EditorialText>
          {shuffledEnglish.map(pair => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedEnglishId === pair.id;

            return (
              <Pressable
                key={`en-${pair.id}`}
                onPress={() => handleSelectEnglish(pair.id)}
                disabled={isMatched}
                style={[
                  styles.cardChip,
                  isSelected && styles.chipSelected,
                  isMatched && styles.chipMatched,
                ]}
              >
                <EditorialText
                  variant="bodySmall"
                  color={
                    isMatched
                      ? colors.feedback.success
                      : isSelected
                      ? colors.burntOrange
                      : colors.text.primary
                  }
                  style={{ fontWeight: isSelected || isMatched ? '700' : '500' }}
                >
                  {isMatched ? '✓ ' : ''}{pair.english}
                </EditorialText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isAllMatched && (
        <View style={styles.successBanner}>
          <EditorialText variant="subheadline" color={colors.feedback.success} style={{ fontWeight: '700' }}>
            ¡Emparejamiento perfecto! 🎉
          </EditorialText>
        </View>
      )}
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrongBanner: {
    backgroundColor: colors.feedback.errorLight,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  colLabel: {
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardChip: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.burntOrange,
    backgroundColor: '#FCEBE3',
  },
  chipMatched: {
    borderColor: colors.feedback.success,
    backgroundColor: colors.feedback.successLight,
    opacity: 0.8,
  },
  successBanner: {
    backgroundColor: colors.feedback.successLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});

