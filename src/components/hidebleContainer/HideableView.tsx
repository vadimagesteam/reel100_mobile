import { ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useHideableContainer } from './hooks/useHideableContainer';

export const HideableView = ({ children, ...props }: ViewProps) => {
  const { isHiddenSharedValue } = useHideableContainer();
  const viewHeight = useSharedValue(0);

  const containerStyles = useAnimatedStyle(() => ({
    position: isHiddenSharedValue.value ? 'absolute' : 'static',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    top: withTiming(isHiddenSharedValue.value ? -viewHeight.value : 0, { duration: 160 }),
    opacity: withTiming(isHiddenSharedValue.value ? 0 : 1, { duration: 160 }),
  }));

  return (
    <Animated.View
      onLayout={(e) => {
        viewHeight.value = e.nativeEvent.layout.height;
      }}
      style={containerStyles}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
