import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { TabBar, TabName } from './src/components/navigation/TabBar';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { LearnHubScreen } from './src/screens/learn/LearnHubScreen';
import { VocabularyScreen } from './src/screens/vocabulary/VocabularyScreen';
import { GrammarScreen } from './src/screens/grammar/GrammarScreen';
import { VerbsScreen } from './src/screens/verbs/VerbsScreen';
import { ReadingScreen } from './src/screens/reading/ReadingScreen';
import { WritingPracticeScreen } from './src/screens/practice/WritingPracticeScreen';
import { ExerciseSessionScreen } from './src/screens/exercises/ExerciseSessionScreen';
import { ProgressScreen } from './src/screens/progress/ProgressScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { EditorialText } from './src/components/common/EditorialText';
import { colors } from './src/theme/colors';
import { LearningService } from './src/services/LearningService';
import { CEFRLevel, LearningCategory } from './src/types';

export default function App() {
  const learningService = LearningService.getInstance();
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabName>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState(() => learningService.getProgress());

  useEffect(() => {
    let mounted = true;
    learningService
      .initialize()
      .then(() => {
        if (!mounted) return;
        setUserProgress(learningService.getProgress());
        setHasCompletedOnboarding(learningService.hasCompletedOnboarding());
        setIsReady(true);
      })
      .catch(() => {
        if (mounted) setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const refreshProgress = () => {
    setUserProgress(learningService.getProgress());
  };

  const handleFinishOnboarding = async (prefs: {
    goal: string;
    level: CEFRLevel;
    dailyMinutes: number;
  }) => {
    await learningService.completeOnboarding({
      cefrLevel: prefs.level,
      dailyGoalMinutes: prefs.dailyMinutes,
    });
    refreshProgress();
    setHasCompletedOnboarding(true);
  };

  const handleSkipOnboarding = async () => {
    await learningService.completeOnboarding({
      cefrLevel: userProgress.cefrLevel,
      dailyGoalMinutes: userProgress.dailyGoalMinutes,
    });
    refreshProgress();
    setHasCompletedOnboarding(true);
  };

  const handleNavigateToActivity = (category: string) => {
    setActiveSubScreen(category);
  };

  const handleSelectTab = (tab: TabName) => {
    refreshProgress();
    setActiveSubScreen(null);
    setCurrentTab(tab);
  };

  const closeSubScreen = () => {
    refreshProgress();
    setActiveSubScreen(null);
  };

  if (!isReady) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.burntOrange} />
        <EditorialText variant="handwritten" color={colors.forestGreen} style={{ marginTop: 12 }}>
          Preparando tu diario de español...
        </EditorialText>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <OnboardingScreen
          onFinish={handleFinishOnboarding}
          onSkip={handleSkipOnboarding}
        />
      </View>
    );
  }

  const renderActiveScreen = () => {
    if (activeSubScreen === 'reading') {
      return <ReadingScreen onBack={closeSubScreen} />;
    }
    if (activeSubScreen === 'vocabulary') {
      return <VocabularyScreen onBack={closeSubScreen} />;
    }
    if (activeSubScreen === 'grammar') {
      return <GrammarScreen onBack={closeSubScreen} />;
    }
    if (activeSubScreen === 'verbs') {
      return <VerbsScreen onBack={closeSubScreen} />;
    }
    if (activeSubScreen === 'writing') {
      return <WritingPracticeScreen onBack={closeSubScreen} />;
    }
    if (activeSubScreen === 'exercises') {
      return <ExerciseSessionScreen onBack={closeSubScreen} onFinishSession={refreshProgress} />;
    }

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
            onReopenOnboarding={() => setHasCompletedOnboarding(false)}
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
      <StatusBar barStyle="dark-content" />
      <View style={styles.screenArea}>{renderActiveScreen()}</View>
      <TabBar currentTab={currentTab} onSelectTab={handleSelectTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.canvas,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenArea: {
    flex: 1,
  },
});
