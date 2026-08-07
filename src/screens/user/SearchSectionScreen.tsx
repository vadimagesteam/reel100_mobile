import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { useSearchSectionQuery } from '../../components/search/hooks';
import { SearchResultRow } from '../../components/search/SearchResultRows';
import { CombinedSearchResult } from '../../components/search/types';
import { FlexLoading, ListEmptyBlock } from '../../components/ui';
import { useRoute } from '../../navigation';

/**
 * The full list behind a section's "View all".
 *
 * Rows come from the same components the preview used, so this reads as a
 * continuation of the card it was reached through rather than a different
 * result set. The query travels in the title for the same reason — after a
 * push, the search box is no longer on screen to say what these results are.
 */
export const SearchSectionScreen = () => {
  const { params } = useRoute<'SearchSection'>();
  const insets = useSafeAreaInsets();

  const { items, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSearchSectionQuery(params.query, params.type);

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="flex-row items-center gap-x-3 px-4 pb-3">
        <HeaderBackArrowButton />
        <View className="flex-1 pr-9">
          <Text numberOfLines={1} className="text-center text-xl font-bold text-primary">
            {params.title}
          </Text>
          <Text numberOfLines={1} className="text-center text-sm text-muted">
            “{params.query}”
          </Text>
        </View>
      </View>

      {isLoading && items.length === 0 ? (
        <FlexLoading />
      ) : (
        <FlashList<CombinedSearchResult>
          data={items}
          estimatedItemSize={68}
          keyExtractor={(item) => `${item.type}:${item.id}`}
          renderItem={({ item }) => <SearchResultRow item={item} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <ListEmptyBlock
              title={isError ? 'Couldn’t load results' : 'No results'}
              message={
                isError
                  ? 'Check your connection and try again.'
                  : `Nothing matching "${params.query}"`
              }
            />
          }
        />
      )}
    </View>
  );
};
