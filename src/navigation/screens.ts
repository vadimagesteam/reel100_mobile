import { usePostsInfiniteQueryParams } from '../components/videoFeed/hooks';
import { VideoFeedStore } from '../components/videoFeed/provider/videoFeedStore';
import { VideoPost } from '../components/videoFeed/queries/apiVideosFetcher';
import { StateItem } from '../state/app/uiStore';
import { UserBase } from '../state/user/types';

export const Tabs = {
  TabMain: 'TabMain',
  TabGlobalVideo: 'TabGlobalVideo',
  TabForYou: 'TabForYou',
  TabProfile: 'TabProfile',
} as const;

export const Screens = {
  // Auth screens
  Login: 'Login',
  SignUp: 'SignUp',
  ForgotPassword: 'ForgotPassword',
  ResetPassword: 'ResetPassword',
  VerifyEmail: 'VerifyEmail',
  Eula: 'Eula',

  // In app screens
  Home: 'Home',
  Profile: 'Profile',
  ForYou: 'ForYou',
  ProfileStats: 'ProfileStats',
  VideoRecording: 'VideoRecording',
  ChatList: 'ChatList',
  Chat: 'Chat',
  Settings: 'Settings',
  DeleteAccount: 'DeleteAccount',
  EditProfile: 'EditProfile',
  AdDebug: 'AdDebug',
  UserSearch: 'UserSearch',
  SelectState: 'SelectState',
  VideoModal: 'VideoModal',
  VideoFeedModal: 'VideoFeedModal',
  Notifications: 'Notifications',
} as const;

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyEmail: undefined;
  Eula: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  Profile:
    | { fromTabs?: boolean; user: Pick<UserBase, 'id' | 'firstName' | 'lastName' | 'nickname'> }
    | { fromTabs?: boolean; userId: string }
    | undefined;
  VideoRecording: undefined;
  ChatList: undefined;
  Chat: { chatId?: string; userId: string };
  Settings: undefined;
  DeleteAccount: undefined;
  EditProfile: undefined;
  AdDebug: undefined;
  ProfileStats: {
    userId: string;
    initialTab: 'followers' | 'following';
  };
  UserSearch: undefined;
  SelectState: {
    placeholderValue?: string;
    onSelected: (state: StateItem) => void;
  };
  VideoModal:
    | {
        video: VideoPost;
      }
    | { videoId: string; commentId?: string };
  VideoFeedModal: {
    queryParams: usePostsInfiniteQueryParams;
    feedState: Partial<Omit<VideoFeedStore, 'actions'>>;
    videoIndex?: number;
  };
  Notifications: undefined;
};

export type BottomTabParamList = {
  TabMain: undefined;
  TabGlobalVideo: undefined;
  TabForYou: undefined;
  TabProfile: { fromTabs: boolean };
};
