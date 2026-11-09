import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { TabBar, TabName } from './src/components/navigation/TabBar';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { LearnHubScreen } from './src/screens/learn/LearnHubScreen';
import { VocabularyScreen } from './src/screens/vocabulary/VocabularyScreen';
import { GrammarScreen } from './src/screens/grammar/GrammarScreen';
import { VerbsScreen } from './src/screens/verbs/VerbsScreen';
import { ReadingScreen } from './src/screens/reading/ReadingScreen';
import { ListeningScreen } from './src/screens/listening/ListeningScreen';
import { ProgressScreen } from './src/screens/progress/ProgressScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { colors } from './src/theme/colors';
import { LearningService } from './src/services/LearningService';
import { CEFRLevel, LearningCategory } from './src/types';

export default function App() {
  const learningService = LearningService.getInstance();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // Default to true so user sees dashboard, can toggle to onboarding
  const [currentTab, setCurrentTab] = useState<TabName>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState(() => learningService.getProgress());

  const handleFinishOnboarding = (prefs: { goal: string; level: CEFRLevel; dailyMinutes: number }) => {
    userProgress.cefrLevel = prefs.level;
    userProgress.dailyGoalMinutes = prefs.dailyMinutes;
    setUserProgress({ ...userProgress });
    setHasCompletedOnboarding(true);
  };

  const handleNavigateToActivity = (category: string) => {
    setActiveSubScreen(category);
  };

  const handleSelectTab = (tab: TabName) => {
    setActiveSubScreen(null); // clear subscreen when switching tabs
    setCurrentTab(tab);
  };

  const refreshProgress = () => {
    setUserProgress(learningService.getProgress());
  };

  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.canvas} />
        <OnboardingScreen
          onFinish={handleFinishOnboarding}
          onSkip={() => setHasCompletedOnboarding(true)}
        />
      </View>
    );
  }

  const renderActiveScreen = () => {
    // If inside a specific learning subscreen (e.g. from Dashboard or Learn hub)
    if (activeSubScreen === 'reading') {
      return <ReadingScreen onBack={() => setActiveSubScreen(null)} />;
    }
    if (activeSubScreen === 'listening') {
      return <ListeningScreen onBack={() => setActiveSubScreen(null)} />;
    }
    if (activeSubScreen === 'vocabulary') {
      return <VocabularyScreen onBack={() => setActiveSubScreen(null)} />;
    }
    if (activeSubScreen === 'grammar') {
      return <GrammarScreen onBack={() => setActiveSubScreen(null)} />;
    }
    if (activeSubScreen === 'verbs') {
      return <VerbsScreen onBack={() => setActiveSubScreen(null)} />;
    }

    // Main Tab Routing
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            userProgress={userProgress}
            onNavigateToActivity={handleNavigateToActivity as any}
            onContinueLesson={() => setActiveSubScreen('reading')}
            onPressProfile={() => setCurrentTab('profile')}
          />
        );
      case 'learn':
        return (
          <LearnHubScreen
            currentLevel={userProgress.cefrLevel}
            onSelectCategory={(cat: LearningCategory) => setActiveSubScreen(cat)}
          />
        );
      case 'library':
        return <ReadingScreen />;
      case 'progress':
        return <ProgressScreen userProgress={userProgress} />;
      case 'profile':
        return (
          <ProfileScreen
            userProgress={userProgress}
            onRefreshProgress={refreshProgress}
          />
        );
      default:
        return (
          <HomeScreen
            userProgress={userProgress}
            onNavigateToActivity={handleNavigateToActivity as any}
            onContinueLesson={() => setActiveSubScreen('reading')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.canvas} />
      <View style={styles.screenArea}>{renderActiveScreen()}</View>
      <TabBar currentTab={currentTab} onSelectTab={handleSelectTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  screenArea: {
    flex: 1,
  },
});
