import { Platform, TextStyle } from 'react-native';

/**
 * Editorial Typography System
 * Combines literary serif headings with crisp modern sans-serif interface text
 * and delicate handwritten touches.
 */

const serifFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const sansFontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const typography: Record<string, TextStyle> = {
  // Editorial Display Styles (Serif)
  displayLarge: {
    fontFamily: serifFontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: serifFontFamily,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontFamily: serifFontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },

  // Literary Reading Passages (Serif)
  readingPassage: {
    fontFamily: serifFontFamily,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  readingQuote: {
    fontFamily: serifFontFamily,
    fontSize: 19,
    lineHeight: 30,
    fontStyle: 'italic',
    fontWeight: '400',
  },

  // Interface & Content Styles (Sans)
  headline: {
    fontFamily: sansFontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subheadline: {
    fontFamily: sansFontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  bodyLarge: {
    fontFamily: sansFontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyRegular: {
    fontFamily: sansFontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: sansFontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  statNumber: {
    fontFamily: sansFontFamily,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: sansFontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  caption: {
    fontFamily: sansFontFamily,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  },

  // Handwritten / Organic Annotations
  handwritten: {
    fontFamily: serifFontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontStyle: 'italic',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
};
