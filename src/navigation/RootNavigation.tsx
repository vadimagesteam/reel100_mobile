import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from './screens.ts';

import {
  LoginScreen,
  VerifyEmailScreen,
  ResetPasswordScreen,
  ForgotPasswordScreen,
  SignupScreen,
} from '../screens/Guest';

import React from 'react';
import CustomTabNavigator from './CustomTabNavigator';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

export interface RootNavigationProps {
  isAuthenticated: boolean;
}

export function RootNavigation({ isAuthenticated }: RootNavigationProps) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Tabs" component={CustomTabNavigator} />
        ) : (
          <>
            <Stack.Screen name={Screens.Login} component={LoginScreen} />
            <Stack.Screen name={Screens.SignUp} component={SignupScreen} />
            <Stack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />
            <Stack.Screen name={Screens.ResetPassword} component={ResetPasswordScreen} />
            <Stack.Screen name={Screens.VerifyEmail} component={VerifyEmailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
