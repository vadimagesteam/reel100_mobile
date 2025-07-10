import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, FlatListProps, RefreshControl } from 'react-native';
import { VideoPost } from '../videoFeed/queries/apiVideosFetcher';
import { generateBlocks, TileBlock } from './helpers/generateBlocks';
import { TileListBlock } from './TileListBlock';
import { ListRenderItemInfo } from '@react-native/virtualized-lists/Lists/VirtualizedList';

export interface TilesListProps
  extends Omit<FlatListProps<TileBlock<VideoPost>>, 'renderItem' | 'data'> {
  videos: VideoPost[];
  onVideoClick: (video: VideoPost) => void;
  isRefetching: boolean;
  refetch: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export const TilesList = ({
  videos,
  isRefetching,
  refetch,
  isFetchingNextPage,
  hasNextPage,
  onVideoClick,
  ...flatListProps
}: TilesListProps) => {
  const blocks = useMemo(() => generateBlocks(videos), [videos]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<TileBlock<VideoPost>>) => (
      <TileListBlock item={item} index={index} onVideoPress={onVideoClick} />
    ),
    [onVideoClick],
  );

  return (
    <FlatList
      data={blocks}
      keyExtractor={(_, i) => i.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#fff']}
          tintColor="#fff"
        />
      }
      initialNumToRender={6}
      windowSize={6}
      maxToRenderPerBatch={6}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage && hasNextPage ? <ActivityIndicator color="#fff" /> : null
      }
      {...flatListProps}
    />
  );
};
