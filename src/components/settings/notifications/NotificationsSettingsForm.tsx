import { Alert, ScrollView, Text, View } from 'react-native';
import { useNotificationSettings } from '../../../state/user/authStore';
import { NotificationSettings } from '../../../state/user/types';
import { ToggleRow } from './ToggleRow';
import { Divider } from './Divider';

export const NotificationsSettingsForm = () => {
  const [notificationSettings, saveNotificationSettings] = useNotificationSettings();
  const { comments, messages, followers, likes } = notificationSettings;

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const { type, message } = await saveNotificationSettings({
      ...notificationSettings,
      [key]: value,
    });
    if (type === 'error') {
      Alert.alert('Save Failed', message ?? 'Server internal error');
    }
  };

  return (
    <ScrollView className="flex-1">
      <Text className="text-primary mb-2 mt-6 px-7 text-base font-semibold">Interactions</Text>

      <View className="mx-4 mb-6 rounded-xl bg-[#1c1c1e]">
        <ToggleRow label="Likes" value={likes} onChange={(val) => updateSetting('likes', val)} />
        <Divider />
        <ToggleRow
          label="Comments"
          value={comments}
          onChange={(val) => updateSetting('comments', val)}
        />
        <Divider />
        <ToggleRow
          label="New Followers"
          value={followers}
          onChange={(val) => updateSetting('followers', val)}
        />
        <Divider />
        <ToggleRow
          label="Messages"
          value={messages}
          onChange={(val) => updateSetting('messages', val)}
        />
      </View>
    </ScrollView>
  );
};
