import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { Button } from '../ui';
import { Divider } from './notifications/Divider';
import { NotificationsSettings } from './notifications/NotificationsSettings';

export const Settings = () => {
  const navigation = useNavigation();
  return (
    <ScrollView className="flex-1">
      <NotificationsSettings />

      <View className="flex-col gap-y-2">
        <Text className="mt-6 px-7 text-base font-semibold text-primary">Danger Zone</Text>
        <View className="mx-4 mb-6 rounded-xl bg-[#1c1c1e] p-4">
          <Button
            onPress={() => {
              navigation.navigate(Screens.DeleteAccount);
            }}
            size="md"
            variant="danger"
          >
            Delete My Account
          </Button>
          <Divider />
        </View>
      </View>
    </ScrollView>
  );
};
