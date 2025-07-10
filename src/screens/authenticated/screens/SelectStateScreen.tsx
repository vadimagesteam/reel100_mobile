import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../../components/appHeader';
import { StateList } from '../../../components/appHeader/stateSelector/StateList';
import { SearchInput } from '../../../components/ui';
import { StateItem } from '../../../state/app/uiStore';

export type SelectStateRouteParams = {
  placeholderValue?: string;
  onSelected: (state: StateItem) => void;
};

export const SelectStateScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { params: { onSelected, placeholderValue } = {} } = useRoute<
    RouteProp<{
      params: SelectStateRouteParams;
    }>
  >();

  const handleSelected = useCallback<SelectStateRouteParams['onSelected']>(
    (value) => {
      onSelected?.(value);
      navigation.goBack();
    },
    [navigation, onSelected],
  );

  return (
    <SafeAreaView edges={['bottom']} className="bg-background flex-1 px-4">
      <View className="my-2">
        <SearchInput
          placeholder={placeholderValue}
          icon="location"
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
        <StateList searchQuery={searchText} onPress={handleSelected} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
