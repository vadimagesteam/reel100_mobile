import React from 'react';
import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { SvgIcon } from '../../../UI';
import CustomTabBarButton from '../CustomTabBarButton';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { colors, positionHelpers } from '../../../../styles';
import { cs } from './styles';

const ICONS: Record<string, string> = {
    [DASHBOARD_ROUTES.MAIN_TAB]: 'eyeShow',
    [DASHBOARD_ROUTES.GLOBAL_VIDEO_TAB]: 'eyeShow',
    [DASHBOARD_ROUTES.FOUR_U_TAB]: 'eyeShow',
    [DASHBOARD_ROUTES.PROFILE_TAB]: 'eyeShow',
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
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
                        <LinearGradient
                            start={{ x: 0.1, y: 0.5 }}
                            end={{ x: 0.9, y: 0 }}
                            colors={isFocused ? [colors.blue1, colors.blue] : []}
                            style={[positionHelpers.center, cs.br40]}
                        >
                            <View style={[positionHelpers.center, cs.br40, cs.p5]}>
                                <SvgIcon
                                    image={ICONS[route.name]}
                                    color={colors.white}
                                    style={{ width: widthAndHeightSize, height: widthAndHeightSize }}
                                />
                            </View>
                        </LinearGradient>
                    </CustomTabBarButton>
                );
            })}
        </View>
    );
};

export default CustomTabBar;
