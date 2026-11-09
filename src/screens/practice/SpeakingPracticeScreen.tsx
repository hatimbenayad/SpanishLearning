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
import { PillButton } from '../../components/common/PillButton';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';

interface SpeakingPrompt {
  id: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  spanishText: string;
  phonetic: string;
  english: string;
  tips: string;
}

const speakingPrompts: SpeakingPrompt[] = [
  {
    id: 'spk-1',
    cefrLevel: 'A1',
    title: 'En la cafetería',
    spanishText: 'Buenos días. Por favor, ¿me pone un café con leche y una tostada con tomate?',
    phonetic: '[ˈbwe-noz ˈði-as. por fa-ˈβor, me ˈpo-ne uŋ ka-ˈfe kon ˈle-tʃe i ˈu-na tos-ˈta-ða kon to-ˈma-te]',
    english: 'Good morning. Please, can I have a coffee with milk and toast with tomato?',
    tips: 'Pronuncia la "d" entre vocales con suavidad y mantén las vocales breves y limpias.',
  },
  {
    id: 'spk-2',
    cefrLevel: 'A2',
    title: 'Preguntando por el camino',
    spanishText: 'Disculpe, ¿podría decirme si la estación de tren queda muy lejos de aquí?',
    phonetic: '[diz-ˈkul-pe, po-ˈðɾi-a ðe-ˈθiɾ-me si la es-ta-ˈθjon de tɾen ˈke-ða mwi ˈle-xos de a-ˈki]',
    english: 'Excuse me, could you tell me if the train station is far from here?',
    tips: 'Entona con cortesía ascendiendo ligeramente al final de la pregunta.',
  },
  {
    id: 'spk-3',
    cefrLevel: 'B1',
    title: 'Expresando preferencias culturales',
    spanishText: 'En mi opinión, pasear por los barrios históricos al atardecer es la mejor manera de conocer España.',
    phonetic: '[en mj o-pi-ˈnjon, pa-se-ˈaɾ por loz ˈba-rjos is-ˈto-ɾi-kos al a-taɾ-ðe-ˈθeɾ es la me-ˈxoɾ ma-ˈne-ɾa...]',
    english: 'In my opinion, walking through historic neighborhoods at sunset is the best way to get to know Spain.',
    tips: 'Presta atención a la erre vibrante en "barrios" y al ritmo natural sin pausas excesivas.',
  },
];

interface SpeakingPracticeScreenProps {
  onBack?: () => void;
}

export const SpeakingPracticeScreen: React.FC<SpeakingPracticeScreenProps> = ({ onBack }) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);

  const prompt = speakingPrompts[selectedPromptIndex];

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
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
          Práctica de Pronunciación
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Modelo nativo de España, grabación y autoevaluación guiada
        </EditorialText>
      </View>

      {/* Prompts Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promptsCarousel}
      >
        {speakingPrompts.map((p, idx) => {
          const isSelected = idx === selectedPromptIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() => {
                setSelectedPromptIndex(idx);
                setIsRecording(false);
                setHasRecorded(false);
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
        <EducationalCard variant="cream" style={styles.card}>
          <View style={styles.cardHeader}>
            <Badge label={`Nivel ${prompt.cefrLevel}`} variant="forest" />
            <EditorialText variant="caption" color={colors.text.secondary}>
              {prompt.title}
            </EditorialText>
          </View>

          <EditorialText
            variant="displayMedium"
            color={colors.text.primary}
            style={styles.spanishText}
          >
            "{prompt.spanishText}"
          </EditorialText>

          <EditorialText variant="caption" color={colors.forestGreen} style={styles.phonetic}>
            🔊 Fonética: {prompt.phonetic}
          </EditorialText>

          <EditorialText variant="bodySmall" color={colors.text.secondary} style={styles.english}>
            "{prompt.english}"
          </EditorialText>

          {/* Model Audio Listen Button */}
          <View style={styles.modelAudioBox}>
            <PillButton
              title={isPlayingModel ? '⏸ Reproduciendo modelo nativo...' : '▶ Escuchar locutor nativo'}
              variant="secondary"
              onPress={() => {
                setIsPlayingModel(!isPlayingModel);
                setTimeout(() => setIsPlayingModel(false), 3000);
              }}
              size="medium"
            />
          </View>

          <View style={styles.tipsBox}>
            <EditorialText variant="caption" color={colors.burntOrange} style={{ fontWeight: '700', marginBottom: 2 }}>
              💡 Consejo de pronunciación:
            </EditorialText>
            <EditorialText variant="bodySmall" color={colors.text.primary}>
              {prompt.tips}
            </EditorialText>
          </View>
        </EducationalCard>

        {/* User Recording Area */}
        <EducationalCard variant="ivory" style={styles.recordCard}>
          <EditorialText variant="headline" color={colors.text.primary} align="center">
            {isRecording ? '🎙️ Grabando tu voz...' : hasRecorded ? 'Grabación completada' : 'Tu turno de hablar'}
          </EditorialText>

          <EditorialText variant="caption" color={colors.text.secondary} align="center">
            {isRecording
              ? 'Lee la frase en voz alta con naturalidad'
              : hasRecorded
              ? 'Escucha tu grabación y compárala con el modelo'
              : 'Presiona el botón para comenzar a grabar'}
          </EditorialText>

          <View style={styles.recordBtnContainer}>
            <Pressable
              onPress={handleToggleRecord}
              style={[
                styles.bigRecordButton,
                isRecording && styles.bigRecordButtonActive,
              ]}
            >
              <EditorialText style={{ fontSize: 32 }}>
                {isRecording ? '⏹' : '🎙️'}
              </EditorialText>
            </Pressable>
          </View>

          {hasRecorded && (
            <View style={styles.playbackRow}>
              <PillButton
                title={isPlayingUser ? '⏸ Reproduciendo...' : '▶ Escuchar mi grabación'}
                variant="outline"
                onPress={() => {
                  setIsPlayingUser(!isPlayingUser);
                  setTimeout(() => setIsPlayingUser(false), 2500);
                }}
                size="small"
              />
              <PillButton
                title="Grabar de nuevo"
                variant="dark"
                onPress={() => setHasRecorded(false)}
                size="small"
              />
            </View>
          )}
        </EducationalCard>
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
  card: {
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spanishText: {
    lineHeight: 34,
  },
  phonetic: {
    fontStyle: 'italic',
  },
  english: {
    fontStyle: 'italic',
  },
  modelAudioBox: {
    marginVertical: 4,
  },
  tipsBox: {
    backgroundColor: '#FFF4EE',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.burntOrange,
  },
  recordCard: {
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  recordBtnContainer: {
    marginVertical: 10,
  },
  bigRecordButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.burntOrange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.burntOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  bigRecordButtonActive: {
    backgroundColor: '#B91C1C',
  },
  playbackRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
});
