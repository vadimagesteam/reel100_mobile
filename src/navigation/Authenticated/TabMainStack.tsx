import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Screens } from '../screens.ts';
import { MainTabScreen } from '../../screens/App/Tabs/MainTabScreen.tsx';
import UserProfileScreen from '../../screens/Dashboard/UserProfileScreen/index.tsx';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.Home} component={MainTabScreen} />
      <Stack.Screen name={Screens.UserProfile} component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
