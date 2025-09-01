import { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  FlatListProps,
  type ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { ListEmptyBlock, FlexLoading, RefreshControl } from '../ui';
import { type VideoPost } from '../videoFeed/queries/apiVideosFetcher';
import { useVideoFeed, useVideoFeedCacheKey, type VideoPostQueryResult } from '../videoFeed/hooks';
import { VideoTile, VideoTileProps } from './VideoTile';

export interface TilesListProps<ItemType>
  extends Omit<FlatListProps<ItemType>, 'data' | 'renderItem'> {
  queryControl: VideoPostQueryResult;
  prepareData?: (data: VideoPost[]) => any[];
  ItemComponent?: ComponentType<VideoTileProps<ItemType>>;
  renderItem?: FlatListProps<ItemType>['renderItem'];
  emptyTitle?: string;
  emptyMessage?: string;
  refetch?: () => void;
  isRefreshing?: boolean;
}

/**
 * Generic FlatList-based grid of tiles that opens video feed
 */
export const VideoTiles = <ItemType extends VideoPost>({
  queryControl,
  prepareData,
  ItemComponent,
  renderItem: propRenderItem,
  className,
  emptyTitle,
  emptyMessage,
  refetch,
  isRefreshing = false,
  ...flatListProps
}: TilesListProps<ItemType>) => {
  const { flatPages, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, queryParams } =
    queryControl;

  if (propRenderItem && ItemComponent) {
    throw new Error('Both props are not supported: renderItem & ItemComponent');
  }

  const navigation = useNavigation();
  const allowDelete = useVideoFeed((s) => s.allowDelete);

  const data = useMemo(
    () => (prepareData ? prepareData(flatPages) : flatPages),
    [flatPages, prepareData],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleVideoOpen = useCallback(
    (video: VideoPost, index: number) => {
      if (video) {
        navigation.navigate(Screens.VideoFeedModal, {
          queryParams,
          videoIndex: index,
          feedState: {
            allowDelete,
          },
        });
      }
    },
    [allowDelete, navigation, queryParams],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemType>) =>
      ItemComponent ? (
        <ItemComponent item={item} rowSize={3} index={index} onVideoPress={handleVideoOpen} />
      ) : (
        <VideoTile
          index={index}
          className="rounded-none"
          style={styles.tile}
          item={item}
          onVideoPress={handleVideoOpen}
        />
      ),
    [handleVideoOpen, ItemComponent],
  );

  if (isLoading) {
    return <FlexLoading />;
  }

  return (
    <>
      <FlatList
        className={className}
        data={data}
        renderItem={propRenderItem ?? renderItem}
        keyExtractor={(item, i) => i.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        numColumns={3}
        initialNumToRender={6}
        windowSize={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListEmptyBlock
            title={emptyTitle ?? 'No videos uploaded yet'}
            message={emptyMessage ?? 'Uploaded videos will appear here'}
          />
        }
        ListFooterComponent={
          isFetchingNextPage && hasNextPage ? <ActivityIndicator color="#fff" /> : null
        }
        {...flatListProps}
      />
    </>
  );
};

const videoWidth = Dimensions.get('window').width / 3 - 2; // 3 videos - two right borderlines

const styles = StyleSheet.create({
  tile: {
    width: videoWidth,
    height: (videoWidth / 9) * 16,
    marginTop: 0,
    marginRight: 1,
    marginLeft: 0,
    marginBottom: 1,

    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});
