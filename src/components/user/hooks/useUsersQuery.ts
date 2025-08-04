import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserType } from '../../../state/user/types';

export type UserWhereInput = {
  any?: string;
  id?: {
    in?: string[];
    notIn?: string[];
  };
  nickname?: {
    contains?: string;
    startsWith?: string;
    mode?: 'Default' | 'Insensitive';
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
        id
        firstName
        lastName
        nickname
        avatar
        username 
        createdAt
        updatedAt
    }
}`;

export const useUsersQuery = (filter?: UserWhereInput) => {
  return useQuery({
    queryKey: filter ? ['users', 'filter', JSON.stringify(filter)] : ['users'],
    queryFn: async () => {
      const variables: Record<string, unknown> = {
        take: 50,
      };
      if (filter) {
        variables.where = filter;
      }
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
    staleTime: filter ? 0 : Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
