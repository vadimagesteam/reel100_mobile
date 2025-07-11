import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../appHeader';
import { Avatar } from '../../ui';

export interface DialogHeaderProps {
  avatar?: string | null;
  displayName: string;
  // lastActive?: string;
}

export const DialogHeader = ({ displayName, avatar }: DialogHeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between border-b-[0.2px] border-b-silver/40 px-4 pb-2"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center gap-4">
        <HeaderBackArrowButton />
        <View className="flex-row gap-2.5">
          <Avatar uri={avatar} name={displayName} size={40} />
          <View className="flex-col gap-0.5">
            <Text className="text-base font-bold text-primary">{displayName}</Text>
            <Text className="text-sm text-muted">a few seconds ago</Text>
          </View>
        </View>
      </View>
      {/*<TouchableOpacity className="rounded-[6px] bg-danger p-1" onPress={() => true}>
        <Text className="text-base font-medium text-primary">Block user</Text>
      </TouchableOpacity>*/}
    </View>
  );
};
