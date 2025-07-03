import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated from 'react-native-reanimated';
import clsx from 'clsx';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ControlButtonProps extends TouchableOpacityProps {
  animated?: boolean;
}

export const ControlButton = ({ children, className, animated, ...rest }: ControlButtonProps) => {
  const Component = animated ? AnimatedTouchableOpacity : TouchableOpacity;
  return (
    <Component
      hitSlop={20}
      className={clsx(
        'h-[38px] w-[38px] items-center justify-center rounded-full bg-[rgba(134,131,130,255)]',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
