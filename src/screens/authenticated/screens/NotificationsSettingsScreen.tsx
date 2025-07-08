import { NotificationsSettingsForm } from '../../../components/settings/notifications/NotificationsSettingsForm.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '../../../components/ui';
import { colors } from '../../../styles';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

export const NotificationsSettingsScreen = () => {
  const navigation = useNavigation();

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.clear();
  }, [queryClient]);

  return (
    <SafeAreaView className="flex-1 bg-black4">
      <View className="flex-row items-center gap-4 px-4">
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <SvgIcon image="backArrow" color={colors.white} />
        </TouchableOpacity>
        <Text className="text-3xl text-white">Notifications Settings</Text>
      </View>
      <NotificationsSettingsForm />
    </SafeAreaView>
  );
};
