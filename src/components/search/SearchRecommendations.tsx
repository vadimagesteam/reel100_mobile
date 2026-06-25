import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { Avatar, ListEmptyBlock } from '../ui';
import { IonIconType } from '../ui/IonIconTypes';
import { useOpenStatePage } from './hooks/useOpenStatePage';
import { useSearchRecommendationsQuery } from './hooks/useSearchRecommendationsQuery';
import { StateAvatar } from './StateAvatar';
import { StatPill } from './SearchStats';
import { RecommendedUser } from './types';

/**
 * The handle shown for a recommended creator. `username` stores the user's
 * email, so never render it raw (it would show "@name@gmail.com"). Prefer an
 * explicit nickname; otherwise fall back to the email's local part.
 */
const creatorHandle = (user: RecommendedUser): string =>
  user.nickname?.trim() || user.username.split('@')[0];

const StatLine = ({ posts, likes }: { posts: number; likes: number }) => (
  <View className="mt-0.5 flex-row items-center gap-3">
    <StatPill icon="cloud-upload-outline" value={posts} label="uploads" />
    <StatPill icon="heart-outline" value={likes} label="likes" />
  </View>
);

const Row = ({
  avatar,
  title,
  posts,
  likes,
  isFirst,
  onPress,
}: {
  avatar: ReactNode;
  title: string;
  posts: number;
  likes: number;
  isFirst: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={clsx(
      'flex-row items-center gap-3 px-3 py-2.5',
      !isFirst && 'border-t-[0.5px] border-t-zinc-800',
    )}
  >
    {avatar}
    <View className="flex-1">
      <Text numberOfLines={1} className="text-base font-semibold text-primary">
        {title}
      </Text>
      <StatLine posts={posts} likes={likes} />
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
  </TouchableOpacity>
);

const Card = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IonIconType;
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <View className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
    <View className="flex-row items-center gap-3 px-3 pb-1 pt-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View>
        <Text className="text-base font-bold text-primary">{title}</Text>
        <Text className="text-xs text-muted">{subtitle}</Text>
      </View>
    </View>
    <View className="pb-1">{children}</View>
  </View>
);

/**
 * "Most Active Creators" + "Most Active States" cards, shown when the search bar
 * is focused without a typed query and as the 4U feed empty state. Data comes
 * from the /api/search/recommendations endpoint, recomputed event-driven (a few
 * seconds after any upload/like).
 */
export const SearchRecommendations = () => {
  const navigation = useNavigation();
  const openStatePage = useOpenStatePage();
  const { data, isLoading, isError } = useSearchRecommendationsQuery({ enabled: true });

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!data && isError) {
    return (
      <ListEmptyBlock
        title="Couldn’t load recommendations"
        message="Check your connection and try again."
      />
    );
  }

  const users = data?.users ?? [];
  const states = data?.states ?? [];

  if (users.length === 0 && states.length === 0) {
    return (
      <ListEmptyBlock
        title="Nothing trending yet"
        message="Check back soon for active creators and states to follow."
      />
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
    >
      <View className="pb-8 pt-1">
        {users.length > 0 && (
          <Card icon="trending-up" title="Most Active Creators" subtitle="Last 7 days">
            {users.map((user, index) => (
              <Row
                key={user.id}
                isFirst={index === 0}
                avatar={<Avatar uri={user.avatar} size={40} name={user.name} />}
                title={`@${creatorHandle(user)}`}
                posts={user.posts}
                likes={user.likes}
                onPress={() => navigation.navigate(Screens.Profile, { userId: user.id })}
              />
            ))}
          </Card>
        )}

        {states.length > 0 && (
          <Card icon="location-outline" title="Most Active States" subtitle="Last 7 days">
            {states.map((state, index) => (
              <Row
                key={state.id}
                isFirst={index === 0}
                avatar={<StateAvatar slug={state.slug} size={40} />}
                title={state.label}
                posts={state.posts}
                likes={state.likes}
                onPress={() =>
                  openStatePage({ id: state.id, slug: state.slug, label: state.label })
                }
              />
            ))}
          </Card>
        )}

        <View className="mt-1 flex-row items-center justify-center gap-1.5">
          <Ionicons name="information-circle-outline" size={13} color={colors.muted} />
          <Text className="text-center text-xs text-muted">
            Based on recent activity. No recommendation algorithm.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
