import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackArrowButton } from '../../components/appHeader';
import { SearchInput } from '../../components/ui';
import { useUserQuery } from '../../components/user/hooks';
import { useUserSearchableFollowRelations } from '../../components/user/userFollowRelations/useUserSearchableFollowRelations';
import { UserList } from '../../components/userList';
import { useNavigation, useRoute } from '../../navigation';
import { useUser } from '../../state/user/authStore';
import { UserBase } from '../../state/user/types';

export const UserFollowingSearchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<'UserFollowingSearch'>();

  if (!params?.onSelected) {
    throw new Error('[UserFollowingSearchScreen] onSelected param is missing');
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
  const me = useUser();
  const { data: user, isLoading } = useUserQuery(me.id);
  const { data, searchQuery, setSearchQuery } = useUserSearchableFollowRelations(user, 'following');

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
          value={searchQuery}
          onChangeText={setSearchQuery}
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
