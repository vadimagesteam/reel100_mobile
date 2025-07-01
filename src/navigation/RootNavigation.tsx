import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from './screens.ts';

import {
  LoginScreen,
  VerifyEmailScreen,
  ResetPasswordScreen,
  ForgotPasswordScreen,
  SignupScreen,
} from '../screens/guest';

import React from 'react';
import { BottomTabNavigator } from './bottomTabs/TabsNavigator.tsx';
import { navigationRef } from './navigationRef';
import UserProfileScreen from '../screens/authenticated/screens/UserProfileScreen.tsx';
import { VideoRecordingScreen, ChatListScreen, ChatDialogScreen } from '../screens/authenticated';
// import ChatListScreen from '../screens/Dashboard/Chat/ChatListScreen';
// import ChatScreen from '../screens/Dashboard/Chat/ChatScreen';
import { DrawerMenuWrapper } from '../components/Menu/DrawerMenuWrapper.tsx';

const Stack = createNativeStackNavigator();

export interface RootNavigationProps {
  isAuthenticated: boolean;
}

export function RootNavigation({ isAuthenticated }: RootNavigationProps) {
  return (
    <DrawerMenuWrapper>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Tabs" component={BottomTabNavigator} />
              <Stack.Screen name={Screens.OtherUserProfile} component={UserProfileScreen} />
              <Stack.Screen
                name={Screens.VideoRecording}
                component={VideoRecordingScreen}
                options={{ gestureEnabled: false }}
              />
              <Stack.Screen name={Screens.ChatList} component={ChatListScreen} />
              <Stack.Screen name={Screens.Chat} component={ChatDialogScreen} />
            </>
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
    </DrawerMenuWrapper>
  );
}
