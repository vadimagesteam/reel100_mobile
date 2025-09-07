import { PropsWithChildren } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { AnimatedScrollWrapperContext } from './context';

export const AnimatedScrollWrapperRoot = ({ children }: PropsWithChildren) => {
  const scrollY = useSharedValue(0);
  return (
    <AnimatedScrollWrapperContext.Provider
      value={{
        scrollY,
      }}
    >
      {children}
    </AnimatedScrollWrapperContext.Provider>
  );
};
