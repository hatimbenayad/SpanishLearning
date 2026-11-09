import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { EducationalCard } from './EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { PillButton } from '../common/PillButton';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';

interface ContinueJourneyCardProps {
  levelTag?: string; // e.g. "A1 — Lección 08"
  title: string; // e.g. "Pidiendo comida en el restaurante"
  description: string;
  durationMinutes: number;
  progressPercent: number; // 0 - 100
  onContinue: () => void;
  style?: ViewStyle;
}

export const ContinueJourneyCard: React.FC<ContinueJourneyCardProps> = ({
  levelTag = 'A1 — Lección 08',
  title,
  description,
  durationMinutes,
  progressPercent,
  onContinue,
  style,
}) => {
  return (
    <EducationalCard variant="dark" style={[styles.card, style]}>
      {/* Decorative top accent */}
      <View style={styles.headerRow}>
        <Badge
          label={levelTag}
          variant="orange"
          style={styles.badge}
        />
        <EditorialText variant="caption" color="rgba(255, 249, 240, 0.7)">
          ⏱ {durationMinutes} min
        </EditorialText>
      </View>

      <EditorialText
        variant="displaySmall"
        color={colors.text.inverse}
        style={styles.title}
      >
        {title}
      </EditorialText>

      <EditorialText
        variant="bodySmall"
        color="rgba(255, 249, 240, 0.85)"
        style={styles.description}
        numberOfLines={2}
      >
        {description}
      </EditorialText>

      {/* Progress track */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <EditorialText variant="caption" color="rgba(255, 249, 240, 0.7)">
            Progreso
          </EditorialText>
          <EditorialText variant="caption" color="rgba(255, 249, 240, 0.9)">
            {progressPercent}%
          </EditorialText>
        </View>
        <ProgressBar
          progress={progressPercent / 100}
          color={colors.burntOrange}
          trackColor="rgba(255, 249, 240, 0.2)"
          height={6}
        />
      </View>

      <View style={styles.actionRow}>
        <PillButton
          title="Continuar viaje →"
          variant="primary"
          onPress={onContinue}
          size="medium"
          style={styles.button}
        />
      </View>
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: colors.forestGreen,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#302619',
    borderColor: '#784620',
  },
  title: {
    marginBottom: 6,
    color: colors.softCream,
  },
  description: {
    marginBottom: 16,
    lineHeight: 18,
  },
  progressSection: {
    marginBottom: 16,
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    paddingHorizontal: 22,
  },
});

