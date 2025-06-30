import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DASHBOARD_ROUTES } from '../routes.ts';
// import FourUScreen from '../../screens/Dashboard/FourU/FourUScreen';
import UserProfileScreen from '../../screens/Dashboard/UserProfileScreen';
import ChatScreen from '../../screens/Dashboard/Chat/ChatScreen';
import ForYouScreen from '../../screens/App/Tabs/ForYouScreen.tsx';
import { Screens } from '../screens.ts';

const Stack = createStackNavigator();

const FourUStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.ForYou} component={ForYouScreen} />
      <Stack.Screen name={Screens.OtherUserProfile} component={UserProfileScreen} />
      <Stack.Screen name={DASHBOARD_ROUTES.CHAT_SCREEN} component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default FourUStack;
