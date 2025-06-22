
export const GuestScreens = {
  Login: 'Login',
  SignUp: 'Sign Up',
  ForgotPassword: 'Forgot Password',
  ResetPassword: 'Reset Password',
  VerifyEmail: 'Verify Email',
} as const;


export const Screens = {
  ...GuestScreens,
} as const;

