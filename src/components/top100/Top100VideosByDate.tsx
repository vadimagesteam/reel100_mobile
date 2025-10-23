import { isSameDay } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useStateSelector } from '../../state/app/uiStore';
import { CalendarModal } from '../calendar';
import { ListEmptyBlock } from '../ui';
import { VideoList } from '../videoFeed';
import {
  useVideosInfiniteQuery,
  useSetVideoFeedCacheKey,
  useVideoFullscreen,
} from '../videoFeed/hooks';
import { ApiVideosFetcherParams } from '../videoFeed/queries/apiVideosFetcher';
import HeaderCalendar from './CalendarSelectedDate';
import { useCalendarModal } from './useCalendarModal';

export const Top100VideosByDate = ({ global = false }: { global?: boolean }) => {
  const { isVisible, selectedDate, tempDate, open, cancel, confirm, setTempDate, marked } =
    useCalendarModal();

  const [selectedState] = useStateSelector();
  const { isFullscreen } = useVideoFullscreen();

  const cacheKey = useMemo(
    () =>
      global
        ? ['top100_global_videos', selectedDate]
        : ['top100_videos_', selectedState?.id ?? 'NO_STATE', selectedDate],
    [selectedDate, selectedState?.id, global],
  );

  useSetVideoFeedCacheKey(cacheKey);

  const filters = useMemo(
    () =>
      ({
        status: 'Finished',
        top_100Position: { equals: 1 },
        ...(global
          ? {}
          : {
              states: {
                some: {
                  id: { equals: selectedState?.id! },
                },
              },
            }),
      }) as ApiVideosFetcherParams['where'],
    [global, selectedState?.id],
  );

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, flatPages, refetch } =
    useVideosInfiniteQuery({
      cacheKey,
      where: filters,
      orderBy: [
        {
          top_100Date: 'Asc',
        },
      ],
    });

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const initialVideoIndex = useMemo(
    () => flatPages.findIndex((v) => isSameDay(new Date(v.top_100Date!), new Date(selectedDate))),
    [flatPages, selectedDate],
  );

  const listEmpty = !flatPages.length && !isFetching;

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
      {(listEmpty || initialVideoIndex === -1) && (
        <ListEmptyBlock
          title={
            global
              ? `Who will Rush the Nation today?`
              : `${selectedState?.label}'s Rushchive for today is empty 😔`
          }
          message="Try selecting a different date."
        />
      )}
      {initialVideoIndex > -1 && (
        <VideoList
          showTopRank={false}
          initialVideoIndex={initialVideoIndex}
          isRefetching={isRefetching}
          refetch={handleRefresh}
          videos={flatPages}
        />
      )}
    </>
  );
};
