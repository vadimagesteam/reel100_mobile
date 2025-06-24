import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthActions, useUser } from '../../state/user/authStore.ts';
import { MenuListItem } from './MenuListItem.tsx';
import { DASHBOARD_ROUTES } from '../../navigation/routes.ts';

export const MenuContent = () => {
  const user = useUser();
  const { logout } = useAuthActions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    console.log('logout!');
    logout();
  };

  // todo: fix menu path
  const handleHome = () => {
    navigation.navigate(DASHBOARD_ROUTES.MAIN_TAB);
  };

  return (
    <View className="flex-1 bg-black1" style={{ paddingTop: insets.top }}>
      <View className="mt-[30px] flex-row items-center gap-2.5 border-b-[0.5px] border-b-silver6 px-[20px] pb-[20px]">
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }}
          className="h-[60px] w-[60px]"
        />
        <Text className="text-xl font-bold text-white">
          {user?.firstName} {user?.lastName}
        </Text>
      </View>

      <View className="mt-[30px] flex-col gap-[30px] px-5">
        <MenuListItem label="Home" icon="homeNavTab" />
        <MenuListItem label="Logout" icon="logoutIcon" onPress={handleLogout} />
      </View>
    </View>
  );
};
