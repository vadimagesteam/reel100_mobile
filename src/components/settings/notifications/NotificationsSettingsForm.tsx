import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ToggleRow } from './ToggleRow';
import { Divider } from './Divider';

type NotificationSettings = {
  likes: boolean;
  comments: boolean;
  followers: boolean;
  messages: boolean;
};

export const NotificationsSettingsForm = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    likes: true,
    comments: true,
    followers: true,
    messages: true,
  });

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    // todo: implement UI for update setting
  };

  return (
    <ScrollView className="flex-1">
      <Text className="mb-2 mt-6 px-7 text-base font-semibold text-white">Interactions</Text>

      <View className="mx-4 mb-6 rounded-xl bg-[#1c1c1e]">
        <ToggleRow
          label="Likes"
          value={notificationSettings.likes}
          onChange={(val) => updateSetting('likes', val)}
        />
        <Divider />
        <ToggleRow
          label="Comments"
          value={notificationSettings.comments}
          onChange={(val) => updateSetting('comments', val)}
        />
        <Divider />
        <ToggleRow
          label="New Followers"
          value={notificationSettings.followers}
          onChange={(val) => updateSetting('followers', val)}
        />
        <Divider />
        <ToggleRow
          label="Messages"
          value={notificationSettings.messages}
          onChange={(val) => updateSetting('messages', val)}
        />
      </View>
    </ScrollView>
  );
};
