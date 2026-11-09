import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { EditorialText } from './EditorialText';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'soft';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  iconRight,
  iconLeft,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'medium',
  style,
}) => {
  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return '#DFD8CC';
    switch (variant) {
      case 'primary':
        return pressed ? colors.action.primaryPressed : colors.action.primary;
      case 'secondary':
        return pressed ? colors.action.secondaryPressed : colors.action.secondary;
      case 'dark':
        return pressed ? '#2E2D2A' : colors.inkBlack;
      case 'soft':
        return pressed ? '#F7DFC6' : colors.softPeach;
      case 'outline':
        return pressed ? 'rgba(23, 23, 21, 0.05)' : 'transparent';
      default:
        return colors.action.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#8E877E';
    switch (variant) {
      case 'outline':
        return colors.inkBlack;
      case 'soft':
        return colors.inkBlack;
      case 'primary':
      case 'secondary':
      case 'dark':
      default:
        return colors.text.inverse;
    }
  };

  const getBorder = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: disabled ? '#DFD8CC' : colors.inkBlack,
      };
    }
    return {};
  };

  const getSizeStyles = (): { container: ViewStyle; textVariant: keyof typeof typography } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
          textVariant: 'bodySmall',
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 28, minHeight: 54 },
          textVariant: 'headline',
        };
      case 'medium':
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 22, minHeight: 46 },
          textVariant: 'subheadline',
        };
    }
  };

  const { container: sizeContainerStyle, textVariant } = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        sizeContainerStyle,
        getBorder(),
        {
          backgroundColor: getBackgroundColor(pressed),
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          <EditorialText
            variant={textVariant as any}
            color={getTextColor()}
            style={styles.text}
          >
            {title}
          </EditorialText>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

