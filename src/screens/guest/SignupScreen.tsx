import { Alert, Text } from 'react-native';
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
  username: '';
  password: '';
  confirmPassword: '';
  firstName: '';
  lastName: '';
}

export function SignupScreen() {
  const navigation = useNavigation<any>();
  const signupAction = useAuthStore((store) => store.actions.register);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await signupAction(data);
    if (result.type === 'success') {
      navigation.navigate(Screens.VerifyEmail);
      return;
    }

    if (result.type === 'error' && result.errorType === 'email_exists') {
      Alert.alert('Registration failed', result.message, [
        {
          text: 'OK',
          onPress: () => navigation.navigate(Screens.VerifyEmail, { email: data.username }),
        },
      ]);
      return;
    }

    Alert.alert('Error', 'Unknown error occurred.');
  };

  return (
    <GuestContainer>
      <ScreenTitle title="Create Account" />

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

      {errors?.username?.message && (
        <Text className="pl-2 text-red1">{errors?.username?.message}</Text>
      )}

      <Controller
        name="firstName"
        rules={{
          required: 'First name is required',
        }}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="First Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors?.firstName?.message && (
        <Text className="pl-2 text-red1">{errors?.firstName?.message}</Text>
      )}

      <Controller
        name="lastName"
        rules={{
          required: 'Last name is required',
        }}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="Last Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors?.lastName?.message && (
        <Text className="pl-2 text-red1">{errors?.lastName?.message}</Text>
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
        Sign Up
      </Button>
    </GuestContainer>
  );
}
