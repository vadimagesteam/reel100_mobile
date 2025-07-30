import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { UserType } from '../../../state/user/types';
import { colors } from '../../../theme';
import { SvgIcon, Button, Avatar, Reel100Gradient } from '../../ui';
import { FollowButton } from '../FollowButton';
import CounterSection from '../myProfileInfo/CounterSection';

interface ProfileUserInfoProps {
  fullName: string;
  user: UserType;
  avatar?: string | null;
  followerCount: number | undefined;
  likeCount: number | undefined;
  followCount: number | undefined;
  onChatPress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
}

export const ProfileUserInfo = ({
  fullName,
  avatar,
  followerCount,
  likeCount,
  followCount,
  onChatPress,
  onFollowersPress,
  onFollowingPress,
  user,
}: ProfileUserInfoProps) => {
  return (
    <>
      <View className="flex-row justify-between">
        <TouchableOpacity disabled={true} className="opacity-0" onPress={() => true}>
          <SvgIcon image="commentIcon" style={styles.chatIcon} color={colors.white} />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <View className="items-center">
            <Avatar uri={avatar} name={fullName} size={70} />
            <Text className="ml-[5px] text-[20px] font-bold text-primary">{fullName}</Text>
          </View>
          <FollowButton user={user} />
        </View>
        <TouchableOpacity className="justify-end pb-[14px] pr-[20px]" onPress={onChatPress}>
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>

      <View className="h-[70px] flex-row items-center justify-center rounded-[10px] bg-graphite">
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

export const styles = StyleSheet.create({
  containerGradient: {
    height: 70,
    borderRadius: 10,
  },
  minWidth60: {
    width: 120,
  },
  chatIcon: {
    height: 25,
    width: 25,
  },
});
