import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StateList } from '../../components/appHeader/stateSelector/StateList';
import { SearchInput } from '../../components/ui';
import { useNavigation, useRoute } from '../../navigation';
import { StateItem } from '../../state/app/uiStore';

export const SelectStateScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { params: { onSelected, placeholderValue } = {} } = useRoute<'SelectState'>();

  const handleSelected = useCallback(
    (value: StateItem) => {
      onSelected?.(value);
      navigation.goBack();
    },
    [navigation, onSelected],
  );

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background px-4">
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
