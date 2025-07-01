import {
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../../components/ui/Button.tsx';
import { Controller, useForm } from 'react-hook-form';
import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import { Input } from '../../components/ui/Input.tsx';
import React, { useEffect } from 'react';
import { useAuthStore } from '../../state/user/authStore.ts';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../navigation/screens.ts';
import { ONBOARDING_ROUTES } from '../../navigation/routes.ts';
import { ScreenTitle } from '../../components/layout/guest/ScreenTitle.tsx';

interface FormData {
  username: string;
  password: string;
}

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const pendingVerification = useAuthStore((store) => store.pendingVerification);
  const authLoginAction = useAuthStore((store) => store.actions.login);

  useEffect(() => {
    if (pendingVerification) {
      navigation.navigate(Screens.VerifyEmail);
    }
  }, [pendingVerification, navigation]);

  const { control, handleSubmit, setError, formState: { isLoading, errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLogin = async (data: FormData) => {
    console.log('pp111', data);
    const result = await authLoginAction(data);
    console.log('result', data);
    if (result.type === 'success') {
      // navigate...
      return;
    }

    if (result.type === 'error' && result.errorType === 'invalid_credentials') {
      setError('password', { type: 'server', message: 'Invalid email or password' });
    }
  };

  return (
    <GuestContainer withBackButton={false}>
      <ScreenTitle title="Sign In" />

      <Controller
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
        name="username"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            hasError={!!errors?.username}
            placeholder="Email"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors?.username && errors?.username?.message && (
        <Text className="text-red1 pl-2">{errors?.username?.message}</Text>
      )}

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            hasError={!!errors?.password}
            placeholder="Password"
            secureTextEntry
            secureToggle
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors?.password && errors?.password?.message && (
        <Text className="text-red1 pl-2">{errors?.password?.message}</Text>
      )}

      <TouchableOpacity
        className="self-end pr-1"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => navigation.navigate(Screens.ForgotPassword)}
      >
        <Text className="text-silver4 text-xl font-medium">Forgot password?</Text>
      </TouchableOpacity>

      <Button loading={isLoading} onPress={handleSubmit(onLogin)}>
        Sign In
      </Button>

      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => navigation.navigate(Screens.SignUp)}
      >
        <Text className="text-center text-silver4 text-xl mt-6">
          Don't have an account? <Text className="text-blue1 font-semibold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </GuestContainer>
  );
}
