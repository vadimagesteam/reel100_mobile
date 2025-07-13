import clsx from 'clsx';
import { ComponentType, ReactNode, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type WithCountCircleProps<P = {}> = {
  children: ReactNode;
  count: number;
  containerClassName?: string;
  textClassName?: string;
  className?: string;
  Component?: ComponentType<P>;
} & P;

export const WithCountCircle = <P,>({
  count,
  className,
  containerClassName,
  textClassName,
  children,
  Component,
  ...props
}: WithCountCircleProps<P>) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  useEffect(() => {
    if (count) {
      opacity.value = withTiming(1);
      scale.value = withSequence(
        withSpring(1.33, { damping: 20, stiffness: 200, mass: 0.3 }),
        withSpring(1, {
          damping: 100,
        }),
      );
    }
  }, [count, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const Wrapper = Component ?? View;

  return (
    <Wrapper
      {...(props as P)}
      className={clsx('min-h-[24px]', count > 99 ? 'min-w-[40px]' : 'min-w-[32px]', className)}
    >
      {children}
      {count > 0 && (
        <Animated.View
          style={animatedStyle}
          className={clsx(
            'absolute -top-1 right-0 min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-pink-600 px-[6px] opacity-0',
            containerClassName,
          )}
        >
          <Text className={clsx('text-[14px] font-medium text-primary', textClassName)}>
            {count > 99 ? '99+' : count}
          </Text>
        </Animated.View>
      )}
    </Wrapper>
  );
};
