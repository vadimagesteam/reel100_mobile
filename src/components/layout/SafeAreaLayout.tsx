import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import React, { FC } from 'react';
import clsx from 'clsx';

export interface SafeAreaLayoutProps extends SafeAreaViewProps {}

export const SafeAreaLayout: FC<SafeAreaLayoutProps> = ({ children, className, ...rest }) => {
  return (
    <SafeAreaView className={clsx('flex-1 bg-black4', className)} {...rest}>
      {children}
    </SafeAreaView>
  );
};
