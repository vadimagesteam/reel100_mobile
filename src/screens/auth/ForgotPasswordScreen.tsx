import { Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from '../../components/ui';
import { GuestContainer } from '../../components/layout/guest/GuestContainer';
import { useAuthStore } from '../../state/user/authStore';
import { Screens } from '../../navigation/screens';
import { ScreenTitle } from '../../components/layout/guest/ScreenTitle';

interface FormData {
  username: string;
}

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const forgotAction = useAuthStore((store) => store.actions.forgotPassword);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
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
        <Text className="pl-2 text-red1">{errors?.username?.message}</Text>
      )}

      <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Next
      </Button>
    </GuestContainer>
  );
}
