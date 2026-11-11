import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { Flashcard } from '../../components/learning/Flashcard';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { VocabularyItem, FSRSRating } from '../../types';
import { LearningService } from '../../services/LearningService';

interface VocabularyScreenProps {
  onBack?: () => void;
}

export const VocabularyScreen: React.FC<VocabularyScreenProps> = ({ onBack }) => {
  const learningService = LearningService.getInstance();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() =>
    learningService.getVocabulary()
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'A1' | 'A2' | 'B1' | 'B2'>('all');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'browser'>('flashcards');

  const filteredWords = vocabulary.filter(w => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.topic.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'favorites') return w.isFavorite;
    if (['A1', 'A2', 'B1', 'B2'].includes(selectedFilter)) {
      return w.cefrLevel === selectedFilter;
    }
    return true;
  });

  const currentFlashcard = filteredWords[activeWordIndex] || filteredWords[0];

  const handleRate = (rating: FSRSRating) => {
    if (!currentFlashcard) return;
    learningService.rateVocabularyWord(currentFlashcard.id, rating);
    // advance to next card
    if (activeWordIndex < filteredWords.length - 1) {
      setActiveWordIndex(activeWordIndex + 1);
    } else {
      setActiveWordIndex(0); // loop
    }
  };

  const handleToggleFavorite = (id: string) => {
    learningService.toggleFavoriteWord(id);
    setVocabulary([...learningService.getVocabulary()]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <EditorialText variant="bodySmall" color={colors.text.secondary}>
              ← Volver
            </EditorialText>
          </Pressable>
        )}
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Vocabulario &amp; Repaso
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Sistema FSRS de repetición espaciada
        </EditorialText>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <Pressable
          onPress={() => setActiveTab('flashcards')}
          style={[styles.modeTab, activeTab === 'flashcards' && styles.modeTabActive]}
        >
          <EditorialText
            variant="caption"
            color={activeTab === 'flashcards' ? colors.text.inverse : colors.text.secondary}
            style={{ fontWeight: '700' }}
          >
            Modo Tarjetas (FSRS)
          </EditorialText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('browser')}
          style={[styles.modeTab, activeTab === 'browser' && styles.modeTabActive]}
        >
          <EditorialText
            variant="caption"
            color={activeTab === 'browser' ? colors.text.inverse : colors.text.secondary}
            style={{ fontWeight: '700' }}
          >
            Banco de Palabras ({filteredWords.length})
          </EditorialText>
        </Pressable>
      </View>

      {/* CEFR & Favorites Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filterPills, { paddingHorizontal: 20, marginBottom: 12 }]}
      >
        {(['all', 'favorites', 'A1', 'A2', 'B1', 'B2'] as const).map(filter => {
          const isActive = selectedFilter === filter;
          const labels: Record<string, string> = {
            all: 'Todas',
            favorites: '★ Guardadas',
            A1: 'Nivel A1',
            A2: 'Nivel A2',
            B1: 'Nivel B1',
            B2: 'Nivel B2',
          };
          return (
            <Pressable
              key={filter}
              onPress={() => {
                setSelectedFilter(filter);
                setActiveWordIndex(0);
              }}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}
            >
              <EditorialText
                variant="caption"
                color={isActive ? colors.text.inverse : colors.text.secondary}
                style={{ fontWeight: isActive ? '700' : '500' }}
              >
                {labels[filter]}
              </EditorialText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'flashcards' ? (
          <View style={styles.flashcardSection}>
            {filteredWords.length > 0 && currentFlashcard ? (
              <>
                <View style={styles.cardCounterRow}>
                  <EditorialText variant="caption" color={colors.text.secondary}>
                    Tarjeta {activeWordIndex + 1} de {filteredWords.length}
                  </EditorialText>
                  <Pressable
                    onPress={() => {
                      if (activeWordIndex < filteredWords.length - 1) {
                        setActiveWordIndex(activeWordIndex + 1);
                      } else {
                        setActiveWordIndex(0);
                      }
                    }}
                  >
                    <EditorialText variant="caption" color={colors.burntOrange}>
                      Saltar palabra →
                    </EditorialText>
                  </Pressable>
                </View>

                <Flashcard
                  key={currentFlashcard.id}
                  item={currentFlashcard}
                  onRate={handleRate}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            ) : (
              <EducationalCard variant="cream" style={styles.emptyState}>
                <EditorialText variant="subheadline" color={colors.text.primary} align="center">
                  No hay palabras en este filtro
                </EditorialText>
              </EducationalCard>
            )}
          </View>
        ) : (
          <View style={styles.browserSection}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <EditorialText style={styles.searchIcon}>🔍</EditorialText>
              <TextInput
                placeholder="Buscar palabra, tema o traducción..."
                placeholderTextColor={colors.mutedGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <EditorialText style={styles.clearIcon}>✕</EditorialText>
                </Pressable>
              )}
            </View>

            {/* Word List */}
            <View style={styles.wordList}>
              {filteredWords.map(item => (
                <EducationalCard
                  key={item.id}
                  variant="cream"
                  style={styles.wordCard}
                >
                  <View style={styles.wordTop}>
                    <View style={styles.wordMain}>
                      <EditorialText variant="headline" color={colors.text.primary}>
                        {item.word}
                      </EditorialText>
                      <EditorialText variant="caption" color={colors.forestGreen}>
                        {item.phonetic}
                      </EditorialText>
                    </View>
                    <Pressable
                      onPress={() => handleToggleFavorite(item.id)}
                      hitSlop={8}
                    >
                      <EditorialText style={styles.starIcon}>
                        {item.isFavorite ? '★' : '☆'}
                      </EditorialText>
                    </Pressable>
                  </View>

                  <EditorialText variant="bodySmall" color={colors.burntOrange} style={styles.wordTrans}>
                    {item.translation}
                  </EditorialText>

                  <EditorialText variant="caption" color={colors.text.secondary} style={styles.wordDef}>
                    {item.definition}
                  </EditorialText>

                  <View style={styles.wordBottomRow}>
                    <Badge label={item.cefrLevel} variant="peach" />
                    <Badge label={item.partOfSpeech} variant="neutral" />
                  </View>
                </EducationalCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backBtn: {
    marginBottom: 6,
  },
  modeTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#EBE2D4',
    borderRadius: 9999,
    padding: 3,
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9999,
  },
  modeTabActive: {
    backgroundColor: colors.forestGreen,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  flashcardSection: {
    gap: 12,
  },
  cardCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  browserSection: {
    gap: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.mutedGrey,
  },
  filterPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  filterChipActive: {
    backgroundColor: colors.burntOrange,
    borderColor: colors.burntOrange,
  },
  wordList: {
    gap: 12,
  },
  wordCard: {
    padding: 16,
    gap: 6,
  },
  wordTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordMain: {
    gap: 2,
  },
  starIcon: {
    fontSize: 22,
    color: colors.burntOrange,
  },
  wordTrans: {
    fontWeight: '700',
  },
  wordDef: {
    lineHeight: 18,
  },
  wordBottomRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
});

