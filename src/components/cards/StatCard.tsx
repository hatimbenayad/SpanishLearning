import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { EducationalCard, CardVariant } from './EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { colors } from '../../theme/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconBgColor = 'rgba(23, 23, 21, 0.05)',
  variant = 'cream',
  style,
  onPress,
}) => {
  return (
    <EducationalCard
      variant={variant}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      </View>
      <View style={styles.content}>
        <EditorialText
          variant="statLabel"
          color={colors.text.secondary}
          style={styles.label}
        >
          {label}
        </EditorialText>
        <EditorialText
          variant="statNumber"
          color={colors.text.primary}
          style={styles.value}
        >
          {value}
        </EditorialText>
      </View>
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: 125,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 2,
  },
  label: {
    textTransform: 'capitalize',
  },
  value: {
    fontWeight: '700',
  },
});

