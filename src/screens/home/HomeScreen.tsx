import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { AppHeader } from '../../components/navigation/AppHeader';
import { StatCard } from '../../components/cards/StatCard';
import { ContinueJourneyCard } from '../../components/cards/ContinueJourneyCard';
import { WeeklyBarChart } from '../../components/charts/WeeklyBarChart';
import { SkillProficiencyList } from '../../components/charts/SkillProficiencyList';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { EditorialText } from '../../components/common/EditorialText';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { UserProgress } from '../../types';

interface HomeScreenProps {
  userProgress: UserProgress;
  onNavigateToActivity: (activity: 'reading' | 'vocabulary' | 'grammar' | 'verbs' | 'exercises') => void;
  onContinueLesson: () => void;
  onPressProfile?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProgress,
  onNavigateToActivity,
  onContinueLesson,
  onPressProfile,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Header */}
        <AppHeader
          userName={userProgress.name}
          greeting="¡Hola! ¿Listo para otro día de español?"
          streakCount={userProgress.currentStreak}
          onPressProfile={onPressProfile}
        />

        {/* 1. Metric Overview (Reference 2 Grid) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <EditorialText variant="headline" color={colors.text.primary}>
              Resumen de aprendizaje
            </EditorialText>
            <Badge label="Nivel A1 Activo" variant="forest" />
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <StatCard
                label="Horas de estudio"
                value="7h 50m"
                icon={<EditorialText style={{ fontSize: 18 }}>⏱</EditorialText>}
                iconBgColor="#FCEBE3"
                variant="peach"
                style={styles.gridCard}
              />
              <StatCard
                label="Lecciones"
                value={`${userProgress.completedLessonIds.length} hechas`}
                icon={<EditorialText style={{ fontSize: 18 }}>🎓</EditorialText>}
                iconBgColor="#E8F0EC"
                variant="sage"
                style={styles.gridCard}
              />
            </View>

            <View style={styles.metricsRow}>
              <StatCard
                label="Vocabulario"
                value={`${userProgress.vocabularyCount} palabras`}
                icon={<EditorialText style={{ fontSize: 18 }}>📚</EditorialText>}
                iconBgColor="#FFF4EE"
                variant="cream"
                style={styles.gridCard}
              />
              <StatCard
                label="Progreso A1"
                value="75%"
                icon={<EditorialText style={{ fontSize: 18 }}>📈</EditorialText>}
                iconBgColor="#EDE8F5"
                variant="lavender"
                style={styles.gridCard}
              />
            </View>
          </View>
        </View>

        {/* 2. "Continue Journey" Hero Card */}
        <View style={styles.section}>
          <ContinueJourneyCard
            levelTag="A1 — Lección 08"
            title="Pidiendo comida en el restaurante"
            description="Aprende a ordenar platos típicos españoles, pedir la cuenta y expresar cortesía con soltura."
            durationMinutes={12}
            progressPercent={65}
            onContinue={onContinueLesson}
          />
        </View>

        {/* 3. Daily Learning Activities Pathways */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <EditorialText variant="headline" color={colors.text.primary}>
              Actividades recomendadas de hoy
            </EditorialText>
            <EditorialText variant="caption" color={colors.text.secondary}>
              Elige tu ritmo
            </EditorialText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activitiesCarousel}
          >
            {/* Activity 1: Reading */}
            <EducationalCard
              variant="cream"
              onPress={() => onNavigateToActivity('reading')}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <EditorialText style={styles.activityEmoji}>📖</EditorialText>
                <Badge label="Lectura" variant="forest" />
              </View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={styles.actTitle}>
                El café de la esquina
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={2}>
                Sumérgete en la tertulia y la sobremesa madrileña.
              </EditorialText>
              <EditorialText variant="caption" color={colors.burntOrange} style={styles.actDuration}>
                ⏱ 4 min • Glosario interactivo
              </EditorialText>
            </EducationalCard>

            {/* Activity 2: Interactive Exercises */}
            <EducationalCard
              variant="peach"
              onPress={() => onNavigateToActivity('exercises')}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <EditorialText style={styles.activityEmoji}>✍️</EditorialText>
                <Badge label="Práctica" variant="orange" />
              </View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={styles.actTitle}>
                Ejercicios interactivos
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={2}>
                Emparejar palabras, ordenar frases y opción múltiple.
              </EditorialText>
              <EditorialText variant="caption" color={colors.burntOrange} style={styles.actDuration}>
                ⏱ 5 min • Sesión evaluada
              </EditorialText>
            </EducationalCard>

            {/* Activity 3: Vocabulary */}
            <EducationalCard
              variant="sage"
              onPress={() => onNavigateToActivity('vocabulary')}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <EditorialText style={styles.activityEmoji}>🗂️</EditorialText>
                <Badge label="FSRS" variant="sage" />
              </View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={styles.actTitle}>
                Repaso de vocabulario
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={2}>
                Tarjetas inteligentes con repetición espaciada.
              </EditorialText>
              <EditorialText variant="caption" color={colors.forestGreen} style={styles.actDuration}>
                6 palabras pendientes hoy
              </EditorialText>
            </EducationalCard>

            {/* Activity 4: Grammar */}
            <EducationalCard
              variant="cream"
              onPress={() => onNavigateToActivity('grammar')}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <EditorialText style={styles.activityEmoji}>📐</EditorialText>
                <Badge label="Gramática" variant="dark" />
              </View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={styles.actTitle}>
                Ser vs. Estar
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={2}>
                La regla mnemotécnica definitiva sin enredos.
              </EditorialText>
              <EditorialText variant="caption" color={colors.burntOrange} style={styles.actDuration}>
                ⏱ 6 min • Ejercicios guiados
              </EditorialText>
            </EducationalCard>

            {/* Activity 5: Verbs */}
            <EducationalCard
              variant="ivory"
              onPress={() => onNavigateToActivity('verbs')}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <EditorialText style={styles.activityEmoji}>🔄</EditorialText>
                <Badge label="Verbos" variant="neutral" />
              </View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={styles.actTitle}>
                Conjugación de verbos
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={2}>
                Tablas completas de hablar, comer, vivir y ser.
              </EditorialText>
              <EditorialText variant="caption" color={colors.forestGreen} style={styles.actDuration}>
                6 tiempos verbales
              </EditorialText>
            </EducationalCard>
          </ScrollView>
        </View>

        {/* 4. Weekly Progress Performance Chart (Reference 2 Inspiration) */}
        <View style={styles.section}>
          <WeeklyBarChart
            data={userProgress.weeklyActivity}
            dailyGoalMinutes={userProgress.dailyGoalMinutes}
            totalHoursLabel="7h 50m"
            totalLessonsLabel={`${userProgress.completedLessonIds.length} lecciones`}
          />
        </View>

        {/* 5. Separate Skill Proficiency Breakdown */}
        <View style={styles.section}>
          <SkillProficiencyList proficiency={userProgress.skillProficiency} />
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
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricsGrid: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
  },
  activitiesCarousel: {
    gap: 12,
    paddingRight: 10,
  },
  activityCard: {
    width: 200,
    padding: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityEmoji: {
    fontSize: 22,
  },
  actTitle: {
    fontWeight: '700',
  },
  actDuration: {
    fontWeight: '600',
    marginTop: 4,
  },
});

