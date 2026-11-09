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
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { colors } from '../../theme/colors';
import { CEFRLevel, LearningCategory } from '../../types';

interface LearnHubScreenProps {
  currentLevel: CEFRLevel;
  onSelectCategory: (category: LearningCategory) => void;
}

export const LearnHubScreen: React.FC<LearnHubScreenProps> = ({
  currentLevel: initialLevel,
  onSelectCategory,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(initialLevel);

  const modules: Array<{
    category: LearningCategory;
    title: string;
    description: string;
    icon: string;
    badge: string;
    variant: 'cream' | 'peach' | 'sage' | 'dark' | 'lavender';
    count: string;
  }> = [
    {
      category: 'vocabulary',
      title: 'Vocabulario & Tarjetas FSRS',
      description: 'Adquisición de léxico con algoritmo determinista de repetición espaciada.',
      icon: '🗂️',
      badge: 'FSRS Activo',
      variant: 'cream',
      count: '480 palabras',
    },
    {
      category: 'grammar',
      title: 'Gramática Estructurada',
      description: 'Lecciones progresivas de A1 a B2 con explicaciones visuales y reglas claras.',
      icon: '📐',
      badge: 'A1–B2',
      variant: 'peach',
      count: '24 lecciones',
    },
    {
      category: 'verbs',
      title: 'Conjugador Verbal & Tablas',
      description: 'Base de datos sistemática en 6 tiempos: presente, pasado, futuro y subjuntivo.',
      icon: '🔄',
      badge: 'Esencial',
      variant: 'sage',
      count: 'Verbos regulares & irregulares',
    },
    {
      category: 'reading',
      title: 'Lecturas & Literatura',
      description: 'Textos auténticos con traductor interactivo al tocar palabras y glosario.',
      icon: '📖',
      badge: 'Editorial',
      variant: 'cream',
      count: 'Cervantes, crónicas y cuentos',
    },
    {
      category: 'listening',
      title: 'Audios con Transcripción',
      description: 'Locutores nativos, velocidad graduable y frases repetibles con un toque.',
      icon: '🎧',
      badge: 'Nativo',
      variant: 'dark',
      count: 'Historias sonoras de España',
    },
    {
      category: 'exercises',
      title: 'Ejercicios Interactivos',
      description: 'Reordenar frases, opción múltiple, rellenar huecos y retroalimentación.',
      icon: '✍️',
      badge: 'Práctica',
      variant: 'lavender',
      count: 'Evaluación formativa',
    },
    {
      category: 'writing',
      title: 'Taller de Escritura',
      description: 'Composiciones guiadas con metas de palabras y banco léxico sugerido.',
      icon: '📝',
      badge: 'Expresión',
      variant: 'peach',
      count: 'Redacción A1–B2',
    },
    {
      category: 'speaking',
      title: 'Práctica de Pronunciación',
      description: 'Modelo sonoro nativo, consejos de entonación y grabador con reproducción.',
      icon: '🗣️',
      badge: 'Oral',
      variant: 'sage',
      count: 'Locución nativa',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Plan de Aprendizaje
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Currículo integral estructurado por el MCER (A1–B2)
        </EditorialText>
      </View>

      {/* CEFR Level Selector Tabs */}
      <View style={styles.levelTabs}>
        {(['A1', 'A2', 'B1', 'B2'] as const).map(lvl => {
          const isSelected = selectedLevel === lvl;
          return (
            <Pressable
              key={lvl}
              onPress={() => setSelectedLevel(lvl)}
              style={[
                styles.levelTab,
                isSelected ? styles.levelTabActive : styles.levelTabInactive,
              ]}
            >
              <EditorialText
                variant="subheadline"
                color={isSelected ? colors.text.inverse : colors.text.primary}
                style={{ fontWeight: isSelected ? '700' : '500' }}
              >
                Nivel {lvl}
              </EditorialText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Level Overview Banner */}
        <EducationalCard variant="cream" style={styles.levelBanner}>
          <View style={styles.bannerTop}>
            <View>
              <EditorialText variant="headline" color={colors.forestGreen}>
                {selectedLevel === 'A1'
                  ? 'A1 — Nivel Inicial'
                  : selectedLevel === 'A2'
                  ? 'A2 — Nivel Elemental'
                  : selectedLevel === 'B1'
                  ? 'B1 — Nivel Intermedio'
                  : 'B2 — Nivel Intermedio Alto'}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                {selectedLevel === 'A1'
                  ? 'Fundamentos, vocabulario cotidiano y frases de uso común.'
                  : selectedLevel === 'A2'
                  ? 'Pasado, descripciones y conversaciones cotidianas en España.'
                  : selectedLevel === 'B1'
                  ? 'Expresión de opiniones, narración de historias y subjuntivo inicial.'
                  : 'Textos complejos, debates culturales y literatura auténtica.'}
              </EditorialText>
            </View>
          </View>
          <View style={styles.bannerProgress}>
            <View style={styles.progressRow}>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Completitud del nivel
              </EditorialText>
              <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                {selectedLevel === 'A1' ? '75%' : '0%'}
              </EditorialText>
            </View>
            <ProgressBar
              progress={selectedLevel === 'A1' ? 0.75 : 0.05}
              color={colors.burntOrange}
              trackColor="#EAE1D3"
              height={6}
            />
          </View>
        </EducationalCard>

        {/* Modules List */}
        <View style={styles.modulesList}>
          {modules.map(mod => {
            const isDark = mod.variant === 'dark';
            return (
              <EducationalCard
                key={mod.category}
                variant={mod.variant}
                onPress={() => onSelectCategory(mod.category)}
                style={styles.moduleCard}
              >
                <View style={styles.moduleTop}>
                  <View style={styles.iconCircle}>
                    <EditorialText style={{ fontSize: 22 }}>{mod.icon}</EditorialText>
                  </View>
                  <Badge
                    label={mod.badge}
                    variant={isDark ? 'orange' : 'neutral'}
                  />
                </View>

                <EditorialText
                  variant="headline"
                  color={isDark ? colors.text.inverse : colors.text.primary}
                  style={styles.modTitle}
                >
                  {mod.title}
                </EditorialText>

                <EditorialText
                  variant="bodySmall"
                  color={isDark ? 'rgba(255, 249, 240, 0.85)' : colors.text.secondary}
                  style={styles.modDesc}
                >
                  {mod.description}
                </EditorialText>

                <View style={styles.modFooter}>
                  <EditorialText
                    variant="caption"
                    color={isDark ? colors.burntOrange : colors.forestGreen}
                    style={{ fontWeight: '600' }}
                  >
                    {mod.count}
                  </EditorialText>
                  <EditorialText
                    variant="caption"
                    color={isDark ? colors.text.inverse : colors.text.primary}
                    style={{ fontWeight: '700' }}
                  >
                    Entrar →
                  </EditorialText>
                </View>
              </EducationalCard>
            );
          })}
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
    paddingBottom: 10,
  },
  levelTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: '#EBE2D4',
    borderRadius: 9999,
    padding: 3,
  },
  levelTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9999,
  },
  levelTabActive: {
    backgroundColor: colors.forestGreen,
  },
  levelTabInactive: {},
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  levelBanner: {
    padding: 18,
    gap: 12,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerProgress: {
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modulesList: {
    gap: 14,
  },
  moduleCard: {
    padding: 18,
    gap: 8,
  },
  moduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(23, 23, 21, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modTitle: {
    fontWeight: '700',
  },
  modDesc: {
    lineHeight: 18,
  },
  modFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(23, 23, 21, 0.06)',
  },
});

