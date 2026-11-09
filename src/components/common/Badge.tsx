import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { EditorialText } from './EditorialText';

export type BadgeVariant = 'forest' | 'orange' | 'peach' | 'sage' | 'neutral' | 'dark';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'forest':
        return { bg: '#E8F0EC', text: colors.forestGreen, border: '#C7DBD1' };
      case 'orange':
        return { bg: '#FDF0E9', text: colors.burntOrange, border: '#F8D1BE' };
      case 'peach':
        return { bg: '#FDEEE8', text: '#B85022', border: '#F5CFC0' };
      case 'sage':
        return { bg: '#EDF5F0', text: '#1E5848', border: '#CCE2D6' };
      case 'dark':
        return { bg: colors.forestGreen, text: colors.softCream, border: colors.forestGreen };
      case 'neutral':
      default:
        return { bg: '#EFEAE1', text: colors.text.secondary, border: '#E0D7C9' };
    }
  };

  const { bg, text, border } = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <EditorialText variant="caption" color={text} style={styles.text}>
        {label}
      </EditorialText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
