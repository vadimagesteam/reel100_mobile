import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../../routes';
import MainScreen from '../../../screens/Dashboard/Main/MainScreen';
import FullVideoScreen from '../../../screens/Dashboard/Main/FullVideo';
import UserProfileScreen from '../../../screens/Dashboard/UserProfileScreen';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={DASHBOARD_ROUTES.MAIN_SCREEN}
                component={MainScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.FULL_VIDEO_SCREEN}
                component={FullVideoScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.USER_PROFILE_SCREEN}
                component={UserProfileScreen}
            />
        </Stack.Navigator>
    );
};

export default MainStack;
