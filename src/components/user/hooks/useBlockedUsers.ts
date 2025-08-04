import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserBase } from '../../../state/user/types';

const qqlQuery = `query(
  $orderBy: [BlockedUserOrderByInput!]
  $skip: Float
  $take: Float
  $where: BlockedUserWhereInput
) {
    blockedUsers(
        where: $where
        skip: $skip
        orderBy: $orderBy
        take: $take
    ) {
      id
      userToBlock {
        ...ShallowUser
      }
    }
}
fragment ShallowUser on User { id firstName lastName avatar nickname }
`;

type BlockedUser = {
  id: string;
  userToBlock: UserBase;
};

export const useBlockedUsers = (enabled: boolean) => {
  const queryKey = ['user', 'blockedUsers'];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const {
        data: { data },
      } = await api.post<{
        data: {
          blockedUsers: BlockedUser[];
        };
      }>('/graphql', {
        query: qqlQuery,
        variables: {
          take: 50,
        },
      });
      return data.blockedUsers.map((bu) => bu.userToBlock);
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    enabled,
  });
};
