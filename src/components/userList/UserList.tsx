import { FlashList } from '@shopify/flash-list';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserBase, UserType } from '../../state/user/types';
import { getFullName } from '../../state/user/utils';
import { Avatar, FlexLoading, ListEmptyBlock } from '../ui';

export interface UserListProps<T extends UserBase> {
  searchQuery?: string;
  onPress?: (user: T) => void;
  data?: T[];
  isLoading?: boolean;
}

export const UserList = <T extends UserBase>({
  data,
  isLoading,
  searchQuery,
  onPress,
}: UserListProps<T>) => {
  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <FlashList<T>
      data={data}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListEmptyComponent={
        <ListEmptyBlock
          title="No Results"
          message={searchQuery ? `No users that matching "${searchQuery}" query` : 'No users found'}
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          className="mt-3 flex-1 flex-row items-center gap-2 border-b-[0.5px] border-b-gray-800 pb-2"
          onPress={() => onPress?.(item)}
        >
          <Avatar size={40} name={getFullName(item)} />

          <View className="flex-col">
            <Text numberOfLines={2} className="text-xl text-white">
              {getFullName(item)}
            </Text>
            <Text numberOfLines={2} className="text-sm text-gray-400">
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};
