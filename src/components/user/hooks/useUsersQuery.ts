import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserType } from '../../../state/user/types';

// todo: generate types...
export type UserWhereInput = {
  any?: string;
  id?: {
    in?: string[];
    notIn?: string[];
  };
  firstName?: {
    contains?: string;
    startsWith?: string;
  };
};

const qqlQuery = `query(
  $orderBy: [UserOrderByInput!]
  $skip: Float
  $take: Float
  $where: UserWhereInput
) {
    users(
        where: $where
        skip: $skip
        orderBy: $orderBy
        take: $take
    ) {
        id firstName lastName avatar username createdAt updatedAt
    }
}`;

export const useUsersQuery = (filter?: UserWhereInput) => {
  return useQuery({
    queryKey: filter ? ['users', filter] : ['users'],
    queryFn: async () => {
      const variables: Record<string, unknown> = {
        take: 20,
      };
      if (filter) {
        variables.where = filter;
      }
      console.log('Search users with filters', variables);
      const { data } = await api.post<{
        data: { users: UserType[] };
      }>('/graphql', {
        query: qqlQuery,
        variables,
      });
      if (data?.data?.users) {
        return data?.data?.users;
      }
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
