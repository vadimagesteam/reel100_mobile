import React from 'react';
import { View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import Animated from 'react-native-reanimated';
import { colors } from '../../styles';
import { Button } from '../ui';

export interface CalendarProps {
  marked: any;
  currentDate: string;
  setVisibleDate: (date: string) => void;
  onCancelPress: () => void;
  onSubmitPress: () => void;
}

export const Calendar = ({
  marked,
  currentDate,
  setVisibleDate,
  onCancelPress,
  onSubmitPress,
}: CalendarProps) => {
  return (
    <View className="w-full flex-col gap-4 rounded-[16px] bg-black1 p-3">
      <RNCalendar
        current={currentDate}
        markedDates={marked}
        onDayPress={(day) => {
          setVisibleDate(day.dateString);
        }}
        theme={{
          calendarBackground: colors.black1,
          arrowColor: colors.blue,
          monthTextColor: colors.white,
          textMonthFontWeight: '500',
          dayTextColor: colors.white,
          todayTextColor: colors.blue1,
        }}
      />
      <View className="flex-row justify-between">
        <Button buttonClassName="min-w-[100px]" variant="outline" size="sm" onPress={onCancelPress}>
          Cancel
        </Button>
        <Button
          buttonClassName="min-w-[100px]"
          variant="gradient"
          size="sm"
          onPress={onSubmitPress}
        >
          Confirm
        </Button>
      </View>
    </View>
  );
};
