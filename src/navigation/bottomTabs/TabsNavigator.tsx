import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { Tabs } from '../screens.ts';
import {
  TabMainScreen,
  TabGlobalVideoScreen,
  TabForYouScreen,
  TabMyProfileScreen,
} from '../../screens/authenticated/homeTabs';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          zIndex: 1,
        },
      })}
      detachInactiveScreens={true}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name={Tabs.TabMain} component={TabMainScreen} />
      <Tab.Screen name={Tabs.TabGlobalVideo} component={TabGlobalVideoScreen} />
      <Tab.Screen name={Tabs.TabForYou} component={TabForYouScreen} />
      <Tab.Screen name={Tabs.TabProfile} component={TabMyProfileScreen} />
    </Tab.Navigator>
  );
};
