import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Text as SvgText,
  Line,
  Ellipse,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

interface BooksStackIllustrationProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const BooksStackIllustration: React.FC<BooksStackIllustrationProps> = ({
  width = 240,
  height = 180,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 240 180" fill="none">
        {/* House plant in background */}
        <G transform="translate(140, 15)">
          {/* Leaves */}
          <Path
            d="M 25 35 C 10 10 20 -5 35 5 C 38 18 35 28 25 35 Z"
            fill={colors.forestGreen}
            stroke={colors.inkBlack}
            strokeWidth="1.5"
          />
          <Path
            d="M 30 35 C 45 10 60 15 55 30 C 45 38 35 38 30 35 Z"
            fill="#236B56"
            stroke={colors.inkBlack}
            strokeWidth="1.5"
          />
          <Path
            d="M 20 35 C -5 20 -2 38 10 40 C 15 40 18 38 20 35 Z"
            fill="#1B4F40"
            stroke={colors.inkBlack}
            strokeWidth="1.5"
          />
          {/* Plant Pot */}
          <Rect
            x="12"
            y="35"
            width="26"
            height="22"
            rx="3"
            fill="#FFF9F0"
            stroke={colors.inkBlack}
            strokeWidth="1.5"
          />
          <Line x1="16" y1="42" x2="16" y2="52" stroke={colors.burntOrange} strokeWidth="1.5" />
          <Line x1="25" y1="42" x2="25" y2="52" stroke={colors.burntOrange} strokeWidth="1.5" />
          <Line x1="34" y1="42" x2="34" y2="52" stroke={colors.burntOrange} strokeWidth="1.5" />
        </G>

        {/* Stack of 4 Books */}
        <G transform="translate(100, 50)">
          {/* Book 1 (Top - Burnt Orange) */}
          <Rect
            x="0"
            y="10"
            width="120"
            height="18"
            rx="3"
            fill={colors.burntOrange}
            stroke={colors.inkBlack}
            strokeWidth="1.8"
          />
          <Line x1="10" y1="12" x2="10" y2="26" stroke="#FFF9F0" strokeWidth="1.5" />
          <SvgText
            x="65"
            y="23"
            fontSize="7.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            UN PASO MÁS
          </SvgText>

          {/* Book 2 (Soft Peach) */}
          <Rect
            x="-6"
            y="30"
            width="128"
            height="19"
            rx="3"
            fill={colors.softPeach}
            stroke={colors.inkBlack}
            strokeWidth="1.8"
          />
          <Line x1="6" y1="32" x2="6" y2="47" stroke={colors.inkBlack} strokeWidth="1.5" />
          <SvgText
            x="60"
            y="43"
            fontSize="7.5"
            fill={colors.inkBlack}
            textAnchor="middle"
            fontWeight="bold"
          >
            HÁBITOS DIARIOS
          </SvgText>

          {/* Book 3 (Deep Green) */}
          <Rect
            x="-12"
            y="51"
            width="138"
            height="21"
            rx="3"
            fill={colors.deepGreen}
            stroke={colors.inkBlack}
            strokeWidth="1.8"
          />
          <Line x1="2" y1="53" x2="2" y2="70" stroke="#F4B49B" strokeWidth="1.5" />
          <SvgText
            x="62"
            y="65"
            fontSize="8"
            fill={colors.softCream}
            textAnchor="middle"
            fontWeight="bold"
          >
            BIBLIOTECA SECRETA
          </SvgText>

          {/* Book 4 (Bottom - Sage Cream) */}
          <Rect
            x="-18"
            y="74"
            width="146"
            height="22"
            rx="3"
            fill="#EAE2D5"
            stroke={colors.inkBlack}
            strokeWidth="1.8"
          />
          <Line x1="-4" y1="76" x2="-4" y2="94" stroke={colors.forestGreen} strokeWidth="1.5" />
          <SvgText
            x="60"
            y="89"
            fontSize="7.5"
            fill={colors.forestGreen}
            textAnchor="middle"
            fontWeight="bold"
          >
            ATLAS DEL ESPAÑOL
          </SvgText>
        </G>

        {/* Coffee Mug on Left (Terracotta orange with warm message) */}
        <G transform="translate(18, 90)">
          {/* Mug handle */}
          <Path
            d="M 52 20 C 66 20 66 42 52 42"
            fill="none"
            stroke={colors.inkBlack}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Mug body */}
          <Rect
            x="10"
            y="14"
            width="44"
            height="42"
            rx="5"
            fill={colors.burntOrange}
            stroke={colors.inkBlack}
            strokeWidth="2.2"
          />
          {/* Rim ellipse */}
          <Ellipse cx="32" cy="14" rx="22" ry="5" fill="#D55418" stroke={colors.inkBlack} strokeWidth="1.5" />
          <Ellipse cx="32" cy="14" rx="18" ry="3.5" fill="#4A2614" />

          {/* Mug handwritten inscription */}
          <SvgText
            x="32"
            y="29"
            fontSize="5.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            Poco a poco
          </SvgText>
          <SvgText
            x="32"
            y="37"
            fontSize="5.5"
            fill="#FFF9F0"
            textAnchor="middle"
            fontWeight="bold"
          >
            se aprende
          </SvgText>
          {/* Heart */}
          <Path
            d="M 32 44 C 30 42 27 44 32 48 C 37 44 34 42 32 44 Z"
            fill="#FFF9F0"
          />

          {/* Steam wisps */}
          <Path
            d="M 26 6 Q 22 0 28 -6"
            stroke={colors.mutedGrey}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 36 8 Q 40 2 34 -4"
            stroke={colors.mutedGrey}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </G>

        {/* Table line underneath */}
        <Line x1="10" y1="147" x2="230" y2="147" stroke={colors.inkBlack} strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="20" y1="152" x2="220" y2="152" stroke="#E6DCCD" strokeWidth="2" strokeLinecap="round" />
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
