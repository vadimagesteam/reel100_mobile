export const ONBOARDING_ROUTES = {
    WELCOME_SCREEN: 'Welcome_Screen',
    SIGNUP_SCREEN: 'SignUp_Screen',
    VERIFY_EMAIL_SCREEN: 'Verify_Email_Screen',
    LOGIN_SCREEN: 'Login_Screen',
    FORGOT_PASSWORD_SCREEN: 'Forgot_Password_Screen',
    RESET_PASSWORD_SCREEN: 'Reset_Password_Screen',
} as const;

export const DASHBOARD_ROUTES = {
    MAIN_TAB: 'Main_Tab',
    GLOBAL_VIDEO_TAB: 'Global_Video_Tab',
    FOUR_U_TAB: 'Four_U_Tab',
    PROFILE_TAB: 'Profile_Tab',

    MAIN_SCREEN: 'Main_Screen',

} as const;

export type valueof<T> = T[keyof T];

export type OnboardingRoutes = valueof<typeof ONBOARDING_ROUTES>;
export type RootDashboard = valueof<typeof DASHBOARD_ROUTES>;

export type RootRoutes = OnboardingRoutes | RootDashboard;

export type AllRoutes = RootRoutes;
