import { View } from 'react-native';
import ProfileStatsItem from './ProfileStatsItem';

export interface CounterSectionProps {
  followersCount: number;
  followingCount: number;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

const Divider = () => <View className="h-full w-[0.5px] bg-[#413E42]" />;

export const ProfileStats = ({
  followersCount,
  followingCount,
  onFollowingPress,
  onFollowersPress,
}: CounterSectionProps) => {
  return (
    <View className="h-[70px] flex-row items-center justify-around rounded-[10px] bg-graphite">
      <ProfileStatsItem onPress={onFollowersPress} label="Followers" count={followersCount} />
      <Divider />
      <ProfileStatsItem onPress={onFollowingPress} label="Following" count={followingCount} />
    </View>
  );
};
