import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { SearchInput } from '../../components/ui';
import { useUsersQuery } from '../../components/user/hooks';
import { UserList } from '../../components/userList';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';

export const UserSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const { data, isLoading } = useUsersQuery(
    searchText ? { firstName: { startsWith: searchText } } : undefined,
  );

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
          placeholder="Global user search"
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
        <UserList
          data={data}
          isLoading={isLoading}
          onPress={(user) => {
            navigation.navigate(Screens.Profile, { user });
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};
