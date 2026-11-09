import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, radii, shadows } from '../src/theme/spacing';

describe('Design System Tokens', () => {
  it('should define the primary color palette matching design specifications', () => {
    expect(colors.warmIvory).toBe('#F6F0E7');
    expect(colors.softCream).toBe('#FFF9F0');
    expect(colors.forestGreen).toBe('#153D32');
    expect(colors.deepGreen).toBe('#102E26');
    expect(colors.burntOrange).toBe('#F06423');
    expect(colors.softPeach).toBe('#F4B49B');
    expect(colors.inkBlack).toBe('#171715');
    expect(colors.mutedGrey).toBe('#858078');
  });

  it('should define editorial serif and sans typography variants', () => {
    expect(typography.displayLarge).toBeDefined();
    expect(typography.displayMedium).toBeDefined();
    expect(typography.readingPassage).toBeDefined();
    expect(typography.headline).toBeDefined();
    expect(typography.statNumber).toBeDefined();
  });

  it('should define consistent radii, spacing, and shadows', () => {
    expect(radii.lg).toBe(20);
    expect(radii.full).toBe(9999);
    expect(spacing.md).toBe(16);
    expect(shadows.subtlePaper).toBeDefined();
  });
});

