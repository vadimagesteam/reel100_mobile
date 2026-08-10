import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import clsx from 'clsx';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { useTagVideosHeaderQuery, type TagVideoSort } from '../../components/search/hooks';
import { TagShareButton } from '../../components/search/TagShareButton';
import { VideoFeedProvider } from '../../components/videoFeed/provider/VideoFeedProvider';
import { useSetVideoFeedCacheKey, useVideosInfiniteQuery } from '../../components/videoFeed/hooks';
import { VideoPost } from '../../components/videoFeed/queries/apiVideosFetcher';
import { VideoTiles } from '../../components/videoTiles';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useRoute } from '../../navigation';
import { formatNumberShort } from '../../utils';

const TABS: { key: TagVideoSort; label: string }[] = [
  { key: 'top', label: 'Top' },
  { key: 'recent', label: 'Recent' },
];

/**
 * Everything under a hashtag, or under several at once.
 *
 * Several tags intersect rather than union, so #oregon + #fishing is the videos
 * carrying both — the same thing the combination row in search stands for, and
 * the reason this screen takes a list of tags rather than one.
 *
 * The grid and the cache-key hook both read the video-feed store, so the
 * provider has to sit above the component that uses them rather than inside it
 * — hence the split. Deleting is off: these are other people's videos, and the
 * only screen that allows it is a profile looking at its own.
 */
export const TagFeedScreen = () => (
  <VideoFeedProvider initialState={{ allowDelete: false }}>
    <TagFeedContent />
  </VideoFeedProvider>
);

const TagFeedContent = () => {
  const { params } = useRoute<'TagFeed'>();
  const insets = useSafeAreaInsets();
  const [sort, setSort] = useState<TagVideoSort>('top');

  const tags = params.tags;
  const header = useTagVideosHeaderQuery(tags);

  // Resolved labels once they arrive; until then the title passed in by the
  // caller, so the header never renders blank on the way in.
  const title = useMemo(() => {
    if (header.data?.tags.length) {
      return header.data.tags.map((t) => `#${t.name}`).join(' + ');
    }
    return params.title ?? tags.map((t) => `#${t}`).join(' + ');
  }, [header.data, params.title, tags]);

  // The sort is part of the key: Top and Recent are different orderings of the
  // same videos, and sharing one cache between them would interleave two
  // paginations into a list that repeats and skips.
  const cacheKey = useMemo(() => ['tag_videos', tags.join(','), sort], [tags, sort]);
  useSetVideoFeedCacheKey(cacheKey);

  const queryControl = useVideosInfiniteQuery({
    cacheKey,
    tags,
    tagSort: sort,
  });

  const [handleRefresh, isRefetching] = useLoadingCallback(queryControl.refetch);

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="flex-row items-center gap-x-3 px-4 pb-2">
        <HeaderBackArrowButton />
        <View className="flex-1">
          <Text numberOfLines={1} className="text-center text-xl font-bold text-primary">
            {title}
          </Text>
          {header.data && (
            <Text className="text-center text-sm text-muted">
              {formatNumberShort(header.data.total)} videos
            </Text>
          )}
        </View>
        <TagShareButton tags={tags} title={title} />
      </View>

      <View className="flex-row border-b-[0.5px] border-b-gray-800">
        {TABS.map((tab) => {
          const active = tab.key === sort;
          return (
            <TouchableOpacity
              key={tab.key}
              className="flex-1 items-center py-3"
              onPress={() => setSort(tab.key)}
            >
              <Text
                className={clsx(
                  'text-base',
                  active ? 'font-bold text-primary' : 'text-muted',
                )}
              >
                {tab.label}
              </Text>
              {active && <View className="mt-2 h-[2px] w-16 rounded-full bg-primary" />}
            </TouchableOpacity>
          );
        })}
      </View>

      <VideoTiles<VideoPost>
        className="px-1 pt-1"
        queryControl={queryControl}
        refetch={handleRefresh}
        isRefreshing={isRefetching}
        emptyTitle="No videos yet"
        emptyMessage={`Nothing tagged ${title} so far`}
      />
    </View>
  );
};
