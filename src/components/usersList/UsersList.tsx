import { FlashList } from '@shopify/flash-list';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserType } from '../../state/user/types';
import { Avatar, FlexLoading, ListEmptyBlock } from '../ui';
import { useShareablePeopleQuery } from '../videoFeed/share/hooks/useShareablePeopleQuery';

export interface SharePeopleListProps {
  searchQuery?: string;
  onPress?: (user: UserType) => void;
}

export const UsersList = ({ searchQuery, onPress }: SharePeopleListProps) => {
  const { data, isLoading } = useShareablePeopleQuery(searchQuery);

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <FlashList<UserType>
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
          <Avatar size={40} name={`${item.firstName} ${item.lastName}`} />

          <View className="flex-col">
            <Text numberOfLines={2} className="text-xl text-white">
              {item.firstName} {item.lastName}
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
