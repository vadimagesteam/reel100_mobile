import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../../routes';
import MainScreen from '../../../screens/Dashboard/Main/MainScreen';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={DASHBOARD_ROUTES.MAIN_SCREEN}
                component={MainScreen}
            />
        </Stack.Navigator>
    );
};

export default MainStack;
