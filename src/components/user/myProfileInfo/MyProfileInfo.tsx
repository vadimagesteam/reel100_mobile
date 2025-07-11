import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme';
import { SvgIcon, Avatar } from '../../ui';
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
  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-center">
          <Avatar uri={avatar} name={fullName} />
          <Text className="ml-[5px] text-[16px] font-bold text-silver4">{fullName}</Text>
        </View>
        <TouchableOpacity onPress={onChatPress}>
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>

      <View className="h-[70px] flex-row items-center justify-center rounded-[10px] bg-silver5">
        <CounterSection onPress={onFollowersPress} label="Followers" count={followerCount!} />
        <CounterSection label="Likes" count={likeCount!} />
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
