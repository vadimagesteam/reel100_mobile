import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedScrollWrapperRoot } from '../../components/animatedScrollWrapper';
import { AppHeader } from '../../components/appHeader';
import { OtherProfileHeader, OwnProfileHeader, UserVideoTiles } from '../../components/user';
import { VideoFeedProvider } from '../../components/videoFeed';
import { useRoute } from '../../navigation';
import { useUser } from '../../state/user/authStore';
import { isAndroid } from '../../utils/platform';

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

  const edges: Edge[] = isMe ? ['top'] : [];
  // Pushed over the tabs there is no tab bar under the grid, so keep its last
  // row clear of the Android navigation bar (see useNavigationBarInset).
  if (canGoBack && isAndroid) {
    edges.push('bottom');
  }

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background">
      <VideoFeedProvider initialState={{ allowDelete: isMe }}>
        {isMe && <AppHeader showBackButton={canGoBack} />}
        <AnimatedScrollWrapperRoot>
          <UserVideoTiles
            sortRanked
            ListHeaderComponent={isMe ? <OwnProfileHeader /> : <OtherProfileHeader />}
            userId={userId}
            withUnfinished={isMe}
          />
        </AnimatedScrollWrapperRoot>
      </VideoFeedProvider>
    </SafeAreaView>
  );
};
