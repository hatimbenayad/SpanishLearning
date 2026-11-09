import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { EducationalCard } from '../cards/EducationalCard';
import { EditorialText } from '../common/EditorialText';
import { colors } from '../../theme/colors';
import { DailyActivityMetric } from '../../types';

interface WeeklyBarChartProps {
  data: DailyActivityMetric[];
  dailyGoalMinutes?: number;
  totalHoursLabel?: string;
  totalLessonsLabel?: string;
  onSelectDay?: (dayMetric: DailyActivityMetric) => void;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  data,
  dailyGoalMinutes = 30,
  totalHoursLabel = '7h 20m',
  totalLessonsLabel = '28 lecciones',
  onSelectDay,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Default to Thursday/active
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const activeDayMetric = data[selectedDayIndex] || data[0];

  return (
    <EducationalCard variant="cream" style={styles.card}>
      {/* Top Header Row with Toggle */}
      <View style={styles.topHeader}>
        <View>
          <EditorialText variant="headline" color={colors.text.primary}>
            Rendimiento de estudio
          </EditorialText>
          <EditorialText variant="caption" color={colors.text.secondary}>
            {totalLessonsLabel} • {totalHoursLabel}
          </EditorialText>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setViewMode('weekly')}
            style={[
              styles.segmentBtn,
              viewMode === 'weekly' && styles.segmentBtnActive,
            ]}
          >
            <EditorialText
              variant="caption"
              color={viewMode === 'weekly' ? colors.text.inverse : colors.text.secondary}
              style={{ fontWeight: viewMode === 'weekly' ? '700' : '500' }}
            >
              Semanal
            </EditorialText>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('monthly')}
            style={[
              styles.segmentBtn,
              viewMode === 'monthly' && styles.segmentBtnActive,
            ]}
          >
            <EditorialText
              variant="caption"
              color={viewMode === 'monthly' ? colors.text.inverse : colors.text.secondary}
              style={{ fontWeight: viewMode === 'monthly' ? '700' : '500' }}
            >
              Mensual
            </EditorialText>
          </Pressable>
        </View>
      </View>

      {/* Selected Day Stat Banner */}
      <View style={styles.activeDayStat}>
        <EditorialText variant="subheadline" color={colors.burntOrange}>
          {activeDayMetric.fullDate}: {activeDayMetric.minutes} min
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          {activeDayMetric.lessons} lecciones completadas
        </EditorialText>
      </View>

      {/* Bar Chart Columns */}
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const isSelected = index === selectedDayIndex;
          const maxMinutes = Math.max(...data.map(d => d.minutes), dailyGoalMinutes);
          const fillPercentage = Math.min(100, Math.round((item.minutes / maxMinutes) * 100));

          return (
            <Pressable
              key={item.day + index}
              onPress={() => {
                setSelectedDayIndex(index);
                onSelectDay?.(item);
              }}
              style={styles.columnWrapper}
            >
              {/* Outer Capsule */}
              <View
                style={[
                  styles.barTrack,
                  isSelected && styles.barTrackSelected,
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${fillPercentage}%`,
                      backgroundColor: isSelected
                        ? colors.burntOrange
                        : item.minutes > 0
                        ? colors.softPeach
                        : '#EFE7DA',
                    },
                  ]}
                />
              </View>

              {/* Day Label */}
              <EditorialText
                variant="caption"
                color={isSelected ? colors.burntOrange : colors.text.secondary}
                style={[
                  styles.dayLabel,
                  isSelected ? { fontWeight: '700' } : undefined,
                ]}
              >
                {item.day}
              </EditorialText>
            </Pressable>
          );
        })}
      </View>
    </EducationalCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#EAE1D3',
    borderRadius: 9999,
    padding: 3,
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  segmentBtnActive: {
    backgroundColor: colors.burntOrange,
  },
  activeDayStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.cardPeach,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 22,
    height: 110,
    backgroundColor: '#F3ECE1',
    borderRadius: 11,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E7DDD0',
  },
  barTrackSelected: {
    borderColor: colors.burntOrange,
    borderWidth: 1.5,
  },
  barFill: {
    width: '100%',
    borderRadius: 11,
  },
  dayLabel: {
    textTransform: 'uppercase',
  },
});
