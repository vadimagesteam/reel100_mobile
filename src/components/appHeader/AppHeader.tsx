import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { Screens } from '../../navigation/screens';
import { SelectStateRouteParams } from '../../screens/authenticated/screens/SelectStateScreen';
import { colors } from '../../styles';
import { SvgIcon } from '../ui';
import { GlobalCountdown } from './globalCountdown/GlobalCountdown.tsx';
import Animated, { FlipInEasyY, LinearTransition } from 'react-native-reanimated';
import { HeaderBackArrowButton } from './HeaderBackArrowButton';
import { MenuButton } from './MenuButton.tsx';
import clsx from 'clsx';
import { useStateSelector } from '../../state/app/uiStore.ts';
import { useNavigation } from '@react-navigation/native';

export const AppHeaderHeight = 60;

export interface AppHeaderProps {
  showBackButton?: boolean;
  disableLayoutAnimation?: boolean;
  className?: string;
  style?: ViewProps['style'];
  noPx?: boolean; // no x-padding
}

export const AppHeader = ({
  showBackButton,
  disableLayoutAnimation = true,
  className,
  style,
  noPx,
}: AppHeaderProps) => {
  const navigation = useNavigation<any>();
  const [selectedState, setSelectedState] = useStateSelector();

  const layoutAnimationProps = disableLayoutAnimation
    ? {}
    : {
        layout: LinearTransition.duration(1000),
        entering: FlipInEasyY,
      };

  return (
    <View className={clsx('z-30', !noPx && 'px-2.5', className)} style={style}>
      <Animated.View
        {...layoutAnimationProps}
        className="h-[60px] flex-row items-center justify-between"
      >
        {showBackButton ? (
          <HeaderBackArrowButton />
        ) : (
          <TouchableOpacity
            className="flex-row gap-2"
            hitSlop={20}
            onPress={() => {
              navigation.navigate(Screens.SelectState, {
                placeholderValue: selectedState?.label,
                onSelected: setSelectedState,
              } as SelectStateRouteParams);
            }}
          >
            <SvgIcon image="location" color={colors.white} />
            <Text className="text-xl font-bold text-blue2">{selectedState?.slug}</Text>
          </TouchableOpacity>
        )}

        <GlobalCountdown />
        <MenuButton />
      </Animated.View>
    </View>
  );
};
