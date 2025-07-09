import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import clsx from 'clsx';
import { HeaderBackArrowButton } from '../components/appHeader';
import { ProfileStatsScreen } from '../screens/authenticated/screens/ProfileStatsScreen';
import { SelectStateScreen } from '../screens/authenticated/screens/SelectStateScreen';
import { colors } from '../theme/colors';
import { isAndroid } from '../utils';
import { Screens } from './screens';
import {
  LoginScreen,
  VerifyEmailScreen,
  ResetPasswordScreen,
  ForgotPasswordScreen,
  SignupScreen,
} from '../screens/guest';
import { BottomTabNavigator } from './TabsNavigator';
import { navigationRef } from './navigationRef';
import {
  VideoRecordingScreen,
  ChatListScreen,
  ChatDialogScreen,
  ProfileScreen,
} from '../screens/authenticated';
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
            headerStyle: { backgroundColor: colors['dark-bg'] },
            headerTintColor: colors.white,
            contentStyle: { backgroundColor: colors['dark-bg'] },
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => <HeaderBackArrowButton className={clsx(isAndroid && 'mr-8')} />,
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Tabs" component={BottomTabNavigator} />
              <Stack.Screen name={Screens.Profile} component={ProfileScreen} />
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
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name={Screens.EditAccount}
                component={EditProfileScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen name={Screens.ProfileStats} component={ProfileStatsScreen} />
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
