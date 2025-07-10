import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../../../theme';
import { SvgIcon, Button, Avatar, Reel100Gradient } from '../../ui';
import CounterSection from '../myProfileInfo/CounterSection';

interface ProfileUserInfoProps {
  fullName: string;
  followerCount: number | undefined;
  likeCount: number | undefined;
  followCount: number | undefined;
  followButtonText: string;
  followButtonLoading?: boolean;
  onFollowPress: () => void;
  onChatPress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
}

export const ProfileUserInfo = ({
  fullName,
  followerCount,
  likeCount,
  followCount,
  followButtonText,
  followButtonLoading,
  onFollowPress,
  onChatPress,
  onFollowersPress,
  onFollowingPress,
}: ProfileUserInfoProps) => {
  return (
    <>
      <View className="flex-row justify-between">
        <TouchableOpacity disabled={true} className="opacity-0" onPress={() => true}>
          <SvgIcon image="commentIcon" style={styles.chatIcon} color={colors.white} />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <View className="items-center">
            <Avatar name={fullName} size={70} />
            <Text className="ml-[5px] text-[20px] font-bold text-primary">{fullName}</Text>
          </View>
          <Button
            loading={followButtonLoading}
            onPress={onFollowPress}
            className="mt-[10px] min-w-[120px]"
            size="md"
            variant="gradient"
          >
            {followButtonText}
          </Button>
        </View>
        <TouchableOpacity className="justify-end pb-[14px] pr-[20px]" onPress={onChatPress}>
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>

      <Reel100Gradient className="h-[70px] flex-row items-center rounded-[10px]">
        <CounterSection onPress={onFollowersPress} label="Followers" count={followerCount!} />
        <CounterSection
          className="border-l-[0.5px] border-r-[0.5px] border-l-silver3 border-r-silver3"
          label="Likes"
          count={likeCount!}
        />
        <CounterSection onPress={onFollowingPress} label="Following" count={followCount!} />
      </Reel100Gradient>
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
