import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../routes.ts';
import ProfileScreen from '../../screens/Dashboard/Profile/ProfileScreen';
import VideoRecordScreen from '../../screens/Dashboard/Profile/VideoRecordScreen';
import PreviewVideoScreen from '../../screens/Dashboard/Profile/PreviewVideoScreen';
import UserProfileScreen from '../../screens/Dashboard/UserProfileScreen';
import ChatListScreen from '../../screens/Dashboard/Chat/ChatListScreen';
import ChatScreen from '../../screens/Dashboard/Chat/ChatScreen';
import MyProfileScreen from '../../screens/App/Tabs/MyProfileScreen.tsx';
import { Screens } from '../screens.ts';
import { VideoRecordingScreen } from '../../screens/App/Tabs/VideoRecordingScreen.tsx';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={DASHBOARD_ROUTES.PROFILE_SCREEN} component={MyProfileScreen} />
      <Stack.Screen
        name={Screens.VideoRecording}
        component={VideoRecordingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN} component={VideoRecordScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.PREVIEW_VIDEO_SCREEN} component={PreviewVideoScreen} />
      <Stack.Screen name={Screens.Profile} component={UserProfileScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.CHAT_LIST_SCREEN} component={ChatListScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.CHAT_SCREEN} component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
