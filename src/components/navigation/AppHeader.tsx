import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EditorialText } from '../common/EditorialText';
import { colors } from '../../theme/colors';

interface AppHeaderProps {
  userName?: string;
  greeting?: string;
  streakCount?: number;
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  userName = 'Daizy',
  greeting = 'Listo para otro día de español?',
  streakCount = 12,
  onPressProfile,
  onPressNotifications,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable onPress={onPressProfile} style={styles.avatar}>
          <EditorialText style={styles.avatarEmoji}>👩🏻</EditorialText>
        </Pressable>
        <View style={styles.greetingTextContainer}>
          <EditorialText variant="caption" color={colors.text.secondary}>
            Bienvenida de nuevo, {userName}
          </EditorialText>
          <EditorialText
            variant="headline"
            color={colors.text.primary}
            style={styles.greetingTitle}
          >
            {greeting}
          </EditorialText>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Streak Pill */}
        <View style={styles.streakBadge}>
          <EditorialText style={styles.streakEmoji}>🔥</EditorialText>
          <EditorialText variant="caption" color={colors.burntOrange} style={styles.streakText}>
            {streakCount}
          </EditorialText>
        </View>

        {/* Bell Notification */}
        <Pressable
          onPress={onPressNotifications}
          style={styles.notificationBtn}
          hitSlop={8}
        >
          <EditorialText style={styles.bellIcon}>🔔</EditorialText>
          <View style={styles.unreadDot} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.canvas,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E5D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2CEBA',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingTitle: {
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEEE8',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#F5CFC0',
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontWeight: '700',
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  bellIcon: {
    fontSize: 16,
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.burntOrange,
  },
});

