import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { ProfileStatsRouteParams } from '../../screens';
import { getDisplayName } from '../../state/user/utils';
import { useChatNavigation } from '../chat/hooks/useChatNavigation';
import { useUserQuery } from './hooks';
import { ProfileUserInfo } from './otherUserProfileInfo/OtherUserProfileInfo';

export const OtherProfile = () => {
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
      user={user || ({ id: userId } as any)}
      onChatPress={() => {
        openChat(user!.id);
      }}
      onFollowersPress={() => handleStatsScreen('followers')}
      onFollowingPress={() => handleStatsScreen('following')}
    />
  );
};
