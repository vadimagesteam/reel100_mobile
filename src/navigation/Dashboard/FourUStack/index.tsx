import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../../routes';
import UserProfileScreen from '../../../screens/Dashboard/UserProfileScreen';
import FourUScreen from '../../../screens/Dashboard/FourU/FourUScreen';

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
        </Stack.Navigator>
    );
};

export default FourUStack;
