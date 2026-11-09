import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { SkillProficiency } from '../../types';

interface SkillProficiencyListProps {
  proficiency: SkillProficiency;
}

interface SkillItemConfig {
  key: keyof SkillProficiency;
  title: string;
  emoji: string;
  color: string;
  cefrSublevel: string;
}

const skillsConfig: SkillItemConfig[] = [
  {
    key: 'reading',
    title: 'Comprensión de lectura',
    emoji: '📖',
    color: colors.forestGreen,
    cefrSublevel: 'A2.1 En progreso',
  },
  {
    key: 'listening',
    title: 'Comprensión auditiva',
    emoji: '🎧',
    color: colors.burntOrange,
    cefrSublevel: 'A1.2 Consolidado',
  },
  {
    key: 'writing',
    title: 'Expresión escrita',
    emoji: '✍️',
    color: '#8E4822',
    cefrSublevel: 'A1.1 Inicial',
  },
  {
    key: 'speaking',
    title: 'Expresión oral',
    emoji: '🗣️',
    color: '#2A5D4E',
    cefrSublevel: 'A1.1 Inicial',
  },
];

export const SkillProficiencyList: React.FC<SkillProficiencyListProps> = ({
  proficiency,
}) => {
  return (
    <EducationalCard variant="cream" style={styles.card}>
      <View style={styles.header}>
        <EditorialText variant="headline" color={colors.text.primary}>
          Dominio por habilidades
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Evaluación continua CEFR
        </EditorialText>
      </View>

      <View style={styles.list}>
        {skillsConfig.map(skill => {
          const value = proficiency[skill.key] || 0;
          return (
            <View key={skill.key} style={styles.skillRow}>
              <View style={styles.topRow}>
                <View style={styles.titleGroup}>
                  <EditorialText style={styles.emoji}>{skill.emoji}</EditorialText>
                  <EditorialText variant="subheadline" color={colors.text.primary}>
                    {skill.title}
                  </EditorialText>
                </View>
                <Badge
                  label={skill.cefrSublevel}
                  variant="neutral"
                  style={styles.badge}
                />
              </View>

              <View style={styles.meterRow}>
                <ProgressBar
                  progress={value / 100}
                  color={skill.color}
                  trackColor="#EAE1D3"
                  height={7}
                  style={styles.progressBar}
                />
                <EditorialText
                  variant="caption"
                  color={colors.text.secondary}
                  style={styles.percentage}
                >
                  {value}%
                </EditorialText>
              </View>
            </View>
          );
        })}
      </View>
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  skillRow: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 16,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
  },
  percentage: {
    width: 36,
    textAlign: 'right',
    fontWeight: '600',
  },
});

