import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DASHBOARD_ROUTES } from '../../routes';
import FullVideoScreen from '../../../screens/Dashboard/Main/FullVideo';
import UserProfileScreen from '../../../screens/Dashboard/UserProfileScreen';
import { MainTabScreen } from '../../../screens/App/Tabs/MainTabScreen.tsx';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={DASHBOARD_ROUTES.MAIN_SCREEN} component={MainTabScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.FULL_VIDEO_SCREEN} component={FullVideoScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.USER_PROFILE_SCREEN} component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
