import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearStoreCaches } from '../../lib/createPersistStore';
import { useAuthActions, useUser } from '../../state/user/authStore';
import { getDisplayName } from '../../state/user/utils';
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

  const handleSettingsScreen = () => {
    navigationRef.navigate(Screens.Settings);
  };

  const handleEditProfile = () => {
    navigationRef.navigate(Screens.EditProfile);
  };

  const handleAdDebug = () => {
    navigationRef.navigate(Screens.AdDebug);
  };

  const handleLogout = async () => {
    await logout();
    await clearStoreCaches();
  };

  const showDebug =
    user.username.includes('@vadimages') ||
    ['aw.hamer@gmail.com', 'nikolavuk@yahoo.com', 'nikola.vukovic23@gmail.com'].includes(
      user.username,
    );

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {user && (
        <View className="mt-[30px] flex-row items-center gap-2.5 border-b-[0.5px] border-b-silver6 px-[20px] pb-[20px]">
          <Avatar uri={user.avatar} name={getDisplayName(user)} />
          <Text className="text-xl font-bold text-primary">{getDisplayName(user)}</Text>
        </View>
      )}

      <ScrollView contentContainerClassName="mt-[30px] flex-col gap-[30px] px-5">
        <MenuListItem label="Home" icon="home" onPress={handleHome} />
        <MenuListItem label="Account" icon="person" onPress={handleEditProfile} />
        <MenuListItem label="Settings" icon="settings" onPress={handleSettingsScreen} />
        {showDebug && <MenuListItem label="Ad Debug" icon="flask" onPress={handleAdDebug} />}
        <MenuListItem label="Logout" icon="log-out" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
};
