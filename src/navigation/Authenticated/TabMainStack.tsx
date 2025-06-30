import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Screens } from '../screens.ts';
import { MainTabScreen } from '../../screens/App/Tabs/MainTabScreen.tsx';
import MyProfileScreen from '../../screens/App/Tabs/MyProfileScreen.tsx';
import UserProfileScreen from '../../screens/App/Tabs/UserProfileScreen.tsx';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.Home} component={MainTabScreen} />
      <Stack.Screen name={Screens.Profile} component={MyProfileScreen} />
      <Stack.Screen name={Screens.OtherUserProfile} component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
