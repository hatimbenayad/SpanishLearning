import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { ListeningMaterial, TranscriptSentence } from '../../types';

interface AudioPlayerViewProps {
  item: ListeningMaterial;
  onSaveWord?: (word: string) => void;
}

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  item,
  onSaveWord,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(14); // 14s in
  const [playbackSpeed, setPlaybackSpeed] = useState<'0.75x' | '1.0x' | '1.25x'>('1.0x');
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(1);

  const duration = item.durationSeconds || 120;
  const progressRatio = currentTime / duration;

  const speeds: Array<'0.75x' | '1.0x' | '1.25x'> = ['0.75x', '1.0x', '1.25x'];

  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekSentence = (idx: number, sentence: TranscriptSentence) => {
    setActiveSentenceIndex(idx);
    setCurrentTime(sentence.startTime);
    setIsPlaying(true);
  };

  return (
    <View style={styles.container}>
      {/* Hero Player Container (Deep Forest Green Theme) */}
      <EducationalCard variant="dark" style={styles.playerCard}>
        <View style={styles.topInfo}>
          <Badge label={item.cefrLevel} variant="orange" />
          <EditorialText variant="caption" color="rgba(255, 249, 240, 0.7)">
            Locutor: {item.speaker}
          </EditorialText>
        </View>

        <EditorialText
          variant="displaySmall"
          color={colors.text.inverse}
          style={styles.playerTitle}
        >
          {item.title}
        </EditorialText>

        {/* Waveform / Progress Bar */}
        <View style={styles.scrubberSection}>
          <ProgressBar
            progress={progressRatio}
            color={colors.burntOrange}
            trackColor="rgba(255, 249, 240, 0.2)"
            height={6}
          />
          <View style={styles.timeRow}>
            <EditorialText variant="caption" color="rgba(255, 249, 240, 0.7)">
              {formatTime(currentTime)}
            </EditorialText>
            <EditorialText variant="caption" color="rgba(255, 249, 240, 0.7)">
              {formatTime(duration)}
            </EditorialText>
          </View>
        </View>

        {/* Large Playback Controls */}
        <View style={styles.controlsRow}>
          {/* Speed Toggle */}
          <Pressable onPress={cycleSpeed} style={styles.speedButton}>
            <EditorialText variant="caption" color={colors.text.inverse} style={{ fontWeight: '700' }}>
              {playbackSpeed}
            </EditorialText>
          </Pressable>

          {/* 10s Rewind */}
          <Pressable
            onPress={() => setCurrentTime(Math.max(0, currentTime - 10))}
            style={styles.secondaryControl}
          >
            <EditorialText variant="bodyLarge" color={colors.text.inverse}>
              ↺ 10
            </EditorialText>
          </Pressable>

          {/* Main Play/Pause Button */}
          <Pressable
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.playPausePill}
          >
            <EditorialText
              variant="headline"
              color={colors.text.inverse}
              style={{ fontWeight: '700' }}
            >
              {isPlaying ? '⏸ Pausa' : '▶ Reproducir'}
            </EditorialText>
          </Pressable>

          {/* 10s Forward */}
          <Pressable
            onPress={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            style={styles.secondaryControl}
          >
            <EditorialText variant="bodyLarge" color={colors.text.inverse}>
              10 ↻
            </EditorialText>
          </Pressable>

          {/* Transcript Toggle */}
          <Pressable
            onPress={() => setShowTranscript(!showTranscript)}
            style={[
              styles.transcriptToggle,
              showTranscript && styles.transcriptToggleActive,
            ]}
          >
            <EditorialText variant="caption" color={colors.text.inverse}>
              📝
            </EditorialText>
          </Pressable>
        </View>
      </EducationalCard>

      {/* Synced Interactive Transcript Section */}
      {showTranscript && (
        <View style={styles.transcriptSection}>
          <View style={styles.transcriptHeader}>
            <EditorialText variant="subheadline" color={colors.text.primary}>
              Transcripción sincronizada
            </EditorialText>
            <EditorialText variant="caption" color={colors.text.secondary}>
              Toca una frase para escucharla de nuevo
            </EditorialText>
          </View>

          <View style={styles.sentencesList}>
            {item.transcript.map((sentence, idx) => {
              const isActive = idx === activeSentenceIndex;
              return (
                <Pressable
                  key={sentence.id}
                  onPress={() => handleSeekSentence(idx, sentence)}
                  style={[
                    styles.sentenceCard,
                    isActive && styles.sentenceCardActive,
                  ]}
                >
                  <View style={styles.sentenceHeader}>
                    <EditorialText
                      variant="caption"
                      color={isActive ? colors.burntOrange : colors.text.secondary}
                      style={{ fontWeight: '700' }}
                    >
                      {formatTime(sentence.startTime)}
                    </EditorialText>
                    {isActive && (
                      <Badge label="Reproduciendo" variant="orange" style={{ paddingVertical: 1, paddingHorizontal: 6 }} />
                    )}
                  </View>

                  <EditorialText
                    variant="readingPassage"
                    color={isActive ? colors.forestGreen : colors.text.primary}
                    style={{ fontWeight: isActive ? '600' : '400', fontSize: 16, lineHeight: 24 }}
                  >
                    {sentence.spanish}
                  </EditorialText>

                  <EditorialText
                    variant="bodySmall"
                    color={colors.text.secondary}
                    style={{ fontStyle: 'italic', marginTop: 4 }}
                  >
                    "{sentence.english}"
                  </EditorialText>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  playerCard: {
    padding: 22,
    backgroundColor: colors.forestGreen,
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerTitle: {
    marginBottom: 20,
    color: colors.softCream,
  },
  scrubberSection: {
    gap: 8,
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 249, 240, 0.15)',
  },
  secondaryControl: {
    padding: 8,
  },
  playPausePill: {
    backgroundColor: colors.burntOrange,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 9999,
  },
  transcriptToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 249, 240, 0.15)',
  },
  transcriptToggleActive: {
    backgroundColor: 'rgba(240, 100, 35, 0.5)',
  },
  transcriptSection: {
    gap: 12,
  },
  transcriptHeader: {
    marginBottom: 4,
  },
  sentencesList: {
    gap: 10,
  },
  sentenceCard: {
    backgroundColor: '#FFF9F0',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  sentenceCardActive: {
    borderColor: colors.burntOrange,
    backgroundColor: '#FFF4EE',
    borderLeftWidth: 4,
    borderLeftColor: colors.burntOrange,
  },
  sentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});

