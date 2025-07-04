import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { isoUTCDateToLocate } from '../../utils/formatTime.ts';
import Animated from 'react-native-reanimated';

interface HeaderCalendarProps extends Pick<TouchableOpacityProps, 'style'> {
  markerDate: string;
  onCalendar: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HeaderCalendar = ({ style, markerDate, onCalendar }: HeaderCalendarProps) => {
  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      className="mx-[10px] mb-[10px] h-10 items-center justify-center"
      onPress={onCalendar}
      style={style}
    >
      <View className="w-full flex-1 justify-center rounded-[5px] bg-zinc-800 px-[11px]">
        <Text className="pl-2 text-[16px] text-silver2">{isoUTCDateToLocate(markerDate)}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default HeaderCalendar;
