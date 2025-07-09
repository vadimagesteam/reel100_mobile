import React, { useCallback } from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from '../screens/authenticated';
import { TabBar } from './TabBar';
import { Tabs } from './screens';
import {
  TabMainScreen,
  TabGlobalVideoScreen,
  TabForYouScreen,
} from '../screens/authenticated/homeTabs';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const renderTabBar = useCallback((props: BottomTabBarProps) => <TabBar {...props} />, []);

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
      tabBar={renderTabBar}
    >
      <Tab.Screen name={Tabs.TabMain} component={TabMainScreen} />
      <Tab.Screen name={Tabs.TabGlobalVideo} component={TabGlobalVideoScreen} />
      <Tab.Screen name={Tabs.TabForYou} component={TabForYouScreen} />
      <Tab.Screen
        name={Tabs.TabProfile}
        initialParams={{ fromTabs: true }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};
