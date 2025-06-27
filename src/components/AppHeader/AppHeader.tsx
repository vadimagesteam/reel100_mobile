import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles';
import { SvgIcon } from '../old/UI';
import { GlobalCountdown } from './GlobalCountdown/GlobalCountdown.tsx';
import { StateSelector } from './StateSelector/StateSelector.tsx';
import Animated, {
  FlipInEasyY,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MenuButton } from './MenuButton.tsx';
import clsx from 'clsx';
import { useStateSelector } from '../../state/app/uiStore.ts';

export const AppHeaderHeight = 60;

export interface AppHeaderProps {
  stateSelect?: boolean;
  disableLayoutAnimation?: boolean;
  className?: string;
}

export const AppHeader = ({ disableLayoutAnimation = true, className }: AppHeaderProps) => {
  const [selectedState] = useStateSelector();
  const [expanded, setExpanded] = useState(false);

  const selectorStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
    }),
    [expanded],
  );

  const layoutAnimationProps = disableLayoutAnimation
    ? {}
    : ({
        layout: LinearTransition.duration(1000),
        entering: FlipInEasyY,
      } as const);

  return (
    <View className={clsx('z-30 mx-[10px]', className)}>
      {!expanded ? (
        <Animated.View
          {...layoutAnimationProps}
          className="h-[60px] flex-row items-center justify-between"
        >
          <TouchableOpacity
            className="flex-row gap-2"
            hitSlop={20}
            onPress={() => setExpanded((prev) => !prev)}
          >
            <SvgIcon image="location" color={colors.white} />
            <Text className="text-xl font-bold text-blue2">{selectedState?.slug}</Text>
          </TouchableOpacity>

          <GlobalCountdown />

          <MenuButton />
        </Animated.View>
      ) : (
        <Animated.View
          style={selectorStyle}
          className="h-[60px] flex-row items-center gap-4 opacity-0"
        >
          <StateSelector onChange={() => setExpanded(false)} />
          <TouchableOpacity onPress={() => setExpanded(false)}>
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};
