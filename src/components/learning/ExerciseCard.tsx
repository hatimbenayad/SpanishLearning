import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { PillButton } from '../common/PillButton';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { ExerciseItem } from '../../types';

interface ExerciseCardProps {
  exercise: ExerciseItem;
  onComplete: (isCorrect: boolean) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onComplete,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // For sentence ordering / word reordering exercises:
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    if (exercise.type === 'sentence_reorder' && exercise.options) {
      return [...exercise.options];
    }
    return [];
  });

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleAddWordToSentence = (word: string, index: number) => {
    if (isSubmitted) return;
    setOrderedWords([...orderedWords, word]);
    const remaining = [...availableWords];
    remaining.splice(index, 1);
    setAvailableWords(remaining);
  };

  const handleRemoveWordFromSentence = (word: string, index: number) => {
    if (isSubmitted) return;
    const updated = [...orderedWords];
    updated.splice(index, 1);
    setOrderedWords(updated);
    setAvailableWords([...availableWords, word]);
  };

  const checkAnswer = () => {
    if (exercise.type === 'sentence_reorder') {
      const builtSentence = orderedWords.join(' ');
      const isCorrect = builtSentence.trim().toLowerCase() === String(exercise.correctAnswer).trim().toLowerCase();
      setIsSubmitted(true);
      onComplete(isCorrect);
    } else {
      const isCorrect = selectedOption === exercise.correctAnswer;
      setIsSubmitted(true);
      onComplete(isCorrect);
    }
  };

  const isAnswerCorrect =
    exercise.type === 'sentence_reorder'
      ? orderedWords.join(' ').trim().toLowerCase() === String(exercise.correctAnswer).trim().toLowerCase()
      : selectedOption === exercise.correctAnswer;

  return (
    <EducationalCard variant="cream" style={styles.card}>
      {/* Exercise Header */}
      <View style={styles.header}>
        <Badge label={exercise.type.replace('_', ' ')} variant="peach" />
        <EditorialText variant="caption" color={colors.text.secondary}>
          Nivel {exercise.difficulty}
        </EditorialText>
      </View>

      {/* Instruction */}
      <EditorialText
        variant="caption"
        color={colors.forestGreen}
        style={styles.instruction}
      >
        {exercise.instruction}
      </EditorialText>

      {/* Question Prompt */}
      <EditorialText
        variant="headline"
        color={colors.text.primary}
        style={styles.question}
      >
        {exercise.question}
      </EditorialText>

      {/* Option Type 1: Sentence Reordering */}
      {exercise.type === 'sentence_reorder' && (
        <View style={styles.sentenceReorderContainer}>
          {/* Assembled sentence drop area */}
          <View style={styles.assembledArea}>
            {orderedWords.length === 0 ? (
              <EditorialText variant="caption" color={colors.text.secondary}>
                Toca las palabras de abajo en el orden correcto
              </EditorialText>
            ) : (
              orderedWords.map((w, idx) => (
                <Pressable
                  key={`ord-${idx}`}
                  onPress={() => handleRemoveWordFromSentence(w, idx)}
                  style={styles.wordChipActive}
                >
                  <EditorialText variant="bodyRegular" color={colors.text.primary}>
                    {w}
                  </EditorialText>
                </Pressable>
              ))
            )}
          </View>

          {/* Word Bank */}
          <View style={styles.wordBank}>
            {availableWords.map((w, idx) => (
              <Pressable
                key={`avail-${idx}`}
                onPress={() => handleAddWordToSentence(w, idx)}
                style={styles.wordChip}
              >
                <EditorialText variant="bodyRegular" color={colors.text.primary}>
                  {w}
                </EditorialText>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Option Type 2: Multiple Choice / Fill In Blanks / Translation */}
      {exercise.type !== 'sentence_reorder' && exercise.options && (
        <View style={styles.optionsList}>
          {exercise.options.map(option => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === exercise.correctAnswer;

            let optionBg: string = '#FFF9F0';
            let optionBorder: string = colors.border.subtle;
            let textColor: string = colors.text.primary;

            if (isSubmitted) {
              if (isCorrectAnswer) {
                optionBg = colors.feedback.successLight;
                optionBorder = colors.feedback.success;
                textColor = colors.feedback.success;
              } else if (isSelected && !isCorrectAnswer) {
                optionBg = colors.feedback.errorLight;
                optionBorder = colors.feedback.error;
                textColor = colors.feedback.error;
              }
            } else if (isSelected) {
              optionBg = '#FCEBE3';
              optionBorder = colors.burntOrange;
              textColor = colors.burntOrange;
            }

            return (
              <Pressable
                key={option}
                onPress={() => handleSelectOption(option)}
                style={[
                  styles.optionCard,
                  { backgroundColor: optionBg, borderColor: optionBorder },
                ]}
              >
                <EditorialText
                  variant="bodyRegular"
                  color={textColor}
                  style={{ fontWeight: isSelected || (isSubmitted && isCorrectAnswer) ? '600' : '400' }}
                >
                  {option}
                </EditorialText>
                {isSubmitted && isCorrectAnswer && (
                  <EditorialText variant="caption" color={colors.feedback.success}>
                    ✓ Correcto
                  </EditorialText>
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Educational Feedback Drawer upon submit */}
      {isSubmitted && (
        <View
          style={[
            styles.feedbackBox,
            isAnswerCorrect ? styles.feedbackSuccess : styles.feedbackError,
          ]}
        >
          <EditorialText
            variant="subheadline"
            color={isAnswerCorrect ? colors.feedback.success : colors.feedback.error}
            style={{ fontWeight: '700' }}
          >
            {isAnswerCorrect ? '¡Excelente trabajo!' : 'Respuesta a repasar:'}
          </EditorialText>
          <EditorialText
            variant="bodySmall"
            color={colors.text.primary}
            style={{ marginTop: 4 }}
          >
            {exercise.explanation}
          </EditorialText>
        </View>
      )}

      {/* Check / Next Action */}
      <View style={styles.actionRow}>
        {!isSubmitted ? (
          <PillButton
            title="Comprobar respuesta"
            variant="primary"
            onPress={checkAnswer}
            disabled={
              exercise.type === 'sentence_reorder'
                ? orderedWords.length === 0
                : !selectedOption
            }
            fullWidth
          />
        ) : (
          <PillButton
            title="Siguiente ejercicio →"
            variant="secondary"
            onPress={() => {
              setIsSubmitted(false);
              setSelectedOption(null);
              setOrderedWords([]);
            }}
            fullWidth
          />
        )}
      </View>
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instruction: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 19,
    lineHeight: 26,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  sentenceReorderContainer: {
    gap: 14,
  },
  assembledArea: {
    minHeight: 56,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    backgroundColor: '#F3ECE1',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6DCCD',
    alignItems: 'center',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  wordChipActive: {
    backgroundColor: colors.softPeach,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5A58A',
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  feedbackSuccess: {
    backgroundColor: colors.feedback.successLight,
    borderLeftColor: colors.feedback.success,
  },
  feedbackError: {
    backgroundColor: colors.feedback.errorLight,
    borderLeftColor: colors.feedback.error,
  },
  actionRow: {
    marginTop: 6,
  },
});
