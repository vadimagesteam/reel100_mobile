import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useNavigation } from '../../navigation';
import { AppStackParamList, Screens } from '../../navigation/screens';
import { useAuthActions, useUser } from '../../state/user/authStore';
import { getFullName } from '../../state/user/utils';
import { Button } from '../ui';
import { MyProfileInfo } from './myProfileInfo/MyProfileInfo';

export const Profile = () => {
  const user = useUser();
  const { loadUserProfile } = useAuthActions();
  const navigation = useNavigation();

  // silently refetch profile once tab is active
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [loadUserProfile]),
  );

  const handleUploadAndShare = () => {
    navigation.navigate(Screens.VideoRecording);
  };

  const handleChat = () => {
    navigation.navigate(Screens.ChatList);
  };

  const handleStatsScreen = (initialTab: AppStackParamList['ProfileStats']['initialTab']) => {
    navigation.navigate(Screens.ProfileStats, {
      userId: user?.id,
      initialTab,
    });
  };

  if (!user) {
    return null;
  }

  const {
    stats: { likeCount, followCount, followerCount },
  } = user;

  return (
    <>
      <MyProfileInfo
        avatar={user.avatar}
        likeCount={likeCount}
        followerCount={followerCount}
        followCount={followCount}
        fullName={getFullName(user)}
        onChatPress={handleChat}
        onFollowersPress={() => handleStatsScreen('followers')}
        onFollowingPress={() => handleStatsScreen('following')}
      />
      <Button onPress={handleUploadAndShare}>Upload & Share</Button>
    </>
  );
};
