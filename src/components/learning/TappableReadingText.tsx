import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { EditorialText } from '../common/EditorialText';
import { PillButton } from '../common/PillButton';
import { colors } from '../../theme/colors';
import { Badge } from '../common/Badge';

interface TappableReadingTextProps {
  paragraphs: string[];
  fontSizeMultiplier?: number;
  glossary?: Record<string, { translation: string; phonetic: string; notes?: string }>;
  onSaveWord?: (word: string, translation: string) => void;
}

export const TappableReadingText: React.FC<TappableReadingTextProps> = ({
  paragraphs,
  fontSizeMultiplier = 1,
  glossary = {},
  onSaveWord,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cleanWord = (raw: string): string => {
    return raw.replace(/[.,/#!$%^&*;:{}=\-_`~()«»""'']/g, '').toLowerCase().trim();
  };

  const handleWordPress = (rawWord: string) => {
    const cleaned = cleanWord(rawWord);
    if (!cleaned) return;
    setSelectedWord(cleaned);
    setSavedSuccess(false);
    setModalVisible(true);
  };

  const currentGlossaryEntry = selectedWord ? glossary[selectedWord] : null;

  const baseFontSize = 17 * fontSizeMultiplier;
  const baseLineHeight = 28 * fontSizeMultiplier;

  return (
    <View style={styles.container}>
      {paragraphs.map((paragraph, pIdx) => {
        const words = paragraph.split(' ');
        return (
          <View key={`p-${pIdx}`} style={styles.paragraphContainer}>
            <EditorialText
              variant="readingPassage"
              style={[
                styles.paragraph,
                { fontSize: baseFontSize, lineHeight: baseLineHeight },
              ]}
            >
              {words.map((word, wIdx) => {
                const cleaned = cleanWord(word);
                const hasGlossary = Boolean(glossary[cleaned]);

                return (
                  <Pressable
                    key={`w-${pIdx}-${wIdx}`}
                    onPress={() => handleWordPress(word)}
                    hitSlop={4}
                    style={({ pressed }) => [
                      styles.wordPressable,
                      pressed && styles.wordPressed,
                      hasGlossary && styles.glossaryWordHighlight,
                    ]}
                  >
                    <EditorialText
                      variant="readingPassage"
                      color={hasGlossary ? colors.forestGreen : colors.text.primary}
                      style={{
                        fontSize: baseFontSize,
                        lineHeight: baseLineHeight,
                        fontWeight: hasGlossary ? '500' : '400',
                      }}
                    >
                      {word + ' '}
                    </EditorialText>
                  </Pressable>
                );
              })}
            </EditorialText>
          </View>
        );
      })}

      {/* Translation & Vocabulary Popover Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.popoverCard}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.popoverHeader}>
              <View>
                <EditorialText variant="displaySmall" color={colors.text.primary}>
                  {selectedWord}
                </EditorialText>
                {currentGlossaryEntry && (
                  <EditorialText variant="caption" color={colors.forestGreen}>
                    🔊 {currentGlossaryEntry.phonetic}
                  </EditorialText>
                )}
              </View>
              <Badge label="Glosario" variant="peach" />
            </View>

            <View style={styles.popoverBody}>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Traducción:
              </EditorialText>
              <EditorialText
                variant="headline"
                color={colors.burntOrange}
                style={styles.popoverTranslation}
              >
                {currentGlossaryEntry?.translation || 'Palabra seleccionada'}
              </EditorialText>

              {currentGlossaryEntry?.notes && (
                <EditorialText
                  variant="bodySmall"
                  color={colors.text.secondary}
                  style={styles.popoverNotes}
                >
                  💡 {currentGlossaryEntry.notes}
                </EditorialText>
              )}
            </View>

            <View style={styles.popoverFooter}>
              <PillButton
                title={savedSuccess ? '✓ Guardada' : 'Guardar en vocabulario'}
                variant={savedSuccess ? 'secondary' : 'primary'}
                onPress={() => {
                  if (selectedWord && currentGlossaryEntry) {
                    onSaveWord?.(selectedWord, currentGlossaryEntry.translation);
                    setSavedSuccess(true);
                  }
                }}
                size="small"
                fullWidth
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  paragraphContainer: {
    marginBottom: 20,
  },
  paragraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordPressable: {
    borderRadius: 4,
  },
  wordPressed: {
    backgroundColor: '#F5C7A9',
  },
  glossaryWordHighlight: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.softPeach,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 23, 21, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popoverCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.softCream,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: '#171715',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  popoverBody: {
    marginBottom: 18,
    gap: 4,
  },
  popoverTranslation: {
    fontWeight: '700',
  },
  popoverNotes: {
    marginTop: 6,
    fontStyle: 'italic',
  },
  popoverFooter: {
    marginTop: 6,
  },
});

