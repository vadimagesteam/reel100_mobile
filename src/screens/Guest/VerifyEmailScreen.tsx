import { GuestContainer } from '../../components/layout/guest/GuestContainer.tsx';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PINcode from '../../components/old/PINcode';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../state/user/authStore.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Screens } from '../../navigation/screens.ts';


export function VerifyEmailScreen() {
  const [code, setCode] = useState<string>('');
  const pendingVerification = useAuthStore((store) => store.pendingVerification);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!pendingVerification) {
      Alert.alert('Error', 'No pending verification', [
        {
          text: 'OK',
          onPress: () => navigation.replace(Screens.Login),
        },
      ]);
    }
  }, [pendingVerification, navigation]);

  const email = pendingVerification?.username!;

  const verifyAction = useAuthStore((store) => store.actions.verifyUser);
  const resendVerification = useAuthStore((store) => store.actions.resendVerification);

  const handleVerify = async () => {
    await verifyAction({
      token: code,
      username: email,
    });
  };

  const handleResendVerify = async ()=> {
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
      Alert.alert(
        'Error',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => true,
          },
        ],
      );
    }
  };

  return (
    <GuestContainer>
      <View>
        <Text className="text-white text-center text-3xl font-bold">
          Check Your Email
        </Text>
        <Text className="text-white text-center text-xl font-bold ">
          We sent a verification code to {email}
        </Text>
      </View>

      <PINcode code={code} codeLength={4} setCode={setCode} />

      <Button disabled={code.length !== 4} onPress={handleVerify}>
        Verify
      </Button>


      <View>
        <Text className="text-center text-silver4 text-xl mt-6">
          Didn't received the code?
        </Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleResendVerify}
        >
          <Text className="text-center underline text-blue1 text-xl">
            Click here to resend.
          </Text>
        </TouchableOpacity>
      </View>

    </GuestContainer>
  );
}