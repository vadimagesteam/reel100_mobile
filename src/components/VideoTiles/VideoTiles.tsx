import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, FlatListProps, type ListRenderItemInfo } from 'react-native';
import clsx from 'clsx';
import { RefreshControl } from '../ui/RefreshControl.tsx';
import { type VideoPost } from '../VideoFeed/queries/apiVideosFetcher.ts';
import { VideoList } from '../VideoFeed';
import { useVideoFullscreen, type VideoPostQueryResult } from '../VideoFeed/hooks';

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
  const { flatPages, refetch, isRefetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    queryControl;

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
