import { TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import CameraAddIcon from '../../assets/icons/CameraAddIcon';
import { useUnreadChatsCount } from '../chat/hooks/useUnreadChatsCount';
import { SvgIcon, WithCountCircle } from '../ui';
import { Screens, Tabs } from '../../navigation/screens';
import { colors } from '../../theme';

type RouteKey = keyof typeof Tabs;
const TabIcons: Record<RouteKey, string> = {
  [Tabs.TabMain]: 'homeNavTab',
  [Tabs.TabGlobalVideo]: 'globalNavTab',
  [Tabs.TabForYou]: 'fourU_NavTab',
  [Tabs.TabProfile]: 'profileNavTab',
};

const IconSize = 28;
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

  const unreadChats = useUnreadChatsCount();

  const routes = [
    ...state.routes.slice(0, 2),
    { name: Screens.VideoRecording, key: Screens.VideoRecording },
    ...state.routes.slice(2),
  ];

  return (
    <Animated.View style={style} className="h-[70px] flex-row bg-black4">
      {routes.map((route, index) => {
        const isFocused = state.index === (index > 1 ? index - 1 : index);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === Screens.VideoRecording) {
          return (
            <TouchableOpacity
              key={route.key}
              className="mb-[10px] flex-1 items-center justify-center p-[5px]"
              onPress={onPress}
            >
              <CameraAddIcon size={44} />
            </TouchableOpacity>
          );
        }

        const iconName = TabIcons[route.name as RouteKey];
        const icon = (
          <SvgIcon
            image={iconName}
            color={isFocused ? colors.blue2 : colors.white}
            style={iconName !== 'homeNavTab' ? { width: IconSize, height: IconSize } : {}}
          />
        );

        return (
          <TouchableOpacity
            key={route.key}
            className="mb-[10px] flex-1 items-center justify-center p-[5px]"
            onPress={onPress}
          >
            {route.name === Tabs.TabProfile ? (
              <WithCountCircle count={unreadChats}>{icon}</WithCountCircle>
            ) : (
              icon
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};
