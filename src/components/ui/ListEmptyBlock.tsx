import { ReactNode } from 'react';
import { Text, View } from 'react-native';

export const ListEmptyBlock = ({ title, message }: { title: ReactNode; message: ReactNode }) => {
  return (
    <View className="mt-10 flex-col items-center gap-2 px-3">
      <Text className="text-center text-2xl font-bold text-primary">{title}</Text>
      {message && <Text className="text-center text-xl text-silver3">{message}</Text>}
    </View>
  );
};
