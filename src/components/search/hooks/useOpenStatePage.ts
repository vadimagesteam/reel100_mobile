import { useCallback } from 'react';
import { useNavigation } from '../../../navigation';
import { Tabs } from '../../../navigation/screens';
import { StateItem, useStateSelector } from '../../../state/app/uiStore';

/**
 * Returns a handler that selects a state and takes the user to that state's
 * page (the Top 100 tab in TabMain), used from search results, recommendations,
 * and the Top 100 empty state.
 */
export const useOpenStatePage = () => {
  const navigation = useNavigation();
  const [, setSelectedState] = useStateSelector();

  return useCallback(
    (state: StateItem) => {
      setSelectedState(state);
      // @ts-expect-error nested tab navigation (see VideoPreview.tsx)
      navigation.navigate('Tabs', { screen: Tabs.TabMain });
    },
    [navigation, setSelectedState],
  );
};
