import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { useSearchSectionQuery } from '../../components/search/hooks';
import { SearchResultRow } from '../../components/search/SearchResultRows';
import { VideoResultCard } from '../../components/search/VideoResultsGrid';
import { CombinedSearchResult, SearchVideoResult } from '../../components/search/types';
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

  // Videos render as a two-column grid here for the same reason they do in the
  // preview card: a full list of them is exactly where thumbnails matter most.
  // FlashList takes them two per row so paging still works.
  const isVideoSection = params.type === 'video';

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
          numColumns={isVideoSection ? 2 : 1}
          estimatedItemSize={isVideoSection ? 220 : 68}
          keyExtractor={(item) => `${item.type}:${item.id}`}
          renderItem={({ item }) =>
            isVideoSection ? (
              <VideoResultCard item={item as SearchVideoResult} />
            ) : (
              <SearchResultRow item={item} />
            )
          }
          contentContainerStyle={isVideoSection ? styles.gridContent : styles.listContent}
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

const styles = StyleSheet.create({
  // The grid's cards carry their own gutter, so the list only adds the outer
  // margin that keeps them off the screen edges.
  gridContent: { paddingHorizontal: 10, paddingTop: 8 },
  listContent: { paddingTop: 8 },
});
