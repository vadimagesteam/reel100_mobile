import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme';
import { useUnreadChatsCount } from '../../chat/hooks/useUnreadChatsCount';
import { SvgIcon, Avatar, WithCountCircle } from '../../ui';
import CounterSection from './CounterSection';

interface ProfileInfoProps {
  avatar: string | null;
  fullName: string;
  followerCount: number | undefined;
  likeCount: number | undefined;
  followCount: number | undefined;
  onChatPress: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export const MyProfileInfo = ({
  fullName,
  avatar,
  followerCount,
  likeCount,
  followCount,
  onChatPress,
  onFollowersPress,
  onFollowingPress,
}: ProfileInfoProps) => {
  const unreadChatsCount = useUnreadChatsCount();
  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-center">
          <Avatar uri={avatar} name={fullName} />
          <Text className="ml-[5px] text-[16px] font-bold text-silver4">{fullName}</Text>
        </View>
        <WithCountCircle
          Component={TouchableOpacity}
          onPress={onChatPress}
          count={unreadChatsCount}
        >
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </WithCountCircle>
      </View>

      <View className="bg-graphite h-[70px] flex-row items-center justify-center rounded-[10px]">
        <CounterSection onPress={onFollowersPress} label="Followers" count={followerCount!} />
        <CounterSection
          className="border-l-[0.5px] border-r-[0.5px] border-l-silver3 border-r-silver3"
          label="Likes"
          count={likeCount!}
        />
        <CounterSection onPress={onFollowingPress} label="Following" count={followCount!} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatIcon: {
    height: 25,
    width: 25,
  },
});
