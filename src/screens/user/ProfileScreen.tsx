import { AppHeader } from '../../components/appHeader';
import { HideableView, HidebleContainer } from '../../components/hidebleContainer';
import { OtherProfile, Profile, UserVideoTiles } from '../../components/user';
import { VideoFeedProvider } from '../../components/videoFeed';
import { useRoute } from '../../navigation';
import { useUser } from '../../state/user/authStore';

export const ProfileScreen = () => {
  const { params } = useRoute<'Profile'>();

  const me = useUser();
  const canGoBack = !params?.fromTabs;

  let userId: string;
  if (params) {
    userId = 'user' in params ? params.user.id : 'userId' in params ? params.userId : me.id;
  } else {
    userId = me.id;
  }

  const isMe = userId === me.id;

  return (
    <HidebleContainer className="flex-1 bg-background">
      <HideableView className="mx-2.5 mb-[15px] flex-col gap-[15px]">
        <AppHeader showBackButton={canGoBack} noPx />
        {isMe ? <Profile /> : <OtherProfile />}
      </HideableView>
      <VideoFeedProvider
        initialState={{
          allowDelete: isMe,
        }}
      >
        <UserVideoTiles className="mx-[10px]" userId={userId} withUnfinished={isMe} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};
