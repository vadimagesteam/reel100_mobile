import { Text, TouchableOpacity } from 'react-native';
import { Button, Input } from '../../components/ui';
import { Controller, useForm } from 'react-hook-form';
import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import React, { useEffect } from 'react';
import { useAuthStore } from '../../state/user/authStore.ts';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../navigation/screens.ts';
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

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
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
        <Text className="pl-2 text-red1">{errors?.username?.message}</Text>
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
        <Text className="pl-2 text-red1">{errors?.password?.message}</Text>
      )}

      <TouchableOpacity
        className="self-end pr-1"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => navigation.navigate(Screens.ForgotPassword)}
      >
        <Text className="text-xl font-medium text-silver4">Forgot password?</Text>
      </TouchableOpacity>

      <Button loading={isSubmitting} onPress={handleSubmit(onLogin)}>
        Sign In
      </Button>

      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => navigation.navigate(Screens.SignUp)}
      >
        <Text className="mt-6 text-center text-xl text-silver4">
          Don't have an account? <Text className="font-semibold text-blue1">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </GuestContainer>
  );
}
