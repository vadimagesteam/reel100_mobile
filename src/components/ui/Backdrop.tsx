import clsx from 'clsx';
import { useState } from 'react';
import { ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export interface BackdropProps extends ViewProps {
  active: SharedValue<boolean>;
  activeOpacity?: number;
  onPress?: () => void;
}

export const Backdrop = ({
  onPress,
  active,
  activeOpacity = 0.9,
  className,
  ...props
}: BackdropProps) => {
  const [visible, setVisible] = useState(false);

  useAnimatedReaction(
    () => active.value,
    (curr) => runOnJS(setVisible)(curr),
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active.value ? activeOpacity : 0),
  }));

  const gesture = Gesture.Tap()
    .maxDuration(200)
    .onStart(() => {
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={clsx(
          'absolute inset-0 z-[11] size-full items-center justify-center bg-black/80',
          className,
        )}
        style={backdropStyle}
        // android
        pointerEvents={visible ? 'auto' : 'none'}
        {...props}
      />
    </GestureDetector>
  );
};
