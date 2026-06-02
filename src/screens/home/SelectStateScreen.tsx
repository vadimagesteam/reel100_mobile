import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { StateRankingList, useStateRankingQuery } from '../../components/search';
import { StateRankingItem, StateRankingSort } from '../../components/search/types';
import { SearchInput } from '../../components/ui';
import { useNavigation, useRoute } from '../../navigation';
import { StateItem } from '../../state/app/uiStore';
import { colors } from '../../theme';

const TABS: { key: StateRankingSort; label: string }[] = [
  { key: 'most_active', label: 'Most Active' },
  { key: 'alphabetical', label: 'A-Z' },
];

const byLabel = (a: StateRankingItem, b: StateRankingItem) =>
  a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });

const isInactive = (s: StateRankingItem) => s.uploadsToday === 0 && s.uploadsLast7Days === 0;

export const SelectStateScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState<StateRankingSort>('most_active');
  const [hideInactive, setHideInactive] = useState(false);
  const navigation = useNavigation();
  const { params: { onSelected } = {} } = useRoute<'SelectState'>();

  // One fetch (server-ordered by Most Active) powers both tabs; A-Z is derived.
  const { data, isLoading, isError } = useStateRankingQuery('most_active');

  const handleSelected = useCallback(
    (value: StateItem) => {
      onSelected?.(value);
      navigation.goBack();
    },
    [navigation, onSelected],
  );

  const states = useMemo(() => {
    let list = data ?? [];
    if (hideInactive) {
      list = list.filter((s) => !isInactive(s));
    }
    if (tab === 'alphabetical') {
      list = [...list].sort(byLabel);
    }
    const q = searchText.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) => s.label.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, tab, hideInactive, searchText]);

  const hiddenCount = useMemo(
    () => (data ?? []).filter(isInactive).length,
    [data],
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background px-4">
      <View className="mb-3 mt-1 flex-row items-center gap-x-3">
        <HeaderBackArrowButton />
        <Text className="text-xl font-bold text-primary">Choose Your State</Text>
      </View>

      <SearchInput
        placeholder="Search for a state"
        icon="location"
        autoCorrect={false}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View className="mt-3 flex-row rounded-xl bg-surface p-1">
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <TouchableOpacity
              key={key}
              className={clsx(
                'flex-1 items-center rounded-lg py-2',
                active && 'bg-zinc-700',
              )}
              onPress={() => setTab(key)}
            >
              <Text
                className={clsx(
                  'text-sm font-semibold',
                  active ? 'text-primary' : 'text-muted',
                )}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-xs text-muted">7d means uploads in the last 7 days</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1"
          hitSlop={8}
          onPress={() => setHideInactive((v) => !v)}
        >
          <Ionicons
            name={hideInactive ? 'eye-off' : 'eye-outline'}
            size={14}
            color={colors.muted}
          />
          <Text className="text-xs text-muted">
            {hideInactive ? 'Show all' : `Hide ${hiddenCount}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-1 flex-1">
        <StateRankingList
          data={states}
          isLoading={isLoading}
          isError={isError}
          searchQuery={searchText}
          onPress={(state) =>
            handleSelected({ id: state.id, slug: state.slug, label: state.label })
          }
        />
      </View>
    </SafeAreaView>
  );
};
