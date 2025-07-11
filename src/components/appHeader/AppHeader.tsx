import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import Animated, { FlipInEasyY, LinearTransition } from 'react-native-reanimated';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { SvgIcon } from '../ui';
import { GlobalCountdown } from './globalCountdown/GlobalCountdown';
import { HeaderBackArrowButton } from './HeaderBackArrowButton';
import { MenuButton } from './MenuButton';
import clsx from 'clsx';
import { useStateSelector } from '../../state/app/uiStore';

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
  const navigation = useNavigation();
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
              });
            }}
          >
            <SvgIcon image="location" color={colors.white} />
            <Text className="text-xl font-bold text-accent">{selectedState?.slug}</Text>
          </TouchableOpacity>
        )}

        <GlobalCountdown />

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="flex-row gap-2"
            hitSlop={20}
            onPress={() => {
              navigation.navigate(Screens.UserSearch);
            }}
          >
            <Ionicons size={18} name="search-sharp" color="#fff" />
          </TouchableOpacity>
          <MenuButton />
        </View>
      </Animated.View>
    </View>
  );
};
