import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Touchable opacity wrapped in Gesture detector to avoid parental GD conflicts
export const GestureTouchableOpacity = ({ children, ...props }: TouchableOpacityProps) => {
  const tapGesture = Gesture.Tap().maxDuration(250);
  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedTouchableOpacity {...props}>{children}</AnimatedTouchableOpacity>
    </GestureDetector>
  );
};
