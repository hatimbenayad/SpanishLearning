import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Text as SvgText,
  Line,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

interface ReaderIllustrationProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const ReaderIllustration: React.FC<ReaderIllustrationProps> = ({
  width = 280,
  height = 240,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 280 240" fill="none">
        {/* Background ambient decorative shapes & handwritten sparks */}
        <G stroke={colors.burntOrange} strokeWidth="2" strokeLinecap="round">
          {/* Sparkles / starburst top left */}
          <Line x1="40" y1="25" x2="40" y2="15" />
          <Line x1="33" y1="20" x2="47" y2="20" />
          <Line x1="35" y1="15" x2="45" y2="25" />

          {/* Sparkles top right */}
          <Line x1="240" y1="35" x2="240" y2="25" />
          <Line x1="233" y1="30" x2="247" y2="30" />
        </G>

        {/* Floating Book 1 (Left - Deep Green "Don Quijote") */}
        <G transform="rotate(-12 55 70)">
          <Rect
            x="30"
            y="40"
            width="50"
            height="70"
            rx="6"
            fill={colors.deepGreen}
            stroke={colors.inkBlack}
            strokeWidth="2"
          />
          <Rect x="35" y="45" width="40" height="60" rx="3" fill="#143A30" />
          <Circle cx="55" cy="65" r="8" fill="#F4B49B" opacity={0.6} />
          <SvgText
            x="55"
            y="88"
            fontSize="6"
            fill={colors.softCream}
            textAnchor="middle"
            fontWeight="bold"
          >
            QUIJOTE
          </SvgText>
        </G>

        {/* Floating Book 2 (Top Right - Forest Green "Cien Años") */}
        <G transform="rotate(8 215 50)">
          <Rect
            x="190"
            y="25"
            width="52"
            height="72"
            rx="6"
            fill="#325E50"
            stroke={colors.inkBlack}
            strokeWidth="2"
          />
          <Line x1="198" y1="40" x2="234" y2="40" stroke="#F4B49B" strokeWidth="2" />
          <Circle cx="216" cy="55" r="4" fill="#F06423" />
          <SvgText
            x="216"
            y="72"
            fontSize="6"
            fill={colors.softCream}
            textAnchor="middle"
            fontWeight="bold"
          >
            MACONDO
          </SvgText>
        </G>

        {/* Floating Book 3 (Bottom Left - Soft Peach "Poesía") */}
        <G transform="rotate(15 45 155)">
          <Rect
            x="20"
            y="125"
            width="46"
            height="62"
            rx="5"
            fill={colors.softPeach}
            stroke={colors.inkBlack}
            strokeWidth="2"
          />
          <SvgText
            x="43"
            y="155"
            fontSize="7"
            fill={colors.inkBlack}
            textAnchor="middle"
            fontWeight="bold"
          >
            POESÍA
          </SvgText>
          <Path
            d="M 33 168 Q 43 162 53 168"
            stroke={colors.inkBlack}
            strokeWidth="1.5"
            fill="none"
          />
        </G>

        {/* Floating Book 4 (Right - Burnt Orange "Vocabulario") */}
        <G transform="rotate(-10 230 145)">
          <Rect
            x="205"
            y="115"
            width="48"
            height="66"
            rx="5"
            fill={colors.burntOrange}
            stroke={colors.inkBlack}
            strokeWidth="2"
          />
          <Circle cx="229" cy="140" r="10" fill="#FFF9F0" opacity={0.3} />
          <SvgText
            x="229"
            y="160"
            fontSize="6.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            PALABRAS
          </SvgText>
        </G>

        {/* Central Reader Character */}
        {/* Hair Bun & Back Hair */}
        <Circle cx="140" cy="85" r="32" fill={colors.inkBlack} />
        <Circle cx="140" cy="52" r="16" fill={colors.inkBlack} />
        {/* Bun pin */}
        <Line x1="125" y1="48" x2="155" y2="54" stroke="#F4B49B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Face Silhouette (Warm tone) */}
        <Path
          d="M 124 88 Q 140 115 156 88 Q 156 68 140 68 Q 124 68 124 88 Z"
          fill="#F5D5C6"
          stroke={colors.inkBlack}
          strokeWidth="2"
        />

        {/* Eyes looking down at book */}
        <Path d="M 132 86 Q 135 90 138 86" stroke={colors.inkBlack} strokeWidth="2" strokeLinecap="round" fill="none" />
        <Path d="M 144 86 Q 147 90 150 86" stroke={colors.inkBlack} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Rosy cheeks */}
        <Circle cx="129" cy="92" r="3" fill="#F4B49B" opacity={0.8} />
        <Circle cx="151" cy="92" r="3" fill="#F4B49B" opacity={0.8} />

        {/* Hair strands frame face */}
        <Path
          d="M 122 75 Q 125 95 130 92"
          stroke={colors.inkBlack}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 158 75 Q 155 95 150 92"
          stroke={colors.inkBlack}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sweater / Shoulders (Ink Black) */}
        <Path
          d="M 98 220 Q 98 140 140 140 Q 182 140 182 220 Z"
          fill={colors.inkBlack}
        />

        {/* Cozy White/Cream Knees or Collar */}
        <Path
          d="M 115 220 Q 140 195 165 220 Z"
          fill="#FFF9F0"
          stroke={colors.inkBlack}
          strokeWidth="2"
        />

        {/* Open Orange Book in Reader's Hands */}
        <G transform="translate(0, 10)">
          {/* Left page */}
          <Path
            d="M 140 140 C 130 136 100 136 90 144 L 90 196 C 100 188 130 188 140 192 Z"
            fill={colors.burntOrange}
            stroke={colors.inkBlack}
            strokeWidth="2.5"
          />
          {/* Right page */}
          <Path
            d="M 140 140 C 150 136 180 136 190 144 L 190 196 C 180 188 150 188 140 192 Z"
            fill={colors.burntOrange}
            stroke={colors.inkBlack}
            strokeWidth="2.5"
          />
          {/* Book spine curve */}
          <Line x1="140" y1="140" x2="140" y2="192" stroke={colors.inkBlack} strokeWidth="2.5" />

          {/* Book text titles inside page */}
          <SvgText
            x="115"
            y="158"
            fontSize="6.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            BUENAS
          </SvgText>
          <SvgText
            x="115"
            y="168"
            fontSize="6.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            HISTORIAS
          </SvgText>

          <SvgText
            x="165"
            y="158"
            fontSize="6.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            MEJORES
          </SvgText>
          <SvgText
            x="165"
            y="168"
            fontSize="6.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            PERSONAS
          </SvgText>

          {/* Small heart doodle in book */}
          <Path
            d="M 165 178 C 162 175 158 178 165 184 C 172 178 168 175 165 178 Z"
            fill="#FFF9F0"
          />

          {/* Thumbs holding book */}
          <Circle cx="92" cy="172" r="7" fill="#F5D5C6" stroke={colors.inkBlack} strokeWidth="1.5" />
          <Circle cx="188" cy="172" r="7" fill="#F5D5C6" stroke={colors.inkBlack} strokeWidth="1.5" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

