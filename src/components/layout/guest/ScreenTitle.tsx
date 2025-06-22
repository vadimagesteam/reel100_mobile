import { Text } from 'react-native';
import { FC } from 'react';


export const ScreenTitle: FC<{ title: string }> = ({ title }) => (
  <Text className="text-white text-5xl font-bold self-center mb-8">{title}</Text>
);