import { createContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type ContextValues = {
  scrollY: SharedValue<number>;
};

export const AnimatedScrollWrapperContext = createContext<ContextValues | undefined>(undefined);
