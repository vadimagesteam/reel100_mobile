import { PropsWithChildren } from 'react';
import { Text } from 'react-native';

export const FieldLabel = ({ children }: PropsWithChildren) => (
  <Text className="text-xl font-semibold text-primary">{children}</Text>
);
