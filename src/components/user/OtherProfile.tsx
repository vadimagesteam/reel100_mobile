import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { ProfileStatsRouteParams } from '../../screens';
import { useUser } from '../../state/user/authStore';
import { getFullName } from '../../state/user/utils';
import { useChatNavigation } from '../chat/hooks/useChatNavigation';
import { useFollowMutation, useUnFollowMutation, useUserQuery } from './hooks';
import { ProfileUserInfo } from './otherUserProfileInfo/OtherUserProfileInfo';

export interface ProfileProps {}

export const OtherProfile = ({}: ProfileProps) => {
  const navigation = useNavigation();
  const { params } = useRoute<'Profile'>();

  if (!params?.user) {
    throw new Error('No user in route params');
  }
  const { user: shallowUser } = params;

  const userId = shallowUser.id;

  const me = useUser();
  const { data: user, error } = useUserQuery(userId);
  const follow = useFollowMutation();
  const unfollow = useUnFollowMutation();
  const openChat = useChatNavigation();

  const fullName = user ? getFullName(user) : getFullName(shallowUser);

  useEffect(() => {
    if (!user && error) {
      Alert.alert(`An issue occurred when loading ${fullName} profile data`);
    }
  }, [user, error, fullName]);

  const myFollow = useMemo(
    () => user?.whoms.find(({ who }) => who.id === me.id),
    [me.id, user?.whoms],
  );

  const followUserCallback = () => {
    if (myFollow) {
      unfollow.mutate({ userId, followId: myFollow.id });
    } else {
      follow.mutate({ userId });
    }
  };

  const handleStatsScreen = (initialTab: ProfileStatsRouteParams['initialTab']) => {
    navigation.navigate(Screens.ProfileStats, {
      userId: user?.id!,
      initialTab,
    });
  };

  return (
    <ProfileUserInfo
      avatar={user?.avatar}
      fullName={fullName}
      followerCount={user?.stats?.followerCount}
      likeCount={user?.stats?.likeCount}
      followCount={user?.stats?.followCount}
      followButtonText={myFollow ? 'Unfollow' : 'Follow'}
      followButtonLoading={follow.status === 'pending'}
      onFollowPress={() => followUserCallback()}
      onChatPress={() => {
        openChat(user!.id);
      }}
      onFollowersPress={() => handleStatsScreen('followers')}
      onFollowingPress={() => handleStatsScreen('following')}
    />
  );
};
