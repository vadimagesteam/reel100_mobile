import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../../routes';
import UserProfileScreen from '../../../screens/Dashboard/UserProfileScreen';
import FourUScreen from '../../../screens/Dashboard/FourU/FourUScreen';
import ChatScreen from '../../../screens/Dashboard/Chat/ChatScreen';

const Stack = createStackNavigator();

const FourUStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={DASHBOARD_ROUTES.FOUR_U_SCREEN}
                component={FourUScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.USER_PROFILE_SCREEN}
                component={UserProfileScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.CHAT_SCREEN}
                component={ChatScreen}
            />
        </Stack.Navigator>
    );
};

export default FourUStack;
