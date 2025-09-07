import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedScrollWrapperRoot } from '../../components/animatedScrollWrapper';
import { AppHeader } from '../../components/appHeader';
import { OtherProfileHeader, OwnProfileHeader, UserVideoTiles } from '../../components/user';
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
    <SafeAreaView edges={isMe ? ['top'] : []} className="flex-1 bg-background">
      <VideoFeedProvider
        initialState={{
          allowDelete: isMe,
        }}
      >
        <AnimatedScrollWrapperRoot>
          <UserVideoTiles
            ListHeaderComponent={
              <>
                {isMe && <AppHeader showBackButton={canGoBack} />}
                <View className="mx-2.5 mb-[15px] flex-col gap-[15px]">
                  {isMe ? <OwnProfileHeader /> : <OtherProfileHeader />}
                </View>
              </>
            }
            userId={userId}
            withUnfinished={isMe}
          />
        </AnimatedScrollWrapperRoot>
      </VideoFeedProvider>
    </SafeAreaView>
  );
};
