import React, { useCallback, useMemo } from 'react';
import { useVideosInfiniteQuery } from '../videoFeed/hooks/useVideosInfiniteQuery.ts';
import { useCalendarModal } from '../old/TabViewVideo/components/TopOneHundredTab/hooks/useCalendarModal.ts';
import CalendarModal from '../old/CalendarModal';
import HeaderCalendar from './CalendarSelectedDate.tsx';
import { ActivityIndicator, Text, View } from 'react-native';
import { VideoList } from '../videoFeed/VideoList.tsx';
import { useSetVideoFeedCacheKey } from '../videoFeed/hooks/useSetVideoFeedCacheKey.ts';
import { endOfDay } from 'date-fns';
import { useVideoFullscreen } from '../videoFeed/hooks/useVideoFullscreen.ts';
import { useStateSelector } from '../../state/app/uiStore.ts';

export const Top100VideosByDate = () => {
  const { isVisible, selectedDate, tempDate, open, cancel, confirm, setTempDate, marked } =
    useCalendarModal();

  const [selectedState] = useStateSelector();
  const { isFullscreen } = useVideoFullscreen();

  const cacheKey = useMemo(
    () => ['top100_videos_', selectedState?.id ?? 'NO_STATE', selectedDate],
    [selectedDate, selectedState?.id],
  );

  useSetVideoFeedCacheKey(cacheKey);

  const filters = useMemo(
    () => ({
      'where[status]': 'Finished',
      'where[top_100Date][gte]': new Date(selectedDate).toISOString(),
      'where[top_100Date][lte]': endOfDay(new Date(selectedDate)).toISOString(),
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
  } = useVideosInfiniteQuery({
    cacheKey,
    where: filters,
    orderBy: {
      top_100Position: 'desc',
    },
  });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {!isFullscreen && <HeaderCalendar markerDate={selectedDate} onCalendar={open} />}
      <CalendarModal
        isCalendarModal={isVisible}
        marked={marked}
        currentDate={tempDate}
        setVisibleDate={setTempDate}
        onCancelPress={cancel}
        onSubmitPress={confirm}
      />
      <VideoList
        initialVideoIndex={0}
        isRefetching={isRefetching}
        refetch={refetch}
        videos={flatPages}
        onEndReached={onEndReached}
        ListEmptyComponent={
          !flatPages.length && !isFetching ? (
            <View className="flex-1 grow items-center justify-center">
              <Text className="text-xl text-silver3">Nothing to show yet.</Text>
              <Text className="text-xl text-silver3">Try selecting a different date.</Text>
            </View>
          ) : null
        }
      />
    </>
  );
};
