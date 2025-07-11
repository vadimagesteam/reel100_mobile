import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/appHeader';
import { HideableView, HidebleContainer } from '../../components/hidebleContainer';
import { OtherProfile, Profile, UserVideoTiles } from '../../components/profile';
import { VideoFeedProvider } from '../../components/videoFeed';
import { useUser } from '../../state/user/authStore';
import { UserBase } from '../../state/user/types';

export const ProfileScreen = () => {
  const { params } = useRoute<{
    key: string;
    name: string;
    params:
      | { fromTabs?: boolean; user: Pick<UserBase, 'id' | 'firstName' | 'lastName'> }
      | undefined;
  }>();

  const me = useUser();
  const canGoBack = !params?.fromTabs;
  const userId = params?.user?.id ?? me.id;
  const isMe = userId === me.id;

  return (
    <HidebleContainer className="flex-1 bg-background">
      <HideableView className="mx-2.5 mb-[15px] flex-col gap-[15px]">
        <AppHeader showBackButton={canGoBack} noPx />
        {isMe ? <Profile /> : <OtherProfile />}
      </HideableView>
      <VideoFeedProvider>
        <UserVideoTiles className="mx-[10px]" userId={userId} withUnfinished={isMe} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};
