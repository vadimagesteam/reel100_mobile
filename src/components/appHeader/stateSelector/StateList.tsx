import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { StateItem } from '../../../state/app/uiStore';
import { FlexLoading, ListEmptyBlock } from '../../ui';
import { useStatesQuery } from './hooks/useStatesQuery';

export interface SharePeopleListProps {
  searchQuery?: string;
  onPress?: (state: StateItem) => void;
}

export const StateList = ({ searchQuery, onPress }: SharePeopleListProps) => {
  const { data, isLoading } = useStatesQuery();

  const states = useMemo(
    () =>
      searchQuery?.trim()
        ? (data ?? []).filter((item) =>
            item.label?.toLowerCase().includes(searchQuery?.toLowerCase()),
          )
        : data,
    [data, searchQuery],
  );

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <FlashList<StateItem>
      data={states}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListEmptyComponent={
        <ListEmptyBlock
          title="No Results"
          message={
            searchQuery ? `No states that matching "${searchQuery}" query` : 'No states found'
          }
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          className="mt-3 flex-1 flex-row items-center border-b-[0.5px] border-b-gray-800 pb-2"
          onPress={() => onPress?.(item)}
        >
          <Text numberOfLines={2} className="text-xl text-white">
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};
