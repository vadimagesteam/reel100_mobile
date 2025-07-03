import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

// Touchable opacity wrapped in Gesture detector to avoid parental GD conflicts
export const GestureTouchableOpacity: FC<TouchableOpacityProps> = ({ children, ...props }) => {
  const tapGesture = Gesture.Tap().maxDuration(250);
  return (
    <GestureDetector gesture={tapGesture}>
      <TouchableOpacity {...props}>{children}</TouchableOpacity>
    </GestureDetector>
  );
};
