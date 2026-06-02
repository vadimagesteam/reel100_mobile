import Ionicons from '@react-native-vector-icons/ionicons';
import { FlashList } from '@shopify/flash-list';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme';
import { FlexLoading, ListEmptyBlock } from '../ui';
import { StateStatLine } from './SearchStats';
import { StateAvatar } from './StateAvatar';
import { StateRankingItem } from './types';

export interface StateRankingListProps {
  data?: StateRankingItem[];
  isLoading?: boolean;
  isError?: boolean;
  searchQuery?: string;
  onPress: (state: StateRankingItem) => void;
}

/**
 * Card-style list of states with per-state upload counts (today · last 7 days),
 * used by the redesigned state-search screen for both the "Most Active" and
 * "A-Z" tabs.
 */
export const StateRankingList = ({
  data,
  isLoading,
  isError,
  searchQuery,
  onPress,
}: StateRankingListProps) => {
  if (!data && isLoading) {
    return <FlexLoading />;
  }

  if (!data && isError) {
    return (
      <ListEmptyBlock
        title="Couldn’t load states"
        message="Check your connection and try again."
      />
    );
  }

  return (
    <FlashList<StateRankingItem>
      showsVerticalScrollIndicator={false}
      data={data}
      estimatedItemSize={68}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <ListEmptyBlock
          title="No Results"
          message={searchQuery ? `No states matching "${searchQuery}"` : 'No states found'}
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          className="mt-3 flex-row items-center gap-3 border-b-[0.5px] border-b-gray-800 pb-3"
          onPress={() => onPress(item)}
        >
          <StateAvatar slug={item.slug} size={44} />
          <Text numberOfLines={1} className="flex-1 text-lg font-semibold text-primary">
            {item.label}
          </Text>
          <View className="flex-row items-center gap-2">
            <StateStatLine
              uploadsToday={item.uploadsToday}
              uploadsLast7Days={item.uploadsLast7Days}
              textClassName="text-sm"
            />
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};
