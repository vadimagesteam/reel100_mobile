import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DASHBOARD_ROUTES } from '../routes';
import CustomTabBar from '../../components/old/navigator/TabNavigator/CustomTabBar';

// screens
import GlobalVideoScreen from '../../screens/Dashboard/Global/GlobalVideo';
import MainStack from '../Dashboard/MainStack';
import ProfileStack from '../Dashboard/ProfileStack';
import FourUStack from '../Dashboard/FourUStack';
import { DrawerMenuWrapper } from '../../components/Menu/DrawerMenuWrapper.tsx';

const Tab = createBottomTabNavigator();

const CustomTabNavigator = () => {
  return (
    <DrawerMenuWrapper>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          lazy: true,
        })}
        detachInactiveScreens={true}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name={DASHBOARD_ROUTES.MAIN_TAB} component={MainStack} />
        <Tab.Screen name={DASHBOARD_ROUTES.GLOBAL_VIDEO_TAB} component={GlobalVideoScreen} />
        <Tab.Screen name={DASHBOARD_ROUTES.FOUR_U_TAB} component={FourUStack} />
        <Tab.Screen name={DASHBOARD_ROUTES.PROFILE_TAB} component={ProfileStack} />
      </Tab.Navigator>
    </DrawerMenuWrapper>
  );
};

export default CustomTabNavigator;
