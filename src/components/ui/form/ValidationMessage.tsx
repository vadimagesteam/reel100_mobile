import { PropsWithChildren } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const ValidationMessage = ({ children }: PropsWithChildren) => (
  <Animated.Text exiting={FadeOut} entering={FadeIn} className="pl-[4px] text-red1">
    {children}
  </Animated.Text>
);
