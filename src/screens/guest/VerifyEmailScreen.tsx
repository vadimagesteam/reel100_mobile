import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, PinInput } from '../../components/ui';
import { useAuthStore } from '../../state/user/authStore.ts';
import { Screens } from '../../navigation/screens.ts';
import { useLoadingCallback } from '../../utils';

export function VerifyEmailScreen() {
  const [code, setCode] = useState<string>('');
  const token = useAuthStore((store) => store.token);
  const pendingVerification = useAuthStore((store) => store.pendingVerification);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!pendingVerification && !token) {
      Alert.alert('Error', 'No pending verification', [
        {
          text: 'OK',
          onPress: () => navigation.replace(Screens.Login),
        },
      ]);
    }
  }, [pendingVerification, navigation, token]);

  const email = pendingVerification?.username!;

  const verifyAction = useAuthStore((store) => store.actions.verifyUser);
  const resendVerification = useAuthStore((store) => store.actions.resendVerification);

  const [handleVerify, isVerifying] = useLoadingCallback(async () => {
    const result = await verifyAction({
      token: code,
      username: email,
    });
    if (result.type === 'error') {
      Alert.alert('Invalid Code', result.message, [
        {
          text: 'OK',
          onPress: () => true,
        },
      ]);
    }
  });

  const [handleResendVerify, isResending] = useLoadingCallback(async () => {
    const result = await resendVerification({ username: email });
    if (result.type === 'success') {
      Alert.alert(
        'Code Resent',
        'Please check your email and enter the verification code to confirm your email address.',
        [
          {
            text: 'OK',
            onPress: () => true,
          },
        ],
      );
    }
    if (result.type === 'error') {
      Alert.alert('Error', result.message, [
        {
          text: 'OK',
          onPress: () => true,
        },
      ]);
    }
  });

  const isButtonLoading = isResending || isVerifying;

  return (
    <GuestContainer>
      <View>
        <Text className="text-primary text-center text-3xl font-bold">Check Your Email</Text>
        <Text className="text-primary text-center text-xl font-bold">
          We sent a verification code to {email}
        </Text>
      </View>

      <PinInput code={code} size={4} setCode={setCode} />
      <Button loading={isButtonLoading} disabled={code.length !== 4} onPress={handleVerify}>
        Verify
      </Button>

      <View>
        <Text className="mt-6 text-center text-xl text-silver4">Didn't received the code?</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleResendVerify}
        >
          <Text className="text-center text-xl text-blue1 underline">Click here to resend.</Text>
        </TouchableOpacity>
      </View>
    </GuestContainer>
  );
}
