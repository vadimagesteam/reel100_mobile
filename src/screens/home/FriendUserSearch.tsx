import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { SearchInput } from '../../components/ui';
import { UserList } from '../../components/userList';
import { useShareablePeopleQuery } from '../../components/videoFeed/share/hooks/useShareablePeopleQuery';
import { useNavigation, useRoute } from '../../navigation';
import { UserBase } from '../../state/user/types';

export const FriendUserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { params } = useRoute<'FriendUserSearch'>();

  if (!params?.onSelected) {
    throw new Error('[FriendUserSearch] onSelected param is missing');
  }

  const { onSelected } = params;
  const handleSelected = useCallback(
    (user: UserBase) => {
      onSelected?.(user);
      navigation.goBack();
    },
    [navigation, onSelected],
  );

  const insets = useSafeAreaInsets();
  const { data, isLoading } = useShareablePeopleQuery(searchText);

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
        <UserList data={data} isLoading={isLoading} onPress={handleSelected} />
      </KeyboardAvoidingView>
    </View>
  );
};
