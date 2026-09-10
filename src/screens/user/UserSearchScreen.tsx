import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import {
  SearchRecommendations,
  SearchSections,
  useSearchSectionsQuery,
} from '../../components/search';
import { SearchInput } from '../../components/ui';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export const UserSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  const trimmed = searchText.trim();
  const hasSearch = trimmed.length > 0;
  const debouncedQuery = useDebouncedValue(trimmed, 300);

  const { data, isLoading, isError } = useSearchSectionsQuery(debouncedQuery, {
    enabled: hasSearch,
  });

  // While the debounce hasn't caught up to the current input, show loading so
  // the list doesn't briefly flash "no results" between keystrokes.
  const isSearching = isLoading || (hasSearch && debouncedQuery !== trimmed);

  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
      className="flex-1 bg-background px-4"
    >
      <View className="mb-2 flex-row items-center gap-x-3">
        <HeaderBackArrowButton />
        <SearchInput
          placeholder="Search creators, states and hashtags"
          autoCorrect={false}
          autoFocus
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {hasSearch ? (
          <SearchSections
            data={data}
            isLoading={isSearching}
            isError={isError}
            searchQuery={debouncedQuery}
          />
        ) : (
          <SearchRecommendations />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
