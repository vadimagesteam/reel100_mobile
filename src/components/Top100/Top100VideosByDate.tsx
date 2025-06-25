import React, { useCallback, useMemo } from 'react';
import { usePostsInfiniteQuery } from '../VideoFeed/queries/usePostsInfiniteQuery.ts';
import { VideoFeed } from '../VideoFeed/VideoFeed.tsx';
import { useCalendarModal } from '../old/TabViewVideo/components/TopOneHundredTab/hooks/useCalendarModal.ts';
import CalendarModal from '../old/CalendarModal';
import HeaderCalendar from './CalendarSelectedDate.tsx';
import { useAppPersistentStore } from '../../state/app/appPersistentStore.ts';
import { ActivityIndicator, Text, View } from 'react-native';
import { useVideoPlayerStore } from '../../state/videoPlayer/videoVideoPlayerStore.ts';

export const Top100VideosByDate = () => {
  const { isVisible, selectedDate, tempDate, open, cancel, confirm, setTempDate, marked } =
    useCalendarModal();

  const { selectedState } = useAppPersistentStore();
  const isPlayerFullScreen = useVideoPlayerStore((s) => s.isPlayerFullScreen);

  const cacheKey = useMemo(
    () => ['top100_videos_', selectedState?.id ?? 'NO_STATE', selectedDate],
    [selectedDate, selectedState?.id],
  );

  const filters = useMemo(
    () => ({
      'where[top100Date]': new Date(selectedDate).toISOString(),
      'where[states][some][id]': selectedState?.id!,
    }),
    [selectedDate, selectedState],
  );

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    flatPages,
    refetch,
    isRefetching,
    data,
  } = usePostsInfiniteQuery({
    cacheKey,
    where: filters,
  });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {!isPlayerFullScreen && <HeaderCalendar markerDate={selectedDate} onCalendar={open} />}
      <CalendarModal
        isCalendarModal={isVisible}
        marked={marked}
        currentDate={tempDate}
        setVisibleDate={setTempDate}
        onCancelPress={cancel}
        onSubmitPress={confirm}
      />
      {!data && isFetching && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" size="large" />
        </View>
      )}
      {!flatPages.length && !isFetching && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl text-silver3">No videos found for selected date :(</Text>
        </View>
      )}
      <VideoFeed
        cacheKey={cacheKey}
        initialVideoIndex={0}
        isRefetching={isRefetching}
        refetch={refetch}
        videos={flatPages}
        onEndReached={onEndReached}
      />
    </>
  );
};
