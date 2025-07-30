import { useEffect, useMemo, useState } from 'react';
import { UserType } from '../../../state/user/types';
import { getDisplayName } from '../../../state/user/utils';

// fixme: this must be re-worked using API
export const useUserSearchableFollowRelations = (
  user: UserType | undefined,
  type: 'followers' | 'following',
  initialSearchQuery?: string,
) => {
  const apiRelationType: 'follows' | 'whoms' = type === 'following' ? 'follows' : 'whoms';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? '');

  useEffect(() => {
    setSearchQuery(initialSearchQuery ?? '');
  }, [initialSearchQuery]);

  const data = useMemo(() => {
    if (!user) {
      return [];
    }
    const list = user[apiRelationType].map((v) => ('who' in v ? v.who : v.whom));
    const q = searchQuery.toLowerCase().trim();
    return q ? list?.filter((r) => getDisplayName(r).toLowerCase().includes(q)) : list;
  }, [user, apiRelationType, searchQuery]);

  return {
    data,
    searchQuery,
    setSearchQuery,
  };
};
