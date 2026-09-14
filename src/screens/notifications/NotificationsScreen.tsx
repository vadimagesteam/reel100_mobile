import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { NotificationRow } from '../../components/notifications/NotificationRow';
import {
  useNotificationMutations,
  useNotificationsInfiniteQuery,
} from '../../components/notifications/hooks/useNotificationsApi';
import { NotificationItem } from '../../components/notifications/types';
import { FlexLoading } from '../../components/ui';
import { useNotificationPress } from '../../components/notifications/hooks/useNotificationPress';

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    flat,
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotificationsInfiniteQuery();
  const { remove, clearAll, markRead } = useNotificationMutations();
  const handlePress = useNotificationPress();

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onPressItem = useCallback(
    (item: NotificationItem) => {
      if (!item.read) {
        markRead.mutate(item.id);
      }
      handlePress(item);
    },
    [markRead, handlePress],
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <NotificationRow item={item} onPress={onPressItem} onDelete={(n) => remove.mutate(n.id)} />
    ),
    [onPressItem, remove],
  );

  const hasAny = flat.length > 0;

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background px-4">
      <View className="mb-2 h-[52px] flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          <HeaderBackArrowButton />
          <Text className="text-2xl font-bold text-silver1">Notifications</Text>
        </View>
        {hasAny && (
          <TouchableOpacity hitSlop={12} onPress={() => clearAll.mutate()}>
            <Text className="text-primary">Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && !data ? (
        <FlexLoading />
      ) : (
        <FlashList<NotificationItem>
          data={flat}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={80}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#fff"
              colors={['#fff']}
            />
          }
          ListEmptyComponent={
            <View className="mt-40 items-center">
              <Text className="text-lg text-silver4">You're all caught up</Text>
              <Text className="mt-1 text-silver5">Notifications will show up here</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator className="my-4" color="#aaa" /> : null
          }
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        />
      )}
    </View>
  );
};
