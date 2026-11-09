import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { shadows, radii, spacing } from '../../theme/spacing';

export type CardVariant = 'cream' | 'peach' | 'sage' | 'dark' | 'ivory' | 'lavender';

interface EducationalCardProps {
  variant?: CardVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const EducationalCard: React.FC<EducationalCardProps> = ({
  variant = 'cream',
  onPress,
  style,
  children,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'peach':
        return colors.background.cardPeach;
      case 'sage':
        return colors.background.cardSage;
      case 'lavender':
        return colors.background.cardLavender;
      case 'dark':
        return colors.background.dark;
      case 'ivory':
        return colors.background.canvas;
      case 'cream':
      default:
        return colors.background.card;
    }
  };

  const getBorderColor = () => {
    if (variant === 'dark') return 'transparent';
    return colors.border.subtle;
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderRadius: radii.lg,
    borderWidth: variant === 'dark' ? 0 : 1,
    padding: spacing.md,
    ...shadows.subtlePaper,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.93, transform: [{ scale: 0.99 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
