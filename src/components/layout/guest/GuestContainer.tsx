import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { FC } from 'react';
import { Button } from '../../ui/Button.tsx';
import { SvgIcon } from '../../old/UI';
import { useNavigation } from '@react-navigation/native';

export interface GuestContainerProps {
 children: React.ReactNode;
 withBackButton?: boolean;
}

export const GuestContainer: FC<GuestContainerProps> = ({ withBackButton = true, children }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-black4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {withBackButton && (
            <View className="px-5 w-full flex-row">
              <Button
                hitSlop={{ right: 15 }}
                variant="ghost"
                buttonClassName="pl-0"
                onPress={() => navigation.goBack()}
              >
                <SvgIcon image="backArrow" />
              </Button>
            </View>
          )}

          <View className="flex-1 justify-center px-5 gap-4">
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
};