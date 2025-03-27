import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DASHBOARD_ROUTES } from '../routes';
import CustomTabBar from '../../components/navigator/TabNavigator/CustomTabBar';

// screens
import MainScreen from '../../screens/Dashboard/Main/MainScreen';
import FourUScreen from '../../screens/Dashboard/FourU/FourUScreen';
import GlobalVideoScreen from '../../screens/Dashboard/Global/GlobalVideo';
import ProfileScreen from '../../screens/Dashboard/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name={DASHBOARD_ROUTES.MAIN_TAB} component={MainScreen} />
            <Tab.Screen name={DASHBOARD_ROUTES.GLOBAL_VIDEO_TAB} component={GlobalVideoScreen} />
            <Tab.Screen name={DASHBOARD_ROUTES.FOUR_U_TAB} component={FourUScreen} />
            <Tab.Screen name={DASHBOARD_ROUTES.PROFILE_TAB} component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default CustomTabNavigator;
