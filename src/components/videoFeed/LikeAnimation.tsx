import { forwardRef, useImperativeHandle } from 'react';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../styles';
import { isAndroid } from '../../utils';
import { IconHeart } from './IconHeart';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoFullscreen, useVideoFeed } from './hooks';
import tailwindColors from 'tailwindcss/colors';

export interface LikeAnimationRef {
  trigger: (x?: number, y?: number) => void;
  animationDuration: number;
}

export const LikeAnimation = forwardRef<LikeAnimationRef>((_, ref) => {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isFullscreen } = useVideoFullscreen();

  const originalIcon = useVideoFeed((s) => s.hearIconPos);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  const progress = useSharedValue(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const iconSize = 24;

  const startX = dimensions.width / 2 - iconSize / 2;
  const startY = dimensions.height / 3 - iconSize / 2;

  const finalX = originalIcon.x;
  const iconYInset = isAndroid ? -iconSize / 4 : iconSize * 1.22;
  const finalY = originalIcon.y + insets.top - (isFullscreen ? 0 : iconYInset);

  useImperativeHandle(ref, () => ({
    animationDuration: 1000,
    trigger: (x, y) => {
      progress.value = 0;
      opacity.value = 1;
      scale.value = 1;
      translateX.value = x ?? startX;
      translateY.value = y ?? startY;

      const randomAngle = Math.floor(Math.random() * 80) * (Math.random() > 0.5 ? -1 : 1);

      rotate.value = withSequence(
        withTiming(randomAngle, { duration: 100, easing: Easing.linear }),
        withTiming(0, { duration: 500, easing: Easing.linear }),
      );

      scale.value = withSequence(
        withTiming(4.4, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(3.2, { duration: 60 }),
        withTiming(3.8, { duration: 100 }),
        withTiming(2.9, { duration: 200 }),
        withTiming(1, { duration: 1000 }),
      );

      translateX.value = withDelay(
        400,
        withTiming(finalX, { duration: 200, easing: Easing.inOut(Easing.ease) }),
      );

      translateY.value = withDelay(
        400,
        withTiming(finalY, { duration: 200, easing: Easing.inOut(Easing.ease) }),
      );

      opacity.value = withDelay(1000, withTiming(0, { duration: 400 }));
      progress.value = withTiming(1, { duration: 1200 });
    },
  }));

  const animatedProps = useAnimatedProps(() => {
    return {
      fill: interpolateColor(progress.value, [0, 1], [tailwindColors.pink[600], colors.red]),
    };
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    top: translateY.value,
    left: translateX.value,
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View className="absolute" style={style}>
      <IconHeart animatedProps={animatedProps} variant="filled" width={24} height={24} />
    </Animated.View>
  );
});
