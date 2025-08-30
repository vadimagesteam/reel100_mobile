import { ReactNode } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, SvgIcon } from '../../ui';
import { useNavigation } from '@react-navigation/native';

export interface GuestContainerProps {
  children: ReactNode;
  withBackButton?: boolean;
}

export const GuestContainer = ({ withBackButton = true, children }: GuestContainerProps) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {withBackButton && (
        <View className="w-full flex-row px-5">
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="flex-1 justify-center gap-4 px-5">{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
