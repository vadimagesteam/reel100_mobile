import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/appTabBar/TabBar';
import { BottomTabParamList, Tabs, Screens } from './screens';
import {
  TabMainScreen,
  TabGlobalVideoScreen,
  TabForYouScreen,
  ProfileScreen,
  VideoRecordingScreen,
} from '../screens';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={() => ({
      headerShown: false,
      lazy: true,
      tabBarStyle: {
        zIndex: 1,
      },
    })}
    detachInactiveScreens={true}
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBar={(props) => <TabBar {...props} />}
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
