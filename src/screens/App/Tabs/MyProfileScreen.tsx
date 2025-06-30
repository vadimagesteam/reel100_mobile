import { AppHeader } from '../../../components/AppHeader/AppHeader.tsx';
import { MyProfileInfo } from '../../../components/Profile';
import { useUser } from '../../../state/user/authStore.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { UserVideoTiles } from '../../../components/Profile';
import { HideableView, HidebleContainer } from '../../../components/HidebleContainer';
import { VideoFeedProvider } from '../../../components/VideoFeed';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../navigation/routes.ts';
import { Screens } from '../../../navigation/screens.ts';

const MyProfileScreen = () => {
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
    navigation.navigate(DASHBOARD_ROUTES.CHAT_LIST_SCREEN);
  };

  return (
    <HidebleContainer className="flex-1 bg-black4">
      <HideableView className="mx-[10px] mb-[15px] flex-col gap-[15px]">
        <AppHeader className="mx-[0px]" stateSelect />
        <MyProfileInfo
          likeCount={0}
          followerCount={0}
          followCount={0}
          fullName={`${user.firstName} ${user.lastName}`}
          onChatPress={handleChat}
        />
        <Button
          // buttonClassName="bg-white1"
          // textClassName="text-blue3"
          onPress={handleUploadAndShare}
        >
          Upload & Share
        </Button>
      </HideableView>
      <VideoFeedProvider>
        <UserVideoTiles className="mx-[10px]" userId={user.id!} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

export default MyProfileScreen;
