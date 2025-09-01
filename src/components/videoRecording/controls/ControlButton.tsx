import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import clsx from 'clsx';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ControlButtonProps extends TouchableOpacityProps {
  animated?: boolean;
  onPress?: () => void;
}

export const ControlButton = ({ children, onPress, className, ...rest }: ControlButtonProps) => {
  // Tap gesture must be handled by gesture detector, otherwise it will be swallowed by parent gesture detectors
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedTouchableOpacity
        hitSlop={20}
        className={clsx(
          className,
          'h-[38px] w-[38px] items-center justify-center rounded-full bg-[rgba(134,131,130,255)]',
        )}
        {...rest}
      >
        {children}
      </AnimatedTouchableOpacity>
    </GestureDetector>
  );
};
