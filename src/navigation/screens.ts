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

  // In app screens
  Home: 'Home',
  Profile: 'Profile',
  ForYou: 'ForYou',
  ProfileStats: 'ProfileStats',
  VideoRecording: 'VideoRecording',
  ChatList: 'ChatList',
  Chat: 'Chat',
  NotificationSettings: 'NotificationSettings',
  EditProfile: 'EditProfile',
  UserFollowingSearch: 'UserFollowingSearch',
  UserSearch: 'UserSearch',
  SelectState: 'SelectState',
  VideoModal: 'VideoModal',
} as const;

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyEmail: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  Profile:
    | { fromTabs?: boolean; user: Pick<UserBase, 'id' | 'firstName' | 'lastName'> }
    | { fromTabs?: boolean; userId: string }
    | undefined;
  VideoRecording: undefined;
  ChatList: undefined;
  Chat: { chatId?: string; userId: string };
  NotificationSettings: undefined;
  EditProfile: undefined;
  ProfileStats: {
    userId: string;
    initialTab: 'followers' | 'following';
  };
  UserFollowingSearch: {
    onSelected: (user: UserBase) => void;
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
};

export type BottomTabParamList = {
  TabMain: undefined;
  TabGlobalVideo: undefined;
  TabForYou: undefined;
  TabProfile: { fromTabs: boolean };
};
