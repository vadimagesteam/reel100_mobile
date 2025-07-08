import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectStateScreen } from '../screens/authenticated/screens/SelectStateScreen';
import { colors } from '../theme/colors';

import { Screens } from './screens.ts';
import {
  LoginScreen,
  VerifyEmailScreen,
  ResetPasswordScreen,
  ForgotPasswordScreen,
  SignupScreen,
} from '../screens/guest';

import React from 'react';
import { BottomTabNavigator } from './bottomTabs/TabsNavigator';
import { navigationRef } from './navigationRef';
import UserProfileScreen from '../screens/authenticated/screens/UserProfileScreen';
import { VideoRecordingScreen, ChatListScreen, ChatDialogScreen } from '../screens/authenticated';
import { DrawerMenuWrapper } from '../components/menu/DrawerMenuWrapper';
import { NotificationsSettingsScreen } from '../screens/authenticated/screens/NotificationsSettingsScreen';
import { EditProfileScreen } from '../screens/authenticated/screens/EditProfileScreen';
import { FriendUserSearch } from '../screens/authenticated/screens/FriendUserSearch';

const Stack = createNativeStackNavigator();

export interface RootNavigationProps {
  isAuthenticated: boolean;
}

export function RootNavigation({ isAuthenticated }: RootNavigationProps) {
  return (
    <DrawerMenuWrapper>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
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
              <Stack.Screen
                name={Screens.NotificationSettings}
                component={NotificationsSettingsScreen}
              />
              <Stack.Screen name={Screens.EditAccount} component={EditProfileScreen} />
              <Stack.Screen
                name={Screens.FriendUserSearch}
                component={FriendUserSearch}
                options={{
                  animation: 'fade_from_bottom',
                  animationDuration: 200,
                }}
              />
              <Stack.Screen
                name={Screens.SelectState}
                component={SelectStateScreen}
                options={{
                  title: 'Choose Your State',
                  headerTitleStyle: { color: colors.white },
                  headerStyle: {
                    backgroundColor: colors.black4,
                  },
                  headerShown: true,
                  presentation: 'pageSheet',
                  animation: 'fade_from_bottom',
                  animationDuration: 200,
                }}
              />
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
