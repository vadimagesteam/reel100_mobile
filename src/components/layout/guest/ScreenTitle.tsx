import { Text } from 'react-native';
import { FC } from 'react';

export const ScreenTitle: FC<{ title: string }> = ({ title }) => (
  <Text className="text-primary mb-8 self-center text-5xl font-bold">{title}</Text>
);
