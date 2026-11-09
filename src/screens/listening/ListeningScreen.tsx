import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { AudioPlayerView } from '../../components/learning/AudioPlayerView';
import { ExerciseCard } from '../../components/learning/ExerciseCard';
import { colors } from '../../theme/colors';
import { listeningLibrary } from '../../data/listening';
import { ListeningMaterial } from '../../types';

interface ListeningScreenProps {
  onBack?: () => void;
}

export const ListeningScreen: React.FC<ListeningScreenProps> = ({ onBack }) => {
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(0);
  const currentAudio: ListeningMaterial = listeningLibrary[selectedAudioIndex] || listeningLibrary[0];

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
          Comprensión Auditiva
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Voces nativas, velocidad ajustable y transcripción sincronizada
        </EditorialText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Audio Player Component */}
        <AudioPlayerView
          item={currentAudio}
          onSaveWord={word => {
            // save word
          }}
        />

        {/* Listening Comprehension Exercises */}
        {currentAudio.comprehensionQuestions && currentAudio.comprehensionQuestions.length > 0 && (
          <View style={styles.quizSection}>
            <EditorialText variant="headline" color={colors.text.primary} style={styles.quizTitle}>
              Comprobación auditiva
            </EditorialText>
            {currentAudio.comprehensionQuestions.map(q => (
              <ExerciseCard
                key={q.id}
                exercise={q}
                onComplete={isCorrect => {
                  // handle
                }}
              />
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
    paddingBottom: 12,
  },
  backBtn: {
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 20,
  },
  quizSection: {
    gap: 12,
  },
  quizTitle: {
    fontWeight: '700',
  },
});

