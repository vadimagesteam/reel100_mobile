import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../../../navigation';
import { AppStackParamList, Screens } from '../../../navigation/screens';
import { useAuthActions, useUser } from '../../../state/user/authStore';
import { getDisplayName } from '../../../state/user/utils';
import { colors } from '../../../theme';
import { useUnreadChatsCount } from '../../chat/hooks/useUnreadChatsCount';
import { Avatar, WithCountCircle, SvgIcon, FlexLoading } from '../../ui';
import { ProfileStats } from '../components/ProfileStats';
import { SocialLinkIcons } from '../components/SocialLinkIcons';

export const OwnProfileHeader = () => {
  const user = useUser();
  const { loadUserProfile } = useAuthActions();
  const navigation = useNavigation();

  // silently refetch profile once tab is active
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [loadUserProfile]),
  );

  const handleChat = () => {
    navigation.navigate(Screens.ChatList);
  };

  const handleStatsScreen = (initialTab: AppStackParamList['ProfileStats']['initialTab']) => {
    navigation.navigate(Screens.ProfileStats, {
      userId: user?.id,
      initialTab,
    });
  };

  const unreadChatsCount = useUnreadChatsCount();

  if (!user) {
    return <FlexLoading />;
  }

  const {
    stats: { likeCount, followCount, followerCount },
    socialNetworks,
  } = user;

  return (
    <View className="mx-2.5 mb-[15px] flex-col gap-y-3">
      <View className="flex-row gap-x-4">
        <Avatar size={88} uri={user.avatar} name={getDisplayName(user)} />

        <View className="flex-1 flex-col justify-between py-1">
          <View className="flex-col gap-y-[6px]">
            <Text className="text-[17px] font-bold text-white">{getDisplayName(user)}</Text>
            <Text className="text-[15px] text-white">
              {new Intl.NumberFormat('en-US', {}).format(likeCount)} likes
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>{socialNetworks && <SocialLinkIcons socialNetworks={socialNetworks} />}</View>

            <WithCountCircle
              className="b-[1px] items-end rounded-xl bg-white p-[4px]"
              Component={TouchableOpacity}
              onPress={handleChat}
              count={unreadChatsCount}
            >
              <SvgIcon image="commentIcon" color={colors.black} style={styles.chatIcon} />
            </WithCountCircle>
          </View>
        </View>
      </View>

      <ProfileStats
        followersCount={followerCount}
        followingCount={followCount}
        onFollowersPress={() => handleStatsScreen('followers')}
        onFollowingPress={() => handleStatsScreen('following')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatIcon: {
    height: 25,
    width: 25,
  },
});
