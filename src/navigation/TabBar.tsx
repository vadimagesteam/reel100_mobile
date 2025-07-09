import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SvgIcon } from '../components/ui';
import { Screens, Tabs } from './screens';
import { colors } from '../theme/colors';

type RouteKey = keyof typeof Tabs;
const TabIcons: Record<RouteKey, string> = {
  [Tabs.TabMain]: 'homeNavTab',
  [Tabs.TabGlobalVideo]: 'globalNavTab',
  [Tabs.TabForYou]: 'fourU_NavTab',
  [Tabs.TabProfile]: 'profileNavTab',
};

const IconSize = 24;
const IconSizeFocused = 28;
export const BottomTabHeight = 70;

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const currentRoute = state.routes[state.index];
  const nestedState = descriptors[currentRoute.key]?.navigation?.getState?.();
  const innerRoutes = nestedState?.routes?.[nestedState.index]?.state?.routes || [];

  const isHiddenScreens = innerRoutes.some((r) => r.name === Screens.VideoRecording);

  const style = useAnimatedStyle(() => ({
    position: isHiddenScreens ? 'absolute' : 'static',
    left: 0,
    right: 0,
    bottom: withTiming(isHiddenScreens ? -70 : 0),
  }));

  return (
    <Animated.View style={style} className="h-[70px] flex-row bg-black4">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconSize = isFocused ? IconSizeFocused : IconSize;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            className="flex-1 items-center justify-center"
            onPress={onPress}
          >
            <View className="mb-[10px] items-center justify-center rounded-[40px] p-[5px]">
              <SvgIcon
                image={TabIcons[route.name as RouteKey]}
                color={isFocused ? colors.blue2 : colors.white}
                style={{ width: iconSize, height: iconSize }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};
