import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { StatCard } from '../../components/cards/StatCard';
import { WeeklyBarChart } from '../../components/charts/WeeklyBarChart';
import { SkillProficiencyList } from '../../components/charts/SkillProficiencyList';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { colors } from '../../theme/colors';
import { UserProgress } from '../../types';
import { LearningService } from '../../services/LearningService';
import { formatMinutesToHours } from '../../utils/formatters';

interface ProgressScreenProps {
  userProgress: UserProgress;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ userProgress }) => {
  const learningService = LearningService.getInstance();
  const forecast = learningService.getReviewForecast();
  const weeklyMinutes = userProgress.weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);
  const weeklyLessons = userProgress.weeklyActivity.reduce((sum, d) => sum + d.lessons, 0);
  const totalTimeFormatted = formatMinutesToHours(userProgress.totalLearningMinutes);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Mi Progreso &amp; Métricas
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Evaluación objetiva del dominio de la lengua
        </EditorialText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top 4 KPI Metrics */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            <StatCard
              label="Vocabulario FSRS"
              value={`${userProgress.vocabularyCount}`}
              icon={<EditorialText style={{ fontSize: 18 }}>📚</EditorialText>}
              iconBgColor="#FFF4EE"
              variant="cream"
              style={styles.kpiCard}
            />
            <StatCard
              label="Tiempo Total"
              value={totalTimeFormatted}
              icon={<EditorialText style={{ fontSize: 18 }}>⏱</EditorialText>}
              iconBgColor="#FCEBE3"
              variant="peach"
              style={styles.kpiCard}
            />
          </View>

          <View style={styles.kpiRow}>
            <StatCard
              label="Racha Actual"
              value={`${userProgress.currentStreak} días`}
              icon={<EditorialText style={{ fontSize: 18 }}>🔥</EditorialText>}
              iconBgColor="#FDEEE8"
              variant="peach"
              style={styles.kpiCard}
            />
            <StatCard
              label="Lecciones"
              value={`${userProgress.completedLessonIds.length} listas`}
              icon={<EditorialText style={{ fontSize: 18 }}>🎓</EditorialText>}
              iconBgColor="#E8F0EC"
              variant="sage"
              style={styles.kpiCard}
            />
          </View>
        </View>

        {/* Weekly Performance Bar Chart */}
        <WeeklyBarChart
          data={userProgress.weeklyActivity}
          dailyGoalMinutes={userProgress.dailyGoalMinutes}
          totalHoursLabel={`${formatMinutesToHours(weeklyMinutes)} esta semana`}
          totalLessonsLabel={`${weeklyLessons} actividades`}
        />

        {/* FSRS Repetition Forecast Card */}
        <EducationalCard variant="cream" style={styles.forecastCard}>
          <View style={styles.forecastHeader}>
            <View>
              <EditorialText variant="headline" color={colors.text.primary}>
                Próximos repasos FSRS
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Algoritmo de intervalos optimizado
              </EditorialText>
            </View>
            <Badge label="FSRS Activo" variant="forest" />
          </View>

          <View style={styles.forecastRow}>
            <View style={styles.forecastCol}>
              <EditorialText variant="statNumber" color={colors.burntOrange}>
                {forecast.dueToday}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Para hoy
              </EditorialText>
            </View>

            <View style={styles.forecastCol}>
              <EditorialText variant="statNumber" color={colors.forestGreen}>
                {forecast.dueTomorrow}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Mañana
              </EditorialText>
            </View>

            <View style={styles.forecastCol}>
              <EditorialText variant="statNumber" color={colors.text.primary}>
                {forecast.dueThisWeek}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Esta semana
              </EditorialText>
            </View>
          </View>
        </EducationalCard>

        {/* Skill Proficiency Breakdown */}
        <SkillProficiencyList proficiency={userProgress.skillProficiency} />

        {/* CEFR Milestones Roadmap */}
        <EducationalCard variant="ivory" style={styles.milestoneCard}>
          <EditorialText variant="headline" color={colors.text.primary} style={{ marginBottom: 12 }}>
            Hitos del Marco Común Europeo (MCER)
          </EditorialText>

          <View style={styles.milestonesList}>
            <View style={styles.milestoneItem}>
              <EditorialText style={styles.checkDone}>✓</EditorialText>
              <View style={styles.milestoneText}>
                <EditorialText variant="subheadline" color={colors.forestGreen}>
                  A1.1 — Saludos, números y descripciones inmediatas
                </EditorialText>
                <EditorialText variant="caption" color={colors.text.secondary}>
                  Completado con éxito (100%)
                </EditorialText>
              </View>
            </View>

            <View style={styles.milestoneItem}>
              <EditorialText style={styles.checkProgress}>🔄</EditorialText>
              <View style={styles.milestoneText}>
                <EditorialText variant="subheadline" color={colors.text.primary}>
                  A1.2 — Pidiendo comida, compras y gustos personales
                </EditorialText>
                <EditorialText variant="caption" color={colors.burntOrange}>
                  En curso (65% completado)
                </EditorialText>
              </View>
            </View>

            <View style={styles.milestoneItem}>
              <EditorialText style={styles.checkPending}>○</EditorialText>
              <View style={styles.milestoneText}>
                <EditorialText variant="subheadline" color={colors.text.secondary}>
                  A2.1 — Rutinas pasadas y relatos de viajes
                </EditorialText>
                <EditorialText variant="caption" color={colors.text.secondary}>
                  Próximo objetivo
                </EditorialText>
              </View>
            </View>
          </View>
        </EducationalCard>
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
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  kpiGrid: {
    gap: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
  },
  forecastCard: {
    padding: 20,
    gap: 16,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(23, 23, 21, 0.03)',
    paddingVertical: 14,
    borderRadius: 14,
  },
  forecastCol: {
    alignItems: 'center',
    gap: 2,
  },
  milestoneCard: {
    padding: 20,
  },
  milestonesList: {
    gap: 14,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkDone: {
    fontSize: 18,
    color: colors.forestGreen,
    fontWeight: '700',
  },
  checkProgress: {
    fontSize: 16,
  },
  checkPending: {
    fontSize: 18,
    color: colors.mutedGrey,
  },
  milestoneText: {
    flex: 1,
    gap: 2,
  },
});

