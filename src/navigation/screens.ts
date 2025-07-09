export const GuestScreens = {
  Login: 'Login',
  SignUp: 'Sign Up',
  ForgotPassword: 'Forgot Password',
  ResetPassword: 'Reset Password',
  VerifyEmail: 'Verify Email',
} as const;

export const Tabs = {
  TabMain: 'TabMain',
  TabGlobalVideo: 'TabGlobalVideo',
  TabForYou: 'TabForYou',
  TabProfile: 'TabProfile',
} as const;

export const Screens = {
  ...GuestScreens,
  Home: 'Home',
  Profile: 'UserProfile',
  ForYou: 'ForYouScreen',
  OtherUserProfile: 'Profile',
  ProfileStats: 'ProfileStats',
  VideoRecording: 'VideoRecoding',
  ChatList: 'Chat List',
  Chat: 'Chat',
  NotificationSettings: 'Notification Settings',
  EditAccount: 'Edit Account',
  FriendUserSearch: 'Friend Search',
  SelectState: 'Select State',
} as const;
