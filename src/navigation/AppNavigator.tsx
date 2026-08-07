import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { Screens, AppStackParamList } from './screens';

import { HeaderBackArrowButton } from '../components/appHeader';
import {
  ChatDialogScreen,
  ChatListScreen,
  EditProfileScreen,
  SettingsScreen,
  ProfileScreen,
  ProfileStatsScreen,
  SelectStateScreen,
  UserSearchScreen,
  VideoRecordingScreen,
  VideoModalScreen,
  DeleteAccountScreen,
  VideoFeedModalScreen,
  TagFeedScreen,
  SearchSectionScreen,
  AdDebugScreen,
  NotificationsScreen,
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
      fullScreenGestureEnabled: true,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => <HeaderBackArrowButton />,
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
      name={Screens.Notifications}
      component={NotificationsScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.Settings}
      component={SettingsScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      name={Screens.AdDebug}
      component={AdDebugScreen}
      options={{ title: 'Ad Debug', headerShown: true }}
    />
    <Stack.Screen
      name={Screens.EditProfile}
      component={EditProfileScreen}
      options={{ title: 'Edit Profile', headerShown: true }}
    />
    <Stack.Screen name={Screens.DeleteAccount} component={DeleteAccountScreen} />
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
      name={Screens.VideoModal}
      component={VideoModalScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.SearchSection}
      component={SearchSectionScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.TagFeed}
      component={TagFeedScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.VideoFeedModal}
      component={VideoFeedModalScreen}
      options={{
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    />
    <Stack.Screen
      name={Screens.SelectState}
      component={SelectStateScreen}
      options={{
        // The screen renders its own header (title + back button).
        headerShown: false,
        // A full page push (not a modal sheet).
        presentation: 'card',
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    />
  </Stack.Navigator>
);
