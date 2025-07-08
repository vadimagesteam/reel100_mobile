import { Alert, Text } from 'react-native';
import { Button } from '../../components/ui/Button.tsx';
import { Controller, useForm } from 'react-hook-form';
import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import { Input } from '../../components/ui/Input.tsx';
import React, { useEffect } from 'react';
import { useAuthStore } from '../../state/user/authStore.ts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screens } from '../../navigation/screens.ts';

interface FormData {
  username: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<any>();
  const resetAction = useAuthStore((store) => store.actions.resetPassword);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      token: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (params.email) {
      setValue('username', params.email);
    }
  }, [params.email, setValue]);

  const onSubmit = async (data: FormData) => {
    const result = await resetAction(data);
    if (result.type === 'success') {
      navigation.navigate(Screens.Login);
      return;
    }
    if (result.type === 'error' && result.errorType === 'invalid_credentials') {
      setError('token', { type: 'server', message: 'Invalid code' });
      return;
    }
    Alert.alert('Error', 'Unknown error occurred.');
  };

  return (
    <GuestContainer>
      <Text className="text-center text-3xl font-bold text-white">Set New Password</Text>

      <Text className="mb-8 text-center text-xl font-semibold text-gray-400">
        We've sent a 4 digit code to your email:{' '}
        <Text className="font-extrabold">{params.email}</Text>
      </Text>

      <Controller
        name="token"
        control={control}
        rules={{
          required: 'Code is required',
          pattern: {
            value: /^\d{4}$/,
            message: 'Code must be exactly 4 digits',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Enter 4 digit code"
            keyboardType="numeric"
            maxLength={4}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors?.token?.message && <Text className="pl-2 text-red1">{errors?.token?.message}</Text>}

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
            placeholder="Password"
            secureTextEntry
            secureToggle
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors?.password?.message && (
        <Text className="pl-2 text-red1">{errors?.password?.message}</Text>
      )}

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: 'Confirm password is required',
          validate: (value, formValues) =>
            value === formValues.password || 'Passwords do not match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Confirm Password"
            secureTextEntry
            secureToggle
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors?.confirmPassword?.message && (
        <Text className="pl-2 text-red1">{errors?.confirmPassword?.message}</Text>
      )}

      <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Reset
      </Button>
    </GuestContainer>
  );
}
