import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { TappableReadingText } from '../../components/learning/TappableReadingText';
import { ExerciseCard } from '../../components/learning/ExerciseCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { colors } from '../../theme/colors';
import { readingLibrary } from '../../data/reading';
import { ReadingMaterial, CEFRLevel } from '../../types';
import { LearningService } from '../../services/LearningService';

interface ReadingScreenProps {
  onBack?: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ onBack }) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0); // 0.85, 1.0, 1.2
  const [readingProgress, setReadingProgress] = useState(0.4);

  const learningService = LearningService.getInstance();
  const filteredStories = readingLibrary.filter(s =>
    selectedLevelFilter === 'ALL' ? true : s.cefrLevel === selectedLevelFilter
  );
  const currentStory: ReadingMaterial = filteredStories[selectedStoryIndex] || filteredStories[0] || readingLibrary[0];

  const paragraphs = currentStory.fullText.split('\n\n').filter(p => p.trim().length > 0);

  const handleSaveWord = (word: string, translation: string) => {
    const entry = currentStory.translationGlossary[word.toLowerCase()];
    learningService.saveWordFromReader(
      word,
      translation,
      entry?.phonetic || '[—]',
      currentStory.cefrLevel,
      currentStory.title
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Editorial Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftNav}>
          {onBack && (
            <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
              <EditorialText variant="bodySmall" color={colors.text.secondary}>
                ← Volver
              </EditorialText>
            </Pressable>
          )}
          <Badge label={currentStory.cefrLevel} variant="forest" />
        </View>

        {/* Font Size Adjusters */}
        <View style={styles.fontControls}>
          <Pressable
            onPress={() => setFontSizeMultiplier(Math.max(0.85, fontSizeMultiplier - 0.1))}
            style={styles.fontBtn}
          >
            <EditorialText variant="bodySmall" color={colors.text.primary} style={{ fontWeight: '700' }}>
              A-
            </EditorialText>
          </Pressable>
          <Pressable
            onPress={() => setFontSizeMultiplier(Math.min(1.35, fontSizeMultiplier + 0.1))}
            style={styles.fontBtn}
          >
            <EditorialText variant="bodyRegular" color={colors.text.primary} style={{ fontWeight: '700' }}>
              A+
            </EditorialText>
          </Pressable>
        </View>
      </View>

      {/* Progress Track */}
      <ProgressBar
        progress={readingProgress}
        color={colors.burntOrange}
        trackColor="#EAE2D5"
        height={3}
      />

      {/* CEFR Level Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.storySelector, { paddingBottom: 2 }]}
      >
        {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map(lvl => {
          const isSelected = selectedLevelFilter === lvl;
          return (
            <Pressable
              key={lvl}
              onPress={() => {
                setSelectedLevelFilter(lvl);
                setSelectedStoryIndex(0);
              }}
              style={[
                styles.storyPill,
                {
                  backgroundColor: isSelected ? colors.burntOrange : '#FFF9F0',
                  borderColor: isSelected ? colors.burntOrange : colors.border.subtle,
                },
              ]}
            >
              <EditorialText
                variant="caption"
                color={isSelected ? colors.text.inverse : colors.text.secondary}
                style={{ fontWeight: isSelected ? '700' : '500' }}
              >
                {lvl === 'ALL' ? 'Todos' : `Nivel ${lvl}`}
              </EditorialText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Story Selector if multiple stories exist */}
      {filteredStories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storySelector}
        >
          {filteredStories.map((story, idx) => {
            const isSelected = idx === selectedStoryIndex;
            return (
              <Pressable
                key={story.id}
                onPress={() => setSelectedStoryIndex(idx)}
                style={[
                  styles.storyPill,
                  isSelected ? styles.storyPillActive : styles.storyPillInactive,
                ]}
              >
                <EditorialText
                  variant="caption"
                  color={isSelected ? colors.text.inverse : colors.text.primary}
                  style={{ fontWeight: isSelected ? '700' : '500' }}
                >
                  {story.cefrLevel} • {story.title.length > 22 ? story.title.substring(0, 22) + '...' : story.title}
                </EditorialText>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Book Reading Canvas */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Story Header */}
        <View style={styles.storyHeader}>
          <EditorialText variant="displayMedium" color={colors.text.primary} style={styles.storyTitle}>
            {currentStory.title}
          </EditorialText>

          <View style={styles.metaRow}>
            <EditorialText variant="caption" color={colors.forestGreen} style={{ fontWeight: '600' }}>
              ✍️ {currentStory.author}
            </EditorialText>
            <EditorialText variant="caption" color={colors.text.secondary}>
              • ⏱ {currentStory.durationMinutes} min • {currentStory.wordCount} palabras
            </EditorialText>
          </View>

          <View style={styles.tipBanner}>
            <EditorialText variant="caption" color={colors.burntOrange}>
              💡 Toca cualquier palabra subrayada para ver su traducción y pronunciación al instante.
            </EditorialText>
          </View>
        </View>

        {/* Tappable Interactive Text Engine */}
        <TappableReadingText
          paragraphs={paragraphs}
          fontSizeMultiplier={fontSizeMultiplier}
          glossary={currentStory.translationGlossary}
          onSaveWord={handleSaveWord}
        />

        {/* Provenance & License */}
        <View style={styles.provenanceBox}>
          <EditorialText variant="caption" color={colors.text.secondary}>
            Fuente: {currentStory.source} • Licencia: {currentStory.license}
          </EditorialText>
        </View>

        {/* Reading Comprehension Check */}
        <View style={styles.comprehensionSection}>
          <EditorialText variant="headline" color={colors.text.primary} style={styles.compTitle}>
            Comprobación de lectura
          </EditorialText>
          {currentStory.comprehensionQuestions.map(q => (
            <ExerciseCard
              key={q.id}
              exercise={q}
              onComplete={isCorrect => {
                if (isCorrect) setReadingProgress(1.0);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {},
  fontControls: {
    flexDirection: 'row',
    backgroundColor: '#EBE2D4',
    borderRadius: 9999,
    padding: 2,
    gap: 4,
  },
  fontBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9999,
    backgroundColor: '#FFF9F0',
  },
  storySelector: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  storyPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  storyPillActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  storyPillInactive: {
    backgroundColor: '#FFF9F0',
    borderColor: colors.border.subtle,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  storyHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    paddingBottom: 16,
    gap: 8,
  },
  storyTitle: {
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipBanner: {
    backgroundColor: '#FFF4EE',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.burntOrange,
    marginTop: 6,
  },
  provenanceBox: {
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  comprehensionSection: {
    marginTop: 24,
    gap: 14,
  },
  compTitle: {
    fontWeight: '700',
  },
});

