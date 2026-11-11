import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { VocabularyItem, FSRSRating } from '../../types';

interface FlashcardProps {
  item: VocabularyItem;
  onRate: (rating: FSRSRating) => void;
  onToggleFavorite?: (id: string) => void;
  onPronounce?: (word: string) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  item,
  onRate,
  onToggleFavorite,
  onPronounce,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Main Flashcard Body */}
      <Pressable
        onPress={() => setIsFlipped(!isFlipped)}
        style={styles.cardPressable}
      >
        <EducationalCard
          variant={isFlipped ? 'ivory' : 'cream'}
          style={styles.card}
        >
          {/* Card Top Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerBadges}>
              <Badge
                label={item.cefrLevel}
                variant="dark"
                style={styles.badge}
              />
              <Badge
                label={`${item.partOfSpeech}${item.gender ? ` (${item.gender})` : ''}`}
                variant="peach"
                style={styles.badge}
              />
            </View>

            <Pressable
              onPress={() => onToggleFavorite?.(item.id)}
              hitSlop={8}
            >
              <EditorialText style={styles.favIcon}>
                {item.isFavorite ? '★' : '☆'}
              </EditorialText>
            </Pressable>
          </View>

          {/* Front / Back Content */}
          {!isFlipped ? (
            <View style={styles.frontContent}>
              <EditorialText
                variant="displayLarge"
                color={colors.text.primary}
                align="center"
                style={styles.spanishWord}
              >
                {item.word}
              </EditorialText>

              {onPronounce ? (
                <Pressable
                  onPress={() => onPronounce(item.word)}
                  style={styles.pronounceChip}
                >
                  <EditorialText variant="caption" color={colors.forestGreen}>
                    🔊 {item.phonetic}
                  </EditorialText>
                </Pressable>
              ) : (
                <View style={styles.pronounceChip}>
                  <EditorialText variant="caption" color={colors.forestGreen}>
                    {item.phonetic}
                  </EditorialText>
                </View>
              )}

              <EditorialText
                variant="caption"
                color={colors.text.secondary}
                align="center"
                style={styles.tapCue}
              >
                Toca para girar la tarjeta y ver traducción
              </EditorialText>
            </View>
          ) : (
            <View style={styles.backContent}>
              <EditorialText
                variant="displayMedium"
                color={colors.burntOrange}
                align="center"
                style={styles.translation}
              >
                {item.translation}
              </EditorialText>

              <View style={styles.definitionBox}>
                <EditorialText
                  variant="caption"
                  color={colors.text.secondary}
                  style={styles.label}
                >
                  Definición:
                </EditorialText>
                <EditorialText
                  variant="bodyRegular"
                  color={colors.text.primary}
                >
                  {item.definition}
                </EditorialText>
              </View>

              <View style={styles.exampleBox}>
                <EditorialText
                  variant="caption"
                  color={colors.forestGreen}
                  style={styles.label}
                >
                  Ejemplo en contexto:
                </EditorialText>
                <EditorialText
                  variant="readingQuote"
                  color={colors.text.primary}
                  style={styles.exampleSentence}
                >
                  "{item.exampleSentence}"
                </EditorialText>
                <EditorialText
                  variant="bodySmall"
                  color={colors.text.secondary}
                  style={styles.exampleTranslation}
                >
                  "{item.exampleTranslation}"
                </EditorialText>
              </View>
            </View>
          )}
        </EducationalCard>
      </Pressable>

      {/* FSRS Rating Bar (Displayed once flipped) */}
      {isFlipped ? (
        <View style={styles.ratingBar}>
          <Pressable
            onPress={() => onRate(1)}
            style={[styles.ratingBtn, styles.ratingAgain]}
          >
            <EditorialText variant="caption" color="#991B1B" style={styles.ratingLabel}>
              Otra vez
            </EditorialText>
            <EditorialText variant="caption" color="#991B1B">
              &lt;10m
            </EditorialText>
          </Pressable>

          <Pressable
            onPress={() => onRate(2)}
            style={[styles.ratingBtn, styles.ratingHard]}
          >
            <EditorialText variant="caption" color="#B45309" style={styles.ratingLabel}>
              Difícil
            </EditorialText>
            <EditorialText variant="caption" color="#B45309">
              1d
            </EditorialText>
          </Pressable>

          <Pressable
            onPress={() => onRate(3)}
            style={[styles.ratingBtn, styles.ratingGood]}
          >
            <EditorialText variant="caption" color="#15803D" style={styles.ratingLabel}>
              Bien
            </EditorialText>
            <EditorialText variant="caption" color="#15803D">
              3d
            </EditorialText>
          </Pressable>

          <Pressable
            onPress={() => onRate(4)}
            style={[styles.ratingBtn, styles.ratingEasy]}
          >
            <EditorialText variant="caption" color="#1D4ED8" style={styles.ratingLabel}>
              Fácil
            </EditorialText>
            <EditorialText variant="caption" color="#1D4ED8">
              7d
            </EditorialText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.ratingPlaceholder}>
          <EditorialText variant="caption" color={colors.text.secondary} align="center">
            Pasa a la parte trasera para calificar tu memoria
          </EditorialText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cardPressable: {
    width: '100%',
  },
  card: {
    minHeight: 280,
    justifyContent: 'space-between',
    padding: 24,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  favIcon: {
    fontSize: 22,
    color: colors.burntOrange,
  },
  frontContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  spanishWord: {
    marginBottom: 12,
  },
  pronounceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EFEA',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    marginBottom: 24,
  },
  tapCue: {
    fontStyle: 'italic',
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  translation: {
    marginBottom: 6,
  },
  definitionBox: {
    backgroundColor: 'rgba(23, 23, 21, 0.03)',
    padding: 10,
    borderRadius: 10,
  },
  exampleBox: {
    backgroundColor: '#F3EFE7',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.forestGreen,
  },
  label: {
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  exampleSentence: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  exampleTranslation: {
    fontStyle: 'italic',
  },
  ratingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  ratingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  ratingLabel: {
    fontWeight: '700',
    marginBottom: 2,
  },
  ratingAgain: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  ratingHard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  ratingGood: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  ratingEasy: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  ratingPlaceholder: {
    marginTop: 16,
    paddingVertical: 10,
  },
});

