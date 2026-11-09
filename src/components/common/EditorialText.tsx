import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

export type TypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headline'
  | 'subheadline'
  | 'bodyLarge'
  | 'bodyRegular'
  | 'bodySmall'
  | 'statNumber'
  | 'statLabel'
  | 'caption'
  | 'readingPassage'
  | 'readingQuote'
  | 'handwritten';

interface EditorialTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const EditorialText: React.FC<EditorialTextProps> = ({
  variant = 'bodyRegular',
  color = colors.text.primary,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const variantStyle = typography[variant] || typography.bodyRegular;

  return (
    <Text
      allowFontScaling={true}
      style={[
        styles.base,
        variantStyle,
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
