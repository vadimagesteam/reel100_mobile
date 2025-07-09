import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../../components/appHeader';
import { SearchInput } from '../../../components/ui';
import { UserList } from '../../../components/userList';
import { useShareablePeopleQuery } from '../../../components/videoFeed/share/hooks/useShareablePeopleQuery';
import { UserType } from '../../../state/user/types';

export type FriendUserSearchRouteParams = {
  onSelected: (user: UserType) => void;
};

export const FriendUserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const {
    params: { onSelected },
  } = useRoute<
    RouteProp<{
      params: FriendUserSearchRouteParams;
    }>
  >();

  const handleSelected = useCallback<FriendUserSearchRouteParams['onSelected']>(
    (user) => {
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
      className="flex-1 bg-black4 px-4"
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
