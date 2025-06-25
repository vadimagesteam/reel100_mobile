import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import SvgIcon from '../../../components/ui/SvgIcon.tsx';
import { Tabs } from '../../screens.ts';
import { DASHBOARD_ROUTES } from '../../routes.ts';
import { colors } from '../../../theme/colors.ts';

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

  const isHiddenScreens = innerRoutes.some(
    (r) =>
      r.name === DASHBOARD_ROUTES.FULL_VIDEO_SCREEN ||
      r.name === DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN,
    // ||
    // r.name === DASHBOARD_ROUTES.CHAT_LIST_SCREEN ||
    // r.name === DASHBOARD_ROUTES.CHAT_SCREEN ||
    // r.name === DASHBOARD_ROUTES.CHAT_USER_SCREEN
  );

  if (isHiddenScreens) {
    return null;
  }

  return (
    <View className="h-[70px] flex-row bg-black4">
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
    </View>
  );
};
