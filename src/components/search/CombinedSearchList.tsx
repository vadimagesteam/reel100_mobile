import Ionicons from '@react-native-vector-icons/ionicons';
import { FlashList } from '@shopify/flash-list';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { Avatar, FlexLoading, ListEmptyBlock } from '../ui';
import { useOpenStatePage } from './hooks/useOpenStatePage';
import { StatPill, StateStatLine } from './SearchStats';
import { StateAvatar } from './StateAvatar';
import { CombinedSearchResult } from './types';

export interface CombinedSearchListProps {
  data?: CombinedSearchResult[];
  isLoading?: boolean;
  isError?: boolean;
  searchQuery?: string;
  /** Tapping a tag on a video result re-runs the search for that tag. */
  onTagPress?: (tag: string) => void;
}

const rowClassName =
  'mt-3 flex-row items-center gap-3 border-b-[0.5px] border-b-gray-800 pb-2';

/**
 * Combined alphabetical list of users + states (as the user types). Users open
 * their profile; states open that state's page. Stats differ by type: users
 * show total uploads + total likes, states show uploads today + last 7 days.
 */
export const CombinedSearchList = ({
  data,
  isLoading,
  isError,
  searchQuery,
  onTagPress,
}: CombinedSearchListProps) => {
  const navigation = useNavigation();
  const openStatePage = useOpenStatePage();

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  if (!data && isError) {
    return (
      <ListEmptyBlock
        title="Couldn’t load results"
        message="Check your connection and try again."
      />
    );
  }

  return (
    <FlashList<CombinedSearchResult>
      showsVerticalScrollIndicator={false}
      data={data}
      estimatedItemSize={64}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      keyExtractor={(item) => `${item.type}:${item.id}`}
      ListEmptyComponent={
        <ListEmptyBlock
          title="No Results"
          message={searchQuery ? `Nothing matching "${searchQuery}"` : 'Start typing to search'}
        />
      }
      renderItem={({ item }) => {
        if (item.type === 'user') {
          return (
            <TouchableOpacity
              className={rowClassName}
              onPress={() => navigation.navigate(Screens.Profile, { userId: item.id })}
            >
              <Avatar uri={item.avatar} size={44} name={item.name} />
              <Text numberOfLines={1} className="flex-1 text-lg font-semibold text-primary">
                {item.name}
              </Text>
              <View className="flex-row items-center gap-3">
                <StatPill icon="cloud-upload-outline" value={item.totalUploads} size={14} />
                <StatPill icon="heart-outline" value={item.totalLikes} size={14} />
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </View>
            </TouchableOpacity>
          );
        }

        if (item.type === 'state') {
          return (
            <TouchableOpacity
              className={rowClassName}
              onPress={() => openStatePage({ id: item.id, slug: item.slug, label: item.label })}
            >
              <StateAvatar slug={item.slug} size={44} />
              <Text numberOfLines={1} className="flex-1 text-lg font-semibold text-primary">
                {item.label}
              </Text>
              <View className="flex-row items-center gap-2">
                <StateStatLine
                  uploadsToday={item.uploadsToday}
                  uploadsLast7Days={item.uploadsLast7Days}
                />
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </View>
            </TouchableOpacity>
          );
        }

        // Hashtag rows are rendered by the sectioned results screen, which
        // supersedes this list; this component only ever receives the three
        // older types.
        if (item.type === 'tag') {
          return null;
        }

        // Video result: opens the video; its tags are tappable to browse.
        return (
          <View className={rowClassName}>
            <TouchableOpacity
              className="flex-1 flex-row items-center gap-3"
              onPress={() => navigation.navigate(Screens.VideoModal, { videoId: item.id })}
            >
              <View className="h-11 w-11 items-center justify-center rounded-lg bg-input">
                <Ionicons name="play" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-lg font-semibold text-primary">
                  {item.label}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text numberOfLines={1} className="text-sm text-muted">
                    {item.user.name}
                  </Text>
                  <StatPill icon="heart-outline" value={item.likesCount} size={12} />
                </View>
                {item.tags.length > 0 && (
                  <View className="mt-1 flex-row flex-wrap gap-1.5">
                    {item.tags.slice(0, 4).map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        hitSlop={6}
                        onPress={() => onTagPress?.(tag)}
                        className="rounded-full bg-input px-2 py-0.5"
                      >
                        <Text className="text-xs text-silver4">#{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
