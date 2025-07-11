import { useNavigation } from '../../navigation';
import { AppStackParamList, Screens } from '../../navigation/screens';
import { useUser } from '../../state/user/authStore';
import { getFullName } from '../../state/user/utils';
import { Button } from '../ui';
import { MyProfileInfo } from './myProfileInfo/MyProfileInfo';

export const Profile = () => {
  const user = useUser();
  const navigation = useNavigation();

  if (!user) {
    return null;
  }

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
