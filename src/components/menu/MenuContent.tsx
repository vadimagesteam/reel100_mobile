import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthActions, useUser } from '../../state/user/authStore';
import { Avatar } from '../ui';
import { MenuListItem } from './MenuListItem';
import { navigationRef } from '../../navigation/navigationRef';
import { Screens } from '../../navigation/screens';

export const MenuContent = () => {
  const user = useUser();
  const { logout } = useAuthActions();
  const insets = useSafeAreaInsets();

  const handleHome = () => {
    navigationRef.navigate('Tabs');
  };

  const handleNotificationsScreen = () => {
    navigationRef.navigate(Screens.NotificationSettings);
  };

  const handleEditProfile = () => {
    navigationRef.navigate(Screens.EditAccount);
  };

  const handleLogout = () => {
    console.log('logout!');
    logout();
  };

  return (
    <View className="flex-1 bg-black1" style={{ paddingTop: insets.top }}>
      {user && (
        <View className="mt-[30px] flex-row items-center gap-2.5 border-b-[0.5px] border-b-silver6 px-[20px] pb-[20px]">
          <Avatar name={`${user.firstName} ${user.lastName}`} />
          <Text className="text-xl font-bold text-white">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
      )}

      <View className="mt-[30px] flex-col gap-[30px] px-5">
        <MenuListItem label="Home" icon="home" onPress={handleHome} />
        <MenuListItem label="Account" icon="person" onPress={handleEditProfile} />
        <MenuListItem
          label="Notifications Settings"
          icon="notifications"
          onPress={handleNotificationsScreen}
        />
        <MenuListItem label="Logout" icon="log-out" onPress={handleLogout} />
      </View>
    </View>
  );
};
