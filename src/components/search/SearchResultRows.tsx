import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { formatNumberShort, videoDisplayTitle } from '../../utils';
import { Avatar } from '../ui';
import { useOpenStatePage } from './hooks/useOpenStatePage';
import { StatPill } from './SearchStats';
import { StateAvatar } from './StateAvatar';
import {
  CombinedSearchResult,
  SearchStateResult,
  SearchTagResult,
  SearchUserResult,
  SearchVideoResult,
} from './types';

/**
 * The rows behind every search surface.
 *
 * They live apart from the sections that arrange them because "View all" shows
 * the same rows in a longer list — a full list that rendered differently from
 * the preview it was reached through would read as a different result set.
 */

const rowClassName = 'flex-row items-center gap-3 px-4 py-3';

const Chevron = () => (
  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
);

/** "42 uploads • 1.2K likes", the shared subtitle of creator and state rows. */
const CountsLine = ({ uploads, likes }: { uploads: number; likes: number }) => (
  <Text numberOfLines={1} className="mt-0.5 text-sm text-muted">
    {formatNumberShort(uploads)} uploads • {formatNumberShort(likes)} likes
  </Text>
);

export const CreatorRow = ({ item }: { item: SearchUserResult }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className={rowClassName}
      onPress={() => navigation.navigate(Screens.Profile, { userId: item.id })}
    >
      <Avatar uri={item.avatar} size={44} name={item.name} />
      <View className="flex-1">
        {/* `username` is the sign-up email — the app has no handle — so the
            row shows the display name the backend resolves instead. */}
        <Text numberOfLines={1} className="text-base font-semibold text-primary">
          {item.name}
        </Text>
        <CountsLine uploads={item.totalUploads} likes={item.totalLikes} />
      </View>
      <Chevron />
    </TouchableOpacity>
  );
};

export const StateRow = ({ item }: { item: SearchStateResult }) => {
  const openStatePage = useOpenStatePage();
  return (
    <TouchableOpacity
      className={rowClassName}
      onPress={() => openStatePage({ id: item.id, slug: item.slug, label: item.label })}
    >
      <StateAvatar slug={item.slug} size={44} />
      <View className="flex-1">
        <Text numberOfLines={1} className="text-base font-semibold text-primary">
          {item.label}
        </Text>
        <CountsLine uploads={item.totalUploads} likes={item.totalLikes} />
      </View>
      <Chevron />
    </TouchableOpacity>
  );
};

/**
 * Hashtag rows are tinted so a list of them reads as distinct entries rather
 * than a wall of identical text. The colour is picked from the tag's own name,
 * so a given hashtag looks the same everywhere it appears instead of shifting
 * with its position in the results.
 */
const TAG_COLORS = ['#4ade80', '#60a5fa', '#c084fc', '#fbbf24', '#f472b6', '#22d3ee'];

export const tagColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
};

/** "#oregon + #fishing" — one tag or an intersection, written the same way. */
export const formatTagTitle = (item: SearchTagResult): string =>
  item.tags.map((t) => `#${t.name}`).join(' + ');

export const HashtagRow = ({ item }: { item: SearchTagResult }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className={rowClassName}
      onPress={() =>
        navigation.navigate(Screens.TagFeed, {
          tags: item.tags.map((t) => t.name),
          title: formatTagTitle(item),
        })
      }
    >
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-base font-semibold"
          style={{ color: tagColor(item.name) }}
        >
          {formatTagTitle(item)}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-sm text-muted">
          {formatNumberShort(item.videosCount)} videos
        </Text>
      </View>
      <Chevron />
    </TouchableOpacity>
  );
};

export const VideoRow = ({ item }: { item: SearchVideoResult }) => {
  const navigation = useNavigation();
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
          <Text numberOfLines={1} className="text-base font-semibold text-primary">
            {videoDisplayTitle(item)}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text numberOfLines={1} className="text-sm text-muted">
              {item.user.name}
            </Text>
            <StatPill icon="heart-outline" value={item.likesCount} size={12} />
          </View>
          {item.tags.length > 0 && <VideoTagChips tags={item.tags} />}
        </View>
        <Chevron />
      </TouchableOpacity>
    </View>
  );
};

/**
 * A video's tags, tappable. They open the hashtag page rather than re-running
 * the search for that word, which is what they used to do — tapping #fishing
 * should show the fishing videos, not a text search that happens to include
 * them.
 */
const VideoTagChips = ({ tags }: { tags: string[] }) => {
  const navigation = useNavigation();
  return (
    <View className="mt-1 flex-row flex-wrap gap-1.5">
      {tags.slice(0, 4).map((tag) => (
        <TouchableOpacity
          key={tag}
          hitSlop={6}
          onPress={() =>
            navigation.navigate(Screens.TagFeed, { tags: [tag], title: `#${tag}` })
          }
          className="rounded-full bg-input px-2 py-0.5"
        >
          <Text className="text-xs text-silver4">#{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/** Renders whichever row a result calls for. */
export const SearchResultRow = ({ item }: { item: CombinedSearchResult }) => {
  switch (item.type) {
    case 'user':
      return <CreatorRow item={item} />;
    case 'state':
      return <StateRow item={item} />;
    case 'tag':
      return <HashtagRow item={item} />;
    case 'video':
      return <VideoRow item={item} />;
  }
};
