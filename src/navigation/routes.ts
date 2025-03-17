export const ONBOARDING_ROUTES = {
    WELCOME_SCREEN: 'Welcome_Screen',
    SIGNUP_SCREEN: 'SignUp_Screen',
    VERIFY_EMAIL_SCREEN: 'Verify_Email_Screen',
    LOGIN_SCREEN: 'Login_Screen',
} as const;

export const DASHBOARD_ROUTES = {
    MAIN_SCREEN: 'Main_Screen',
} as const;

export type valueof<T> = T[keyof T];

export type OnboardingRoutes = valueof<typeof ONBOARDING_ROUTES>;
export type RootDashboard = valueof<typeof DASHBOARD_ROUTES>;

export type RootRoutes = OnboardingRoutes | RootDashboard;

export type AllRoutes = RootRoutes;
