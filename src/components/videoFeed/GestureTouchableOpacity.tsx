import { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Touchable opacity wrapped in Gesture detector to avoid parental GD conflicts
export const GestureTouchableOpacity = ({ children, ...props }: TouchableOpacityProps) => {
  // Memoized: a new gesture identity makes GestureDetector tear down and
  // re-attach the native handler, which drops any touch in flight. This
  // component renders once per overlay button, so an unmemoized gesture churned
  // handlers on every render across the whole feed.
  const tapGesture = useMemo(() => Gesture.Tap().maxDuration(250), []);
  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedTouchableOpacity {...props}>{children}</AnimatedTouchableOpacity>
    </GestureDetector>
  );
};
