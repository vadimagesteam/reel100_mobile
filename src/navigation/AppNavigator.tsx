import { createNativeStackNavigator } from '@react-navigation/native-stack';
import clsx from 'clsx';
import { colors } from '../theme';
import { isAndroid } from '../utils';
import { Screens, AppStackParamList } from './screens';

import { HeaderBackArrowButton } from '../components/appHeader';
import {
  ChatDialogScreen,
  ChatListScreen,
  EditProfileScreen,
  UserFollowingSearchScreen,
  NotificationsSettingsScreen,
  ProfileScreen,
  ProfileStatsScreen,
  SelectStateScreen,
  UserSearchScreen,
  VideoRecordingScreen,
} from '../screens';
import { BottomTabNavigator } from './TabsNavigator';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.primary,
      contentStyle: { backgroundColor: colors.background },

      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => <HeaderBackArrowButton className={clsx(isAndroid && 'mr-8')} />,
    }}
  >
    <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    <Stack.Screen name={Screens.Profile} component={ProfileScreen} />
    <Stack.Screen
      name={Screens.VideoRecording}
      component={VideoRecordingScreen}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      options={{
        title: 'Messages',
        headerShown: true,
      }}
      name={Screens.ChatList}
      component={ChatListScreen}
    />
    <Stack.Screen name={Screens.Chat} component={ChatDialogScreen} />
    <Stack.Screen
      name={Screens.NotificationSettings}
      component={NotificationsSettingsScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      name={Screens.EditProfile}
      component={EditProfileScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen name={Screens.ProfileStats} component={ProfileStatsScreen} />
    <Stack.Screen
      name={Screens.UserSearch}
      component={UserSearchScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.UserFollowingSearch}
      component={UserFollowingSearchScreen}
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
  </Stack.Navigator>
);
