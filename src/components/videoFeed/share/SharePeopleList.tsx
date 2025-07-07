import { Text, View } from 'react-native';
import { UserType } from '../../../state/user/types.ts';
import { BottomSheetFlashList, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useCallback, useState } from 'react';
import { Avatar, FlexLoading, ListEmptyBlock } from '../../ui';
import { useShareablePeopleQuery } from './hooks/useShareablePeopleQuery';

type ShallowUser = Pick<UserType, 'id' | 'firstName' | 'lastName'>;

export interface SharePeopleListProps {
  searchQuery?: string;
  onSelectionChanged?: (selectedIds: string[]) => void;
}

export const SharePeopleList = ({ searchQuery, onSelectionChanged }: SharePeopleListProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useShareablePeopleQuery(searchQuery);

  const handleItemPress = useCallback(
    ({ id }: ShallowUser) => {
      setSelected((prev) => {
        const newVal = { ...prev, [id]: !prev[id] };
        onSelectionChanged?.(Object.keys(newVal).filter((key) => newVal[key]));
        return newVal;
      });
    },
    [onSelectionChanged],
  );

  const renderItem = useCallback(
    ({ item }: { item: ShallowUser }) => (
      <TouchableOpacity
        className="mt-3 items-center justify-center gap-2"
        onPress={() => handleItemPress(item)}
      >
        <View className="relative">
          <Avatar name={`${item.firstName} ${item.lastName}`} />
          {selected[item.id!] && (
            <View className="absolute bottom-0 right-0 size-[20px] items-center justify-center rounded-full bg-blue2">
              <Text className="text-[12px] font-black text-white">&#x2713;</Text>
            </View>
          )}
        </View>

        <Text numberOfLines={2} className="text-[12px] text-white">
          {item.firstName} {item.lastName}
        </Text>
      </TouchableOpacity>
    ),
    [handleItemPress, selected],
  );

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <BottomSheetFlashList<ShallowUser>
      data={data ?? []}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <ListEmptyBlock title="No Results" message="No users matching search query" />
      }
      renderItem={renderItem}
    />
  );
};
