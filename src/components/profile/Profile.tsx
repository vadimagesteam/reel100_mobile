import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../navigation/screens';
import { ProfileStatsRouteParams } from '../../screens/authenticated/screens/ProfileStatsScreen';
import { useUser } from '../../state/user/authStore';
import { getFullName } from '../../state/user/utils';
import { Button } from '../ui';
import { MyProfileInfo } from './myProfileInfo/MyProfileInfo';

export const Profile = () => {
  const user = useUser();
  const navigation = useNavigation<any>();

  if (!user) {
    return null;
  }

  const handleUploadAndShare = () => {
    // navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN);
    navigation.navigate(Screens.VideoRecording);
  };

  const handleChat = () => {
    navigation.navigate(Screens.ChatList);
  };

  const handleStatsScreen = (initialTab: ProfileStatsRouteParams['initialTab']) => {
    navigation.navigate(Screens.ProfileStats, {
      userId: user?.id,
      initialTab,
    } as ProfileStatsRouteParams);
  };

  const {
    stats: { likeCount, followCount, followerCount },
  } = user;

  return (
    <>
      <MyProfileInfo
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
