import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

// Touchable opacity wrapped in Gesture detector to avoid parental GD conflicts
export const GestureTouchableOpacity = ({ children, ...props }: TouchableOpacityProps) => {
  const tapGesture = Gesture.Tap().maxDuration(250);
  return (
    <GestureDetector gesture={tapGesture}>
      <TouchableOpacity {...props}>{children}</TouchableOpacity>
    </GestureDetector>
  );
};
