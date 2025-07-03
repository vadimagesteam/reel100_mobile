import { Image, Text, View } from 'react-native';
import { UserType } from '../../../state/user/types.ts';
import { BottomSheetFlatList, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useMemo, useState } from 'react';
import { Avatar } from '../../ui/Avatar';
import { FlexLoading } from '../../ui/FlexLoading';
import { useShareablePeopleQuery } from './hooks/useShareablePeopleQuery';

type ShallowUser = Pick<UserType, 'id' | 'firstName' | 'lastName'>;

type ItemType = ShallowUser | null;

export interface SharePeopleListProps {
  searchQuery?: string;
  onSelectionChanged?: (selectedIds: string[]) => void;
}

export const SharePeopleList = ({ searchQuery, onSelectionChanged }: SharePeopleListProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useShareablePeopleQuery(searchQuery);

  const handleItemPress = ({ id }: ShallowUser) => {
    setSelected((prev) => {
      const newVal = { ...prev, [id]: !prev[id] };
      onSelectionChanged?.(Object.keys(newVal).filter((key) => newVal[key]));
      return newVal;
    });
  };

  // grid missing items
  const people = useMemo(() => {
    if (!data) {
      return [] as ItemType[];
    }
    const remain = data.length % 3;
    if (!remain) {
      return data;
    }
    return [...data, ...new Array(3 - remain).fill(null)] as ItemType[];
  }, [data]);

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <BottomSheetFlatList<ItemType>
      data={people}
      numColumns={3}
      horizontal={false}
      className="gap-3"
      renderItem={({ item }) => {
        if (item === null) {
          return <View className="flex-1" />;
        }
        return (
          <TouchableOpacity
            className="mt-3 flex-1 flex-col items-center justify-center gap-2"
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
        );
      }}
    />
  );
};
