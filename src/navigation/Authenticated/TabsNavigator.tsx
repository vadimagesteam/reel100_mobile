import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { Tabs } from '../screens.ts';

// screens
// import GlobalVideoScreen from '../../screens/Dashboard/Global/GlobalVideo';
import { DrawerMenuWrapper } from '../../components/Menu/DrawerMenuWrapper.tsx';
import MainStack from './TabMainStack.tsx';
import GlobalVideoScreen from '../../screens/App/Tabs/GlobalVideoScreen.tsx';
import TabProfileStack from './TabProfileStack.tsx';
import TabForYouStack from './TabForYouStack.tsx';

const Tab = createBottomTabNavigator();

const CustomTabNavigator = () => {
  return (
    <DrawerMenuWrapper>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          lazy: true,
        })}
        detachInactiveScreens={true}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name={Tabs.TabMain} component={MainStack} />
        <Tab.Screen name={Tabs.TabGlobalVideo} component={GlobalVideoScreen} />
        <Tab.Screen name={Tabs.TabForYou} component={TabForYouStack} />
        <Tab.Screen name={Tabs.TabProfile} component={TabProfileStack} />
      </Tab.Navigator>
    </DrawerMenuWrapper>
  );
};

export default CustomTabNavigator;
