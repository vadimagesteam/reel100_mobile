import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../../routes';
import ProfileScreen from '../../../screens/Dashboard/Profile/ProfileScreen';
import VideoRecordScreen from '../../../screens/Dashboard/Profile/VideoRecordScreen';
import PreviewVideoScreen from '../../../screens/Dashboard/Profile/PreviewVideoScreen';
import UserProfileScreen from '../../../screens/Dashboard/UserProfileScreen';
import ChatScreen from '../../../screens/Dashboard/Chat/ChatScreen';
import ChatListScreen from '../../../screens/Dashboard/Chat/ChatListScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name={DASHBOARD_ROUTES.PROFILE_SCREEN}
                component={ProfileScreen}

            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN}
                component={VideoRecordScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.PREVIEW_VIDEO_SCREEN}
                component={PreviewVideoScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.USER_PROFILE_SCREEN}
                component={UserProfileScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.CHAT_LIST_SCREEN}
                component={ChatListScreen}
            />
            <Stack.Screen
                name={DASHBOARD_ROUTES.CHAT_SCREEN}
                component={ChatScreen}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;
