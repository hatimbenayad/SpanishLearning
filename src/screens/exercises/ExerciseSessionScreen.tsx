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
import { PillButton } from '../../components/common/PillButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { ExerciseCard } from '../../components/learning/ExerciseCard';
import { WordMatchExercise } from '../../components/learning/WordMatchExercise';
import { colors } from '../../theme/colors';
import { sampleExerciseSession, ExerciseSessionQuestion } from '../../data/exercises';
import { LearningService } from '../../services/LearningService';

interface ExerciseSessionScreenProps {
  onBack?: () => void;
  onFinishSession?: (scorePercent: number) => void;
}

export const ExerciseSessionScreen: React.FC<ExerciseSessionScreenProps> = ({
  onBack,
  onFinishSession,
}) => {
  const learningService = LearningService.getInstance();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<Array<{ questionId: string; isCorrect: boolean }>>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const totalQuestions = sampleExerciseSession.length;
  const currentQ: ExerciseSessionQuestion = sampleExerciseSession[currentIndex] || sampleExerciseSession[0];
  const progressRatio = (currentIndex + 1) / totalQuestions;

  const handleQuestionAnswered = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setAnswersHistory(prev => [...prev, { questionId: currentQ.item.id, isCorrect }]);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed session
      const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / totalQuestions) * 100);
      learningService.completeLesson('session-ex-completed');
      setIsCompleted(true);
      onFinishSession?.(finalScore);
    }
  };

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const missedQuestions = sampleExerciseSession.filter(q =>
    answersHistory.some(a => a.questionId === q.item.id && !a.isCorrect)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <EditorialText variant="bodySmall" color={colors.text.secondary}>
              ✕ Salir
            </EditorialText>
          </Pressable>
        )}
        <EditorialText variant="headline" color={colors.text.primary}>
          Sesión de Práctica
        </EditorialText>
        <Badge
          label={`${currentIndex + 1} / ${totalQuestions}`}
          variant="orange"
        />
      </View>

      {/* Progress Track */}
      <ProgressBar
        progress={progressRatio}
        color={colors.burntOrange}
        trackColor="#EAE1D3"
        height={5}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isCompleted ? (
          <View style={styles.questionContainer}>
            {currentQ.item.type === 'word_match' && currentQ.matchingPairs ? (
              <WordMatchExercise
                instruction={currentQ.item.instruction}
                pairs={currentQ.matchingPairs}
                onComplete={() => handleQuestionAnswered(true)}
              />
            ) : (
              <ExerciseCard
                exercise={currentQ.item}
                onComplete={handleQuestionAnswered}
              />
            )}
          </View>
        ) : (
          /* Completion & Celebration Screen */
          <View style={styles.completionContainer}>
            <EducationalCard variant="cream" style={styles.celebrationCard}>
              <View style={styles.trophyCircle}>
                <EditorialText style={{ fontSize: 44 }}>
                  {scorePercent >= 80 ? '🏆' : '📚'}
                </EditorialText>
              </View>

              <EditorialText
                variant="displayLarge"
                color={colors.text.primary}
                align="center"
              >
                {scorePercent >= 80 ? '¡Excelente trabajo!' : '¡Buen esfuerzo!'}
              </EditorialText>

              <EditorialText
                variant="bodyRegular"
                color={colors.text.secondary}
                align="center"
              >
                Has completado la sesión de ejercicios interactivos de hoy.
              </EditorialText>

              <View style={styles.scoreRow}>
                <View style={styles.scoreItem}>
                  <EditorialText variant="statNumber" color={colors.burntOrange}>
                    {scorePercent}%
                  </EditorialText>
                  <EditorialText variant="caption" color={colors.text.secondary}>
                    Puntaje obtenido
                  </EditorialText>
                </View>

                <View style={styles.scoreItem}>
                  <EditorialText variant="statNumber" color={colors.forestGreen}>
                    +{Math.round(totalQuestions * 2.5)} min
                  </EditorialText>
                  <EditorialText variant="caption" color={colors.text.secondary}>
                    Tiempo acreditado
                  </EditorialText>
                </View>

                <View style={styles.scoreItem}>
                  <EditorialText variant="statNumber" color={colors.text.primary}>
                    {correctCount}/{totalQuestions}
                  </EditorialText>
                  <EditorialText variant="caption" color={colors.text.secondary}>
                    Aciertos
                  </EditorialText>
                </View>
              </View>

              {/* Review missed answers if any */}
              {missedQuestions.length > 0 && !reviewMode && (
                <View style={styles.reviewBanner}>
                  <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                    Tuviste {missedQuestions.length} respuesta(s) para revisar.
                  </EditorialText>
                  <PillButton
                    title="Revisar preguntas incorrectas"
                    variant="outline"
                    onPress={() => setReviewMode(true)}
                    size="small"
                  />
                </View>
              )}

              {reviewMode && (
                <View style={styles.missedList}>
                  <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                    Preguntas a repasar:
                  </EditorialText>
                  {missedQuestions.map((q, idx) => (
                    <View key={q.item.id} style={styles.missedCard}>
                      <EditorialText variant="bodySmall" color={colors.text.primary} style={{ fontWeight: '600' }}>
                        {idx + 1}. {q.item.question}
                      </EditorialText>
                      <EditorialText variant="caption" color={colors.feedback.success} style={{ fontWeight: '700' }}>
                        ✓ Respuesta correcta: {String(q.item.correctAnswer)}
                      </EditorialText>
                      <EditorialText variant="caption" color={colors.text.secondary}>
                        {q.item.explanation}
                      </EditorialText>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.actionRow}>
                <PillButton
                  title="Finalizar y volver al inicio →"
                  variant="dark"
                  onPress={onBack || (() => {})}
                  size="large"
                  fullWidth
                />
              </View>
            </EducationalCard>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {},
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 40,
  },
  questionContainer: {
    gap: 16,
  },
  completionContainer: {
    paddingTop: 10,
  },
  celebrationCard: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  trophyCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FDEEE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F3ECE1',
    borderRadius: 16,
    paddingVertical: 14,
    marginVertical: 4,
  },
  scoreItem: {
    alignItems: 'center',
    gap: 2,
  },
  reviewBanner: {
    width: '100%',
    backgroundColor: '#FFF4EE',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  missedList: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  missedCard: {
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: 4,
  },
  actionRow: {
    width: '100%',
    marginTop: 10,
  },
});
