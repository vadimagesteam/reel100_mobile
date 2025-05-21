import React from 'react';
import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SvgIcon } from '../../../UI';
import CustomTabBarButton from '../CustomTabBarButton';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { colors, positionHelpers } from '../../../../styles';
import { cs } from './styles';

const ICONS: Record<string, string> = {
    [DASHBOARD_ROUTES.MAIN_TAB]: 'homeNavTab',
    [DASHBOARD_ROUTES.GLOBAL_VIDEO_TAB]: 'globalNavTab',
    [DASHBOARD_ROUTES.FOUR_U_TAB]: 'fourU_NavTab',
    [DASHBOARD_ROUTES.PROFILE_TAB]: 'profileNavTab',
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const currentRoute = state.routes[state.index];
    const nestedState = descriptors[currentRoute.key]?.navigation?.getState?.();
    const innerRoutes = nestedState?.routes?.[nestedState.index]?.state?.routes || [];

    const isHiddenScreens = innerRoutes.some(
        (r) =>
            r.name === DASHBOARD_ROUTES.FULL_VIDEO_SCREEN ||
            r.name === DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN
    );

    if (isHiddenScreens) {
        return null;
    }
    return (
        <View style={cs.container}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const widthAndHeightSize = isFocused ? 28 : 24;

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
                    <CustomTabBarButton key={route.key} onPress={onPress}>
                        <View style={[positionHelpers.center, cs.br40, cs.p5, positionHelpers.mb10]}>
                            <SvgIcon
                                image={ICONS[route.name]}
                                color={isFocused ? colors.blue2 : colors.white}
                                style={{ width: widthAndHeightSize, height: widthAndHeightSize }}
                            />
                        </View>
                    </CustomTabBarButton>
                );
            })}
        </View>
    );
};

export default CustomTabBar;
