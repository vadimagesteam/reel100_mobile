import { useState } from 'react';
import { View } from 'react-native';
import { UserBase } from '../../state/user/types';
import { SearchInput } from '../ui';
import { UserList, UserListProps } from './UserList';

export interface SearchableUserListProps<T extends UserBase> extends UserListProps<T> {
  autoFocus?: boolean;
  initialSearchText?: string;
  onSearch?: (query: string) => void;
}

export const SearchableUserList = <T extends UserBase>({
  onSearch,
  autoFocus,
  initialSearchText,
  ...userListProps
}: SearchableUserListProps<T>) => {
  const [searchText, searchSearchText] = useState(initialSearchText ?? '');

  const handleSearch = (query: string) => {
    searchSearchText(query);
    onSearch?.(query);
  };

  return (
    <View className="mt-2 flex-1 flex-col gap-2 px-2">
      <SearchInput
        autoCorrect={false}
        wrapperClassName="grow-0"
        autoFocus={autoFocus}
        value={searchText}
        onChangeText={handleSearch}
      />
      <UserList {...userListProps} />
    </View>
  );
};
