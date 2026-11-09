/**
 * SpanishLearn Design System - Color Palette
 * Editorial meets Modern Educational Application
 */

export const colors = {
  // Primary Palette
  warmIvory: '#F6F0E7',
  softCream: '#FFF9F0',
  forestGreen: '#153D32',
  deepGreen: '#102E26',
  burntOrange: '#F06423',
  softPeach: '#F4B49B',
  inkBlack: '#171715',
  mutedGrey: '#858078',

  // Semantic & Extended Palette
  background: {
    canvas: '#F6F0E7',
    card: '#FFF9F0',
    cardPeach: '#FCEBE3',
    cardSage: '#E8F0EC',
    cardLavender: '#F0EEF7',
    dark: '#153D32',
    deep: '#102E26',
  },
  text: {
    primary: '#171715',
    secondary: '#858078',
    inverse: '#FFF9F0',
    brand: '#153D32',
    accent: '#F06423',
  },
  action: {
    primary: '#F06423',
    primaryPressed: '#D55418',
    secondary: '#153D32',
    secondaryPressed: '#0E2922',
    chipActive: '#153D32',
    chipInactive: '#EFE8DE',
  },
  border: {
    subtle: '#E6DCCD',
    medium: '#D3C8B7',
    strong: '#171715',
    active: '#F06423',
  },
  feedback: {
    success: '#236B56',
    successLight: '#E5EFE9',
    error: '#D55418',
    errorLight: '#FDE8E4',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    info: '#2563EB',
    infoLight: '#EFF6FF',
  },
  chart: {
    barInactive: '#EAE2D5',
    barActive: '#F06423',
    barSecondary: '#153D32',
  }
} as const;

export type ColorToken = typeof colors;
