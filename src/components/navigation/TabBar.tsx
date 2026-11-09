import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EditorialText } from '../common/EditorialText';
import { colors } from '../../theme/colors';

export type TabName = 'home' | 'learn' | 'library' | 'progress' | 'profile';

interface TabItem {
  id: TabName;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'learn', label: 'Aprender', icon: '📖' },
  { id: 'library', label: 'Biblioteca', icon: '📚' },
  { id: 'progress', label: 'Progreso', icon: '📊' },
  { id: 'profile', label: 'Perfil', icon: '👤' },
];

interface TabBarProps {
  currentTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={styles.tabItem}
            hitSlop={6}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
              ]}
            >
              <EditorialText style={styles.iconText}>{tab.icon}</EditorialText>
            </View>
            <EditorialText
              variant="caption"
              color={isActive ? colors.forestGreen : colors.text.secondary}
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : undefined,
              ]}
            >
              {tab.label}
            </EditorialText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingVertical: 10,
    paddingBottom: 22, // for safe area
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#E8F0EC',
  },
  iconText: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
    color: colors.forestGreen,
  },
});
