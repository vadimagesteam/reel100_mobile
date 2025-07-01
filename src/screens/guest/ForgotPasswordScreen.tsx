import {
  Alert,
  Text,
} from 'react-native';
import { Button } from '../../components/ui/Button.tsx';
import { Controller, useForm } from 'react-hook-form';
import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import { Input } from '../../components/ui/Input.tsx';
import React from 'react';
import { useAuthStore } from '../../state/user/authStore.ts';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../navigation/screens.ts';
import { ScreenTitle } from '../../components/layout/guest/ScreenTitle.tsx';

interface FormData {
  username: string;
}

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const forgotAction = useAuthStore((store) => store.actions.forgotPassword);

  const { control, handleSubmit, setError, formState: { isLoading, errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await forgotAction(data);
    if (result.type === 'success') {
      navigation.navigate(Screens.ResetPassword, { email: data.username });
      return;
    }
    if (result.type === 'error' && result.errorType === 'invalid_credentials') {
      setError('username', { type: 'server', message: 'Such email was not found' });
      return;
    }
    Alert.alert('Error', 'Unknown error occurred.');
  };

  return (
    <GuestContainer>
      <ScreenTitle title="Password Recovery" />

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
            autoFocus
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

      <Button loading={isLoading} onPress={handleSubmit(onSubmit)}>
        Next
      </Button>
    </GuestContainer>
  );
}
