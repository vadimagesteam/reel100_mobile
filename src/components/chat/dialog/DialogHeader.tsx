import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../appHeader';
import { Avatar } from '../../ui';
import { BlockUserButton } from '../../user/BlockUserButton';

export interface DialogHeaderProps {
  avatar?: string | null;
  displayName: string;
  // lastActive?: string;
  onPress: () => void;
  interlocutorUserId?: string;
}

export const DialogHeader = ({
  onPress,
  displayName,
  interlocutorUserId,
  avatar,
}: DialogHeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between border-b-[0.2px] border-b-silver/40 px-4 pb-2"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center gap-4">
        <HeaderBackArrowButton />
        <TouchableOpacity onPress={onPress} className="flex-row gap-2.5">
          <Avatar uri={avatar} name={displayName} size={40} />
          <View className="flex-col justify-center gap-0.5">
            <Text className="text-base font-bold text-primary">{displayName}</Text>
            {/*<Text className="text-sm text-muted">a few seconds ago</Text>*/}
          </View>
        </TouchableOpacity>
      </View>
      {interlocutorUserId && (
        <BlockUserButton className="min-w-[70px]" size="sm" userId={interlocutorUserId} />
      )}
    </View>
  );
};
