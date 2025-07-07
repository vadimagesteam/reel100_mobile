import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Calendar, CalendarProps } from './Calendar';

export interface CalendarModalProps extends CalendarProps {
  visible: boolean;
}

export const CalendarModal = ({ visible, ...props }: CalendarModalProps) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [opacity, visible]);

  const viewStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={viewStyle}
      className="absolute bottom-0 left-0 right-0 top-0 z-30 flex-1 items-center justify-center bg-black/80 px-[40px]"
    >
      <Calendar {...props} />
    </Animated.View>
  );
};
