import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../../state/user/authStore';
import { colors } from '../../../theme';
import { useUnreadChatsCount } from '../../chat/hooks/useUnreadChatsCount';
import { SvgIcon, Avatar, WithCountCircle } from '../../ui';
import { SocialNetworks } from '../otherUserProfileInfo/SocialNetworks';
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

  const me = useUser();

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

      {me.socialNetworks && <SocialNetworks socialNetworks={me.socialNetworks} />}

      <View className="h-[70px] flex-row items-center justify-center rounded-[10px] bg-graphite">
        <CounterSection onPress={onFollowersPress} label="Followers" count={followerCount!} />
        <CounterSection
          className="border-l-[0.5px] border-r-[0.5px] border-l-[#413E42] border-r-[#413E42]"
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
