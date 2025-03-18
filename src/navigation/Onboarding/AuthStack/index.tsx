import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ONBOARDING_ROUTES } from '../../routes';

//screens
import WelcomeScreen from '../../../screens/Onboarding/Welcome';
import SignupScreen from '../../../screens/Onboarding/SignUp';
import LoginScreen from '../../../screens/Onboarding/Login';
import VerifyEmailScreen from '../../../screens/Onboarding/VerifyEmail';
import ForgotPasswordScreen from '../../../screens/Onboarding/ForgotPassword';
import ResetPasswordScreen from '../../../screens/Onboarding/ResetPassword';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={ONBOARDING_ROUTES.WELCOME_SCREEN}
                component={WelcomeScreen}
            />
            <Stack.Screen
                name={ONBOARDING_ROUTES.SIGNUP_SCREEN}
                component={SignupScreen}
            />
            <Stack.Screen
                name={ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN}
                component={VerifyEmailScreen}
            />
            <Stack.Screen
                name={ONBOARDING_ROUTES.LOGIN_SCREEN}
                component={LoginScreen}
            />
            <Stack.Screen
                name={ONBOARDING_ROUTES.FORGOT_PASSWORD_SCREEN}
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name={ONBOARDING_ROUTES.RESET_PASSWORD_SCREEN}
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
