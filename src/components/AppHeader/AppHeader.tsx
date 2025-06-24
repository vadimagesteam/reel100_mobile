import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
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
import { useStateSelector } from '../../state/app/appPersistentStore.ts';
import { MenuButton } from './MenuButton.tsx';

export const AppHeaderHeight = 60;

export interface AppHeaderProps {
  stateSelect?: boolean;
}

export const AppHeader = ({ stateSelect = false }: AppHeaderProps) => {
  const [selectedState] = useStateSelector();
  const [expanded, setExpanded] = useState(false);

  const selectorStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
    }),
    [expanded],
  );

  return (
    <Animated.View className="z-30 w-full">
      {!expanded ? (
        <Animated.View
          layout={LinearTransition.duration(1000)}
          entering={FlipInEasyY}
          className="h-[60px] flex-row items-center justify-between px-4"
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
          className="h-[60px] flex-row items-center gap-4 px-4 opacity-0"
        >
          <StateSelector onChange={() => setExpanded(false)} />
          <TouchableOpacity onPress={() => setExpanded(false)}>
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};
