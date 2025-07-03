import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  type ListRenderItemInfo,
  Text,
  View,
} from 'react-native';
import clsx from 'clsx';
import { FlexLoading } from '../ui/FlexLoading';
import { RefreshControl } from '../ui/RefreshControl.tsx';
import { type VideoPost } from '../videoFeed/queries/apiVideosFetcher.ts';
import { VideoList } from '../videoFeed';
import { useVideoFullscreen, type VideoPostQueryResult } from '../videoFeed/hooks';

export interface BaseTileItemProps<ItemType> {
  item: ItemType;
  index: number;
  onVideoPress: (video: VideoPost) => void;
}

export interface TilesListProps<ItemType>
  extends Omit<FlatListProps<ItemType>, 'data' | 'renderItem'> {
  queryControl: VideoPostQueryResult;
  prepareData?: (data: VideoPost[]) => any[];
  ItemComponent?: React.ComponentType<BaseTileItemProps<ItemType>>;
  renderItem?: FlatListProps<ItemType>['renderItem'];
}

/**
 * Generic FlatList-based grid of tiles that can expand to fullscreen.
 */
export const VideoTiles = <ItemType,>({
  queryControl,
  prepareData,
  ItemComponent,
  renderItem: propRenderItem,
  className,
  ...flatListProps
}: TilesListProps<ItemType>) => {
  const {
    flatPages,
    refetch,
    isLoading,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = queryControl;

  if (propRenderItem && ItemComponent) {
    throw new Error('Both props are not supported: renderItem & ItemComponent');
  }

  const { isFullscreen, setFullscreen } = useVideoFullscreen();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const data = useMemo(
    () => (prepareData ? prepareData(flatPages) : flatPages),
    [flatPages, prepareData],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isFullscreen && expandedIndex !== null) {
      setExpandedIndex(null);
    }
  }, [expandedIndex, isFullscreen]);

  const fullScreenVideos = useMemo(
    () => (expandedIndex !== null ? flatPages.slice(expandedIndex) : flatPages),
    [expandedIndex, flatPages],
  );

  const handleVideoOpen = useCallback(
    (video: VideoPost) => {
      if (video) {
        setExpandedIndex(flatPages.findIndex((v) => v.id === video.id));
        setFullscreen(true);
      }
    },
    [flatPages, setFullscreen],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemType>) =>
      ItemComponent ? (
        <ItemComponent item={item} index={index} onVideoPress={handleVideoOpen} />
      ) : null,
    [handleVideoOpen, ItemComponent],
  );

  if (isLoading) {
    return <FlexLoading />;
  }

  return (
    <>
      <FlatList
        className={clsx(expandedIndex !== null ? 'hidden' : undefined, className)}
        data={data}
        renderItem={propRenderItem ?? renderItem}
        keyExtractor={(item, i) => i.toString()}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        initialNumToRender={6}
        windowSize={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListEmptyComponent={
          <View className="mt-10 flex-col items-center gap-2">
            <Text className="text-2xl font-bold text-white">No videos uploaded yet</Text>
            <Text className="text-xl text-silver3">Uploaded videos will appear here</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage && hasNextPage ? <ActivityIndicator color="#fff" /> : null
        }
        {...flatListProps}
      />
      {expandedIndex !== null && (
        <VideoList
          initialVideoIndex={0}
          isRefetching={isRefetching}
          refetch={refetch}
          videos={fullScreenVideos}
          onEndReached={onEndReached}
        />
      )}
    </>
  );
};
