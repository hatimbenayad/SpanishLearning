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
import { EducationalCard } from '../../components/cards/EducationalCard';
import { PillButton } from '../../components/common/PillButton';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { LearningService } from '../../services/LearningService';
import { WritingDraft } from '../../types';

interface WritingPrompt {
  id: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  prompt: string;
  suggestedVocab: string[];
  minWords: number;
}

const writingPrompts: WritingPrompt[] = [
  {
    id: 'write-1',
    cefrLevel: 'A1',
    title: 'Mi rutina de la mañana',
    prompt: 'Describe qué haces por las mañanas: a qué hora te levantas, qué desayunas y cómo comienzas tu jornada.',
    suggestedVocab: ['me levanto', 'desayuno', 'café con leche', 'después', 'salgo de casa'],
    minWords: 30,
  },
  {
    id: 'write-2',
    cefrLevel: 'A2',
    title: 'Un viaje inolvidable por España',
    prompt: 'Escribe sobre una ciudad española que visitaste o te gustaría visitar. ¿Qué lugares viste y qué comiste?',
    suggestedVocab: ['viajé a', 'la plaza mayor', 'monumentos', 'probé', 'fue maravilloso'],
    minWords: 50,
  },
  {
    id: 'write-3',
    cefrLevel: 'B1',
    title: 'La costumbre de la sobremesa',
    prompt: 'Reflexiona sobre la importancia cultural de compartir tiempo con la familia tras comer en la cultura hispana.',
    suggestedVocab: ['tradición', 'conversación', 'tranquilidad', 'tiempo de calidad', 'en mi opinión'],
    minWords: 75,
  },
];

interface WritingPracticeScreenProps {
  onBack?: () => void;
}

export const WritingPracticeScreen: React.FC<WritingPracticeScreenProps> = ({ onBack }) => {
  const learningService = LearningService.getInstance();
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [draftText, setDraftText] = useState('');
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<WritingDraft[]>(() =>
    learningService.getWritingDrafts()
  );
  const [isSaved, setIsSaved] = useState(false);

  const prompt = writingPrompts[selectedPromptIndex];
  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;

  const handleInsertWord = (word: string) => {
    setDraftText(prev => (prev ? `${prev} ${word}` : word));
  };

  const handleSaveDraft = async () => {
    if (!draftText.trim()) return;
    const id = activeDraftId || `draft-${prompt.id}-${Date.now()}`;
    const saved = await learningService.saveWritingDraft({
      id,
      promptId: prompt.id,
      title: prompt.title,
      cefrLevel: prompt.cefrLevel,
      text: draftText.trim(),
      wordCount,
    });
    setActiveDraftId(saved.id);
    setSavedDrafts(learningService.getWritingDrafts());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDeleteDraft = async (id: string) => {
    await learningService.deleteWritingDraft(id);
    setSavedDrafts(learningService.getWritingDrafts());
    if (activeDraftId === id) {
      setActiveDraftId(null);
      setDraftText('');
    }
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
          Taller de Escritura
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Composición guiada por nivel MCER con sugerencias léxicas
        </EditorialText>
      </View>

      {/* Prompts Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promptsCarousel}
      >
        {writingPrompts.map((p, idx) => {
          const isSelected = idx === selectedPromptIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() => {
                setSelectedPromptIndex(idx);
                setDraftText('');
                setActiveDraftId(null);
              }}
              style={[
                styles.promptPill,
                isSelected ? styles.promptPillActive : styles.promptPillInactive,
              ]}
            >
              <EditorialText
                variant="caption"
                color={isSelected ? colors.text.inverse : colors.text.primary}
                style={{ fontWeight: isSelected ? '700' : '500' }}
              >
                {p.cefrLevel} • {p.title}
              </EditorialText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Prompt Card */}
        <EducationalCard variant="cream" style={styles.promptCard}>
          <View style={styles.promptTopRow}>
            <Badge label={`Nivel ${prompt.cefrLevel}`} variant="forest" />
            <EditorialText variant="caption" color={colors.text.secondary}>
              Meta: {prompt.minWords} palabras
            </EditorialText>
          </View>

          <EditorialText variant="displaySmall" color={colors.text.primary}>
            {prompt.title}
          </EditorialText>

          <EditorialText variant="bodyRegular" color={colors.text.primary} style={{ lineHeight: 22 }}>
            {prompt.prompt}
          </EditorialText>

          {/* Suggested vocabulary chips */}
          <View style={styles.suggestedSection}>
            <EditorialText variant="caption" color={colors.forestGreen} style={{ fontWeight: '700', marginBottom: 6 }}>
              Palabras recomendadas (toca para insertar):
            </EditorialText>
            <View style={styles.chipsRow}>
              {prompt.suggestedVocab.map((v, i) => (
                <Pressable
                  key={i}
                  onPress={() => handleInsertWord(v)}
                  style={styles.vocabChip}
                >
                  <EditorialText variant="caption" color={colors.forestGreen}>
                    + {v}
                  </EditorialText>
                </Pressable>
              ))}
            </View>
          </View>
        </EducationalCard>

        {/* Composition Writing Canvas */}
        <EducationalCard variant="ivory" style={styles.canvasCard}>
          <View style={styles.canvasHeader}>
            <EditorialText variant="caption" color={colors.text.secondary}>
              TU COMPOSICIÓN:
            </EditorialText>
            <EditorialText
              variant="caption"
              color={wordCount >= prompt.minWords ? colors.feedback.success : colors.burntOrange}
              style={{ fontWeight: '700' }}
            >
              {wordCount} / {prompt.minWords} palabras
            </EditorialText>
          </View>

          <TextInput
            multiline
            placeholder="Escribe tu texto en español aquí con calma..."
            placeholderTextColor={colors.mutedGrey}
            value={draftText}
            onChangeText={setDraftText}
            style={styles.textArea}
          />

          <View style={styles.actionRow}>
            <PillButton
              title={isSaved ? '✓ Borrador guardado' : 'Guardar composición'}
              variant={isSaved ? 'secondary' : 'primary'}
              onPress={handleSaveDraft}
              disabled={wordCount === 0}
              fullWidth
            />
          </View>
        </EducationalCard>

        {/* Saved Compositions History */}
        {savedDrafts.length > 0 && (
          <View style={{ gap: 10 }}>
            <EditorialText variant="headline" color={colors.text.primary}>
              Mis composiciones guardadas ({savedDrafts.length})
            </EditorialText>
            {savedDrafts.map(draft => (
              <EducationalCard key={draft.id} variant="cream" style={{ padding: 14, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label={`${draft.cefrLevel} • ${draft.wordCount} palabras`} variant="forest" />
                  <Pressable onPress={() => handleDeleteDraft(draft.id)} hitSlop={8}>
                    <EditorialText variant="caption" color={colors.feedback.error}>
                      Eliminar
                    </EditorialText>
                  </Pressable>
                </View>
                <EditorialText variant="subheadline" color={colors.text.primary}>
                  {draft.title}
                </EditorialText>
                <EditorialText variant="bodySmall" color={colors.text.secondary} numberOfLines={3}>
                  {draft.text}
                </EditorialText>
                <Pressable
                  onPress={() => {
                    const pIdx = writingPrompts.findIndex(p => p.id === draft.promptId);
                    if (pIdx >= 0) setSelectedPromptIndex(pIdx);
                    setActiveDraftId(draft.id);
                    setDraftText(draft.text);
                  }}
                >
                  <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                    Editar borrador →
                  </EditorialText>
                </Pressable>
              </EducationalCard>
            ))}
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
    paddingBottom: 8,
  },
  backBtn: {
    marginBottom: 6,
  },
  promptsCarousel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  promptPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
  },
  promptPillActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  promptPillInactive: {
    backgroundColor: '#FFF9F0',
    borderColor: colors.border.subtle,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  promptCard: {
    padding: 20,
    gap: 12,
  },
  promptTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestedSection: {
    backgroundColor: '#E8F0EC',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vocabChip: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7DBD1',
  },
  canvasCard: {
    padding: 18,
    gap: 12,
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    minHeight: 180,
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    fontFamily: 'serif',
    lineHeight: 24,
    color: colors.text.primary,
    textAlignVertical: 'top',
  },
  actionRow: {
    marginTop: 4,
  },
});

