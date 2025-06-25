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
  UserProfile: 'UserProfile',
} as const;
