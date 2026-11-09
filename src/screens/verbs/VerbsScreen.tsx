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
import { ConjugationTable } from '../../components/learning/ConjugationTable';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { colors } from '../../theme/colors';
import { verbDatabase } from '../../data/verbs';
import { VerbItem } from '../../types';

interface VerbsScreenProps {
  onBack?: () => void;
}

export const VerbsScreen: React.FC<VerbsScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerbInfinitive, setSelectedVerbInfinitive] = useState<string>('hablar');
  const [selectedTense, setSelectedTense] = useState<keyof VerbItem['tenses']>('presente');

  const filteredVerbs = verbDatabase.filter(v =>
    v.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeVerb = verbDatabase.find(v => v.infinitive === selectedVerbInfinitive) || verbDatabase[0];

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
          Conjugador Verbal
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Tablas sistemáticas en 6 tiempos fundamentales
        </EditorialText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <EditorialText style={styles.searchIcon}>🔍</EditorialText>
          <TextInput
            placeholder="Buscar infinitivo (ej: hablar, comer, ser)..."
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

        {/* Quick Verb Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.verbsCarousel}
        >
          {filteredVerbs.map(v => {
            const isSelected = v.infinitive === selectedVerbInfinitive;
            return (
              <Pressable
                key={v.infinitive}
                onPress={() => setSelectedVerbInfinitive(v.infinitive)}
                style={[
                  styles.verbPill,
                  isSelected ? styles.verbPillActive : styles.verbPillInactive,
                ]}
              >
                <EditorialText
                  variant="caption"
                  color={isSelected ? colors.text.inverse : colors.text.primary}
                  style={{ fontWeight: isSelected ? '700' : '500' }}
                >
                  {v.infinitive} ({v.group})
                </EditorialText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ConjugationTable
          verb={activeVerb}
          selectedTense={selectedTense}
          onSelectTense={setSelectedTense}
        />
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
  searchSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 10,
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
  verbsCarousel: {
    gap: 8,
  },
  verbPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
  },
  verbPillActive: {
    backgroundColor: colors.burntOrange,
    borderColor: colors.burntOrange,
  },
  verbPillInactive: {
    backgroundColor: '#FFF9F0',
    borderColor: colors.border.subtle,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
});
