import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api.ts';
import { useUser } from '../../../state/user/authStore.ts';

type LikeResponse = {
  id: string;
};

export const useVideoLikeQuery = (
  type: 'video' | 'comment',
  id: string,
) => {
  const { id: userId } = useUser();
  return useQuery({
    queryKey: ['like', type, userId, id],
    queryFn: async () => {
      const { data } = await api.get<LikeResponse[]>(
        `/api/reactions?where[typeField]=Like&where[${type}][id]=${id}&where[user][id]=${userId}`
      );
      console.log('😝useLikeQuery',
      `/api/reactions?where[typeField]=Like&where[${type}][id]=${id}&where[user][id]=${userId}`,
        data,
        data.length ? { id: data[0].id } : { id: null }
      );

      return data.length ? { id: data[0].id } : { id: null };
    },
    enabled: !!userId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
