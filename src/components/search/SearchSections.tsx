import Ionicons from '@react-native-vector-icons/ionicons';
import { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { IonIconType } from '../ui/IonIconTypes';
import { FlexLoading, ListEmptyBlock } from '../ui';
import { SearchResultRow } from './SearchResultRows';
import { CombinedSearchResult, SearchSectionsResponse, SearchSectionType } from './types';

export interface SearchSectionsProps {
  data?: SearchSectionsResponse;
  isLoading?: boolean;
  isError?: boolean;
  searchQuery: string;
}

type SectionSpec = {
  key: keyof SearchSectionsResponse;
  type: SearchSectionType;
  title: string;
  icon: IonIconType;
  /** Header badge colour, so the four sections stay distinguishable at a glance. */
  color: string;
};

// Order matches the design, top to bottom.
const SECTIONS: SectionSpec[] = [
  { key: 'creators', type: 'creator', title: 'Creators', icon: 'person', color: '#f43f5e' },
  { key: 'states', type: 'state', title: 'States', icon: 'location', color: '#3b82f6' },
  { key: 'hashtags', type: 'hashtag', title: 'Hashtags', icon: 'pricetag', color: '#22c55e' },
  { key: 'videos', type: 'video', title: 'Videos', icon: 'play', color: '#a855f7' },
];

const SectionCard = ({
  spec,
  hasMore,
  query,
  children,
}: {
  spec: SectionSpec;
  hasMore: boolean;
  query: string;
  children: ReactNode;
}) => {
  const navigation = useNavigation();
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-surface">
      <View className="flex-row items-center gap-3 px-4 pb-1 pt-4">
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: spec.color }}
        >
          <Ionicons name={spec.icon} size={16} color="#fff" />
        </View>
        <Text className="flex-1 text-lg font-bold text-primary">{spec.title}</Text>
        {hasMore && (
          <TouchableOpacity
            hitSlop={8}
            onPress={() =>
              navigation.navigate(Screens.SearchSection, {
                query,
                type: spec.type,
                title: spec.title,
              })
            }
          >
            <Text className="text-sm text-muted">View all</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

/**
 * The search results screen: creators, states, hashtags and videos as separate
 * cards rather than one merged list.
 *
 * A section with no matches is left out entirely instead of rendering an empty
 * card — four headers over three empty boxes reads as a broken screen rather
 * than a narrow result.
 *
 * "View all" appears only where the backend reported more behind it, so it is
 * never a link to the same rows already on screen.
 */
export const SearchSections = ({
  data,
  isLoading,
  isError,
  searchQuery,
}: SearchSectionsProps) => {
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

  const populated = data
    ? SECTIONS.filter((spec) => data[spec.key].items.length > 0)
    : [];

  if (populated.length === 0) {
    return (
      <ListEmptyBlock
        title="No Results"
        message={
          searchQuery ? `Nothing matching "${searchQuery}"` : 'Start typing to search'
        }
      />
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      contentContainerClassName="pb-8"
    >
      {populated.map((spec) => {
        const section = data![spec.key];
        return (
          <SectionCard
            key={spec.key}
            spec={spec}
            hasMore={section.hasMore}
            query={searchQuery}
          >
            {(section.items as CombinedSearchResult[]).map((item) => (
              <SearchResultRow key={`${item.type}:${item.id}`} item={item} />
            ))}
          </SectionCard>
        );
      })}
    </ScrollView>
  );
};
