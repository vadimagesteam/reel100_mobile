import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  EulaScreen,
  ForgotPasswordScreen,
  LoginScreen,
  ResetPasswordScreen,
  SignupScreen,
  VerifyEmailScreen,
} from '../screens';
import { AuthStackParamList, Screens } from './screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screens.Login} component={LoginScreen} />
    <Stack.Screen name={Screens.SignUp} component={SignupScreen} />
    <Stack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />
    <Stack.Screen name={Screens.ResetPassword} component={ResetPasswordScreen} />
    <Stack.Screen name={Screens.VerifyEmail} component={VerifyEmailScreen} />
    <Stack.Screen name={Screens.Eula} component={EulaScreen} />
  </Stack.Navigator>
);
