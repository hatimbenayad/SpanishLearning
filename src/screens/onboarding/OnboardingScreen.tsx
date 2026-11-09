import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { PillButton } from '../../components/common/PillButton';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { ReaderIllustration } from '../../components/illustrations/ReaderIllustration';
import { BooksStackIllustration } from '../../components/illustrations/BooksStackIllustration';
import { colors } from '../../theme/colors';
import { CEFRLevel } from '../../types';

interface OnboardingScreenProps {
  onFinish: (preferences: { goal: string; level: CEFRLevel; dailyMinutes: number }) => void;
  onSkip?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onFinish,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('culture');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(20);

  const goals = [
    { id: 'culture', title: 'Literatura y Cultura', desc: 'Leer novelas, poesía y apreciar la riqueza cultural hispana.', icon: '📖' },
    { id: 'travel', title: 'Viajes y Conversación', desc: 'Desenvolverte con naturalidad en España y Latinoamérica.', icon: '✈️' },
    { id: 'career', title: 'Crecimiento Profesional', desc: 'Comunicarte con fluidez en entornos de trabajo globales.', icon: '💼' },
    { id: 'mind', title: 'Reto Intelectual', desc: 'Ejercitar la mente descubriendo una nueva forma de pensar.', icon: '🧠' },
  ];

  const levels: Array<{ id: CEFRLevel; title: string; subtitle: string; desc: string }> = [
    { id: 'A1', title: 'A1 — Principiante', subtitle: 'Inicio absoluto', desc: 'Empiezo desde cero o conozco pocas palabras sueltas.' },
    { id: 'A2', title: 'A2 — Elemental', subtitle: 'Bases consolidadas', desc: 'Comprendo frases cotidianas y me presento con sencillez.' },
    { id: 'B1', title: 'B1 — Intermedio', subtitle: 'Independencia', desc: 'Puedo mantener conversaciones y leer textos adaptados.' },
    { id: 'B2', title: 'B2 — Intermedio Alto', subtitle: 'Fluidez y matices', desc: 'Comprendo ideas complejas y literatura auténtica.' },
  ];

  const durations = [
    { minutes: 10, label: '10 min / día', title: 'Paso tranquilo', desc: 'Ideal para mantener el hábito constante.' },
    { minutes: 20, label: '20 min / día', title: 'Recomendado', desc: 'El equilibrio perfecto entre avance y disfrute.' },
    { minutes: 30, label: '30 min / día', title: 'Inmersión profunda', desc: 'Para un progreso rápido hacia la fluidez.' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onFinish({
        goal: selectedGoal,
        level: selectedLevel,
        dailyMinutes: selectedMinutes,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Row */}
        <View style={styles.topNav}>
          {step > 1 ? (
            <Pressable onPress={() => setStep(step - 1)} hitSlop={10}>
              <EditorialText variant="bodySmall" color={colors.text.secondary}>
                ← Volver
              </EditorialText>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}

          {/* Step indicator dots */}
          <View style={styles.dotsRow}>
            {[1, 2, 3, 4].map(s => (
              <View
                key={s}
                style={[
                  styles.dot,
                  s === step && styles.dotActive,
                  s < step && styles.dotCompleted,
                ]}
              />
            ))}
          </View>

          {onSkip ? (
            <Pressable onPress={onSkip} hitSlop={10}>
              <EditorialText variant="bodySmall" color={colors.text.secondary}>
                Saltar
              </EditorialText>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: Welcome & Literary Aesthetic */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.illustrationWrap}>
                <ReaderIllustration width={290} height={230} />
              </View>

              <View style={styles.editorialQuote}>
                <EditorialText
                  variant="handwritten"
                  color={colors.burntOrange}
                  align="center"
                >
                  Different stories, brighter days
                </EditorialText>
              </View>

              <EditorialText
                variant="displayLarge"
                color={colors.text.primary}
                align="center"
                style={styles.heroTitle}
              >
                Un nuevo idioma.{'\n'}Nuevas posibilidades.
              </EditorialText>

              <EditorialText
                variant="bodyRegular"
                color={colors.text.secondary}
                align="center"
                style={styles.heroSubtitle}
              >
                Descubre el español a través de la literatura, el audio auténtico y un viaje guiado con calidez de A1 a B2.
              </EditorialText>
            </View>
          )}

          {/* STEP 2: Goals */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <EditorialText
                variant="displayMedium"
                color={colors.text.primary}
                style={styles.stepTitle}
              >
                ¿Qué te inspira a aprender español?
              </EditorialText>
              <EditorialText
                variant="bodyRegular"
                color={colors.text.secondary}
                style={styles.stepSubtitle}
              >
                Personalizaremos tus recomendaciones de lectura y práctica.
              </EditorialText>

              <View style={styles.cardsList}>
                {goals.map(g => {
                  const isSelected = selectedGoal === g.id;
                  return (
                    <EducationalCard
                      key={g.id}
                      variant={isSelected ? 'peach' : 'cream'}
                      onPress={() => setSelectedGoal(g.id)}
                      style={[
                        styles.choiceCard,
                        isSelected ? styles.choiceCardSelected : undefined,
                      ]}
                    >
                      <View style={styles.choiceHeader}>
                        <EditorialText style={styles.choiceIcon}>{g.icon}</EditorialText>
                        <EditorialText
                          variant="subheadline"
                          color={isSelected ? colors.burntOrange : colors.text.primary}
                          style={{ fontWeight: '700' }}
                        >
                          {g.title}
                        </EditorialText>
                      </View>
                      <EditorialText variant="bodySmall" color={colors.text.secondary}>
                        {g.desc}
                      </EditorialText>
                    </EducationalCard>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: CEFR Level Assessment */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <EditorialText
                variant="displayMedium"
                color={colors.text.primary}
                style={styles.stepTitle}
              >
                ¿Cuál es tu nivel actual?
              </EditorialText>
              <EditorialText
                variant="bodyRegular"
                color={colors.text.secondary}
                style={styles.stepSubtitle}
              >
                Basado en el Marco Común Europeo de Referencia (MCER).
              </EditorialText>

              <View style={styles.cardsList}>
                {levels.map(lvl => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <EducationalCard
                      key={lvl.id}
                      variant={isSelected ? 'sage' : 'cream'}
                      onPress={() => setSelectedLevel(lvl.id)}
                      style={[
                        styles.choiceCard,
                        isSelected ? { borderColor: colors.forestGreen, borderWidth: 2 } : undefined,
                      ]}
                    >
                      <View style={styles.levelRow}>
                        <EditorialText
                          variant="headline"
                          color={isSelected ? colors.forestGreen : colors.text.primary}
                          style={{ fontWeight: '700' }}
                        >
                          {lvl.title}
                        </EditorialText>
                        <EditorialText variant="caption" color={colors.forestGreen}>
                          {lvl.subtitle}
                        </EditorialText>
                      </View>
                      <EditorialText variant="bodySmall" color={colors.text.secondary}>
                        {lvl.desc}
                      </EditorialText>
                    </EducationalCard>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: Daily Commitment Pace */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <View style={styles.smallIllustration}>
                <BooksStackIllustration width={220} height={150} />
              </View>

              <EditorialText
                variant="displayMedium"
                color={colors.text.primary}
                align="center"
                style={styles.stepTitle}
              >
                Define tu ritmo de estudio diario
              </EditorialText>
              <EditorialText
                variant="bodyRegular"
                color={colors.text.secondary}
                align="center"
                style={styles.stepSubtitle}
              >
                La constancia diaria es la clave del aprendizaje de idiomas.
              </EditorialText>

              <View style={styles.cardsList}>
                {durations.map(d => {
                  const isSelected = selectedMinutes === d.minutes;
                  return (
                    <EducationalCard
                      key={d.minutes}
                      variant={isSelected ? 'peach' : 'cream'}
                      onPress={() => setSelectedMinutes(d.minutes)}
                      style={[
                        styles.choiceCard,
                        isSelected ? styles.choiceCardSelected : undefined,
                      ]}
                    >
                      <View style={styles.durationHeader}>
                        <EditorialText
                          variant="subheadline"
                          color={isSelected ? colors.burntOrange : colors.text.primary}
                          style={{ fontWeight: '700' }}
                        >
                          {d.title}
                        </EditorialText>
                        <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                          ⏱ {d.label}
                        </EditorialText>
                      </View>
                      <EditorialText variant="bodySmall" color={colors.text.secondary}>
                        {d.desc}
                      </EditorialText>
                    </EducationalCard>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Pill Button */}
        <View style={styles.bottomBar}>
          <PillButton
            title={step === 4 ? 'Empezar a aprender →' : 'Continuar →'}
            variant="dark"
            onPress={handleNext}
            size="large"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2D7C7',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.burntOrange,
  },
  dotCompleted: {
    backgroundColor: colors.forestGreen,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stepContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  illustrationWrap: {
    marginBottom: 8,
  },
  smallIllustration: {
    marginBottom: 10,
  },
  editorialQuote: {
    marginBottom: 8,
  },
  heroTitle: {
    marginBottom: 12,
    lineHeight: 38,
  },
  heroSubtitle: {
    lineHeight: 22,
    maxWidth: 320,
  },
  stepTitle: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  stepSubtitle: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    lineHeight: 20,
  },
  cardsList: {
    width: '100%',
    gap: 12,
  },
  choiceCard: {
    padding: 16,
    gap: 6,
  },
  choiceCardSelected: {
    borderColor: colors.burntOrange,
    borderWidth: 2,
  },
  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  choiceIcon: {
    fontSize: 20,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  durationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.background.canvas,
  },
});
