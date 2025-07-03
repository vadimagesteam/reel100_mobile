import { useEffect, useState } from 'react';
import { AppHeader } from '../../../components/appHeader/AppHeader.tsx';
import { UserVideoTiles } from '../../../components/profile';
import { HideableView, HidebleContainer } from '../../../components/hidebleContainer';
import { VideoFeedProvider } from '../../../components/videoFeed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProfileUserInfo } from '../../../components/profile/otherUserProfileInfo/OtherUserProfileInfo.tsx';
import { DASHBOARD_ROUTES } from '../../../navigation/routes.ts';
import { useUserQuery } from '../../../components/profile/hooks/useUserQuery.ts';
import { Alert } from 'react-native';
import { useFollowMutation } from '../../../components/profile/hooks/useFollowMutation.ts';

const UserProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute<{
    key: string;
    name: string;
    params: { user: { id: string; firstName: string; lastName: string } };
  }>();

  const [isFollowed, setIsFollowed] = useState(false);

  if (!params.user) {
    throw new Error('No user in route params');
  }
  const { user: shallowUser } = params;
  const userId = shallowUser.id;

  const { data: user, error } = useUserQuery(userId);
  const follow = useFollowMutation();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : `${shallowUser.firstName} ${shallowUser.lastName}`;

  useEffect(() => {
    if (!user && error) {
      Alert.alert(`An issue occurred when loading ${fullName} profile data`);
    }
  }, [user, error, fullName]);

  const followUserCallback = () => {
    setIsFollowed(true);
    follow.mutate({
      user_id: userId,
    });
  };

  return (
    <HidebleContainer className="flex-1 bg-black4">
      <HideableView className="mx-[10px] mb-[15px] flex-col gap-[15px]">
        <AppHeader
          stateSelect={false}
          backButton
          style={{
            marginLeft: 0,
            marginRight: 0,
          }}
        />
        <ProfileUserInfo
          fullname={fullName}
          followerCount={user?.stats?.followerCount}
          likeCount={user?.stats?.likeCount}
          followCount={user?.stats?.followCount}
          checkFollowButton={isFollowed ? 'Unfollow' : 'Follow'}
          onFollowPress={() => followUserCallback()}
          onChatPress={() => {
            navigation.navigate(DASHBOARD_ROUTES.CHAT_SCREEN, {
              firstName: user?.firstName,
              lastName: user?.lastName,
            });
          }}
        />
      </HideableView>
      <VideoFeedProvider>
        <UserVideoTiles className="mx-[10px]" userId={userId!} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

export default UserProfileScreen;
