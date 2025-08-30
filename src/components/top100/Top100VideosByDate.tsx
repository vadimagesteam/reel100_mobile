import { useCallback, useMemo } from 'react';
import { endOfDay, startOfDay } from 'date-fns';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { CalendarModal } from '../calendar';
import { ListEmptyBlock } from '../ui';
import { ApiVideosFetcherParams } from '../videoFeed/queries/apiVideosFetcher';
import { useCalendarModal } from './useCalendarModal';
import HeaderCalendar from './CalendarSelectedDate';
import { VideoList } from '../videoFeed';
import {
  useVideosInfiniteQuery,
  useSetVideoFeedCacheKey,
  useVideoFullscreen,
} from '../videoFeed/hooks';
import { useStateSelector } from '../../state/app/uiStore';

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
    () =>
      ({
        status: 'Finished',
        top_100Date: {
          gte: startOfDay(new Date(selectedDate)).toISOString(),
          lte: endOfDay(new Date(selectedDate)).toISOString(),
        },
        states: {
          some: {
            id: { equals: selectedState?.id! },
          },
        },
      }) as ApiVideosFetcherParams['where'],
    [selectedDate, selectedState],
  );

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, flatPages, refetch } =
    useVideosInfiniteQuery({
      cacheKey,
      where: filters,
      limit: 1,
      orderBy: [
        {
          top_100Position: 'Asc',
        },
      ],
    });

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {!isFullscreen && <HeaderCalendar markerDate={selectedDate} onCalendar={open} />}
      <CalendarModal
        visible={isVisible}
        marked={marked}
        currentDate={tempDate}
        setVisibleDate={setTempDate}
        onCancelPress={cancel}
        onSubmitPress={confirm}
      />
      <VideoList
        showTopRank={false}
        initialVideoIndex={0}
        isRefetching={isRefetching}
        refetch={handleRefresh}
        videos={flatPages}
        ListEmptyComponent={
          !flatPages.length && !isFetching ? (
            <ListEmptyBlock title="Nothing to show yet" message="Try selecting a different date." />
          ) : null
        }
      />
    </>
  );
};
