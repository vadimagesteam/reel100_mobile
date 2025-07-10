import { createContext, useMemo } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type IHidebleContainerContext = {
  hide: () => void;
  show: () => void;
  toggle: () => void;
  isHiddenSharedValue: SharedValue<boolean>;
};

export const HidebleContainerContext = createContext<IHidebleContainerContext | undefined>(
  undefined,
);

export interface HidebleContainerProps extends ViewProps {
  hideOffset?: number;
}

export const HidebleContainer = ({
  hideOffset = 0,
  style,
  children,
  ...props
}: HidebleContainerProps) => {
  const insets = useSafeAreaInsets();

  const isHidden = useSharedValue(false);

  const containerStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    top: withTiming(isHidden.value ? hideOffset * -1 - insets.top : 0, {
      duration: 100,
    }),
    paddingTop: insets.top,
  }));

  const ctxValue = useMemo<IHidebleContainerContext>(
    () => ({
      hide: () => (isHidden.value = true),
      show: () => (isHidden.value = false),
      toggle: () => (isHidden.value = !isHidden.value),
      isHiddenSharedValue: isHidden,
    }),
    [isHidden],
  );

  return (
    <HidebleContainerContext.Provider value={ctxValue}>
      <Animated.View style={[style, containerStyles]} {...props}>
        {children}
      </Animated.View>
    </HidebleContainerContext.Provider>
  );
};
