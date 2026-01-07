import React, { useEffect, useLayoutEffect, useContext } from 'react';
import { Alert, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useNavigation, useRoute } from '../../../navigation';
import { Screens, AppStackParamList } from '../../../navigation/screens';
import { getDisplayName } from '../../../state/user/utils';
import { AnimatedScrollWrapperContext } from '../../animatedScrollWrapper/context';
import { useChatNavigation } from '../../chat/hooks/useChatNavigation';
import { Avatar, Button } from '../../ui';
import { ProfileStats } from '../components/ProfileStats';
import { SocialLinkIcons } from '../components/SocialLinkIcons';
import { FollowButton } from '../FollowButton';
import { useUserQuery } from '../hooks';
import { useUserBlocking } from '../hooks/userUserBlocking';
import { OtherProfileHeaderActions } from './OtherProfileHeaderActions';

export const OtherProfileHeader = () => {
  const navigation = useNavigation();
  const { params } = useRoute<'Profile'>();

  if (!params) {
    throw new Error('No route params!');
  }

  const shallowUser = 'user' in params ? params.user : null;
  const userId = 'user' in params ? params.user.id : params.userId;

  const { data: user, error } = useUserQuery(userId);
  const openChat = useChatNavigation();

  const fullName = user ? getDisplayName(user) : shallowUser ? getDisplayName(shallowUser) : '...';

  useEffect(() => {
    if (!user && error) {
      Alert.alert(`An issue occurred when loading ${fullName} profile data`);
    }
  }, [user, error, fullName]);

  const {
    blockedUserQuery: { data: isBlocked },
  } = useUserBlocking(userId);

  const { scrollY } = useContext(AnimatedScrollWrapperContext)!;
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [30, 50], [0, 1], Extrapolation.CLAMP),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () =>
        isBlocked ? (
          <Text className="color-red1">You blocked this profile</Text>
        ) : (
          <Animated.Text style={textStyle} className="w-full text-[16px] font-bold text-primary">
            {fullName}
          </Animated.Text>
        ),
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => <OtherProfileHeaderActions userId={userId} />,
    });
  }, [userId, fullName, isBlocked, navigation, textStyle]);

  const handleStatsScreen = (initialTab: AppStackParamList['ProfileStats']['initialTab']) => {
    navigation.navigate(Screens.ProfileStats, {
      userId: user?.id!,
      initialTab,
    });
  };

  const { stats: { likeCount = 0, followCount = 0, followerCount = 0 } = {}, socialNetworks } =
    user ?? {};

  return (
    <View className="mx-2.5 mb-[15px] flex-col gap-y-3">
      <View className="flex-row gap-x-4">
        <Avatar size={88} uri={user?.avatar} name={fullName} />

        <View className="flex-1 flex-col justify-between py-1">
          <View className="flex-col gap-y-[6px]">
            <Text className="text-[17px] font-bold text-white">{fullName}</Text>
            <Text className="text-[15px] text-white">
              {new Intl.NumberFormat('en-US', {}).format(likeCount)} likes
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>{socialNetworks && <SocialLinkIcons socialNetworks={socialNetworks} />}</View>
          </View>
        </View>
      </View>

      <ProfileStats
        followersCount={followerCount}
        followingCount={followCount}
        onFollowersPress={() => handleStatsScreen('followers')}
        onFollowingPress={() => handleStatsScreen('following')}
      />

      <View className="flex-row gap-x-2">
        {user ? (
          <>
            <FollowButton user={user} />
            <Button
              size="md"
              className="grow"
              onPress={() => {
                openChat(user!.id);
              }}
            >
              Message
            </Button>
          </>
        ) : (
          <>
            <Button size="md" variant="outline" className="grow">
              loading...
            </Button>
            <Button size="md" className="grow">
              loading...
            </Button>
          </>
        )}
      </View>
    </View>
  );
};
