import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { SearchTagRef } from '../types';

export type TagVideoSort = 'top' | 'recent';

type TagHeaderResponse = {
  tags: SearchTagRef[];
  total: number;
};

/**
 * The hashtag page's header: the resolved tags and how many videos they lead to.
 *
 * Split from the grid because the header is sort-independent — switching
 * between Top and Recent reorders the same videos, so re-fetching the count on
 * every tab press would show a spinner over a number that cannot change.
 *
 * The tags come back resolved rather than being taken from navigation, so a
 * shared link carrying only names can still render "#oregon + #fishing" with
 * proper casing.
 */
export const useTagVideosHeaderQuery = (tags: string[]) => {
  const key = tags.join(',');
  return useQuery({
    queryKey: ['tag_videos_header', key],
    enabled: tags.length > 0,
    queryFn: async () => {
      const { data } = await api.get<TagHeaderResponse>('/api/tags/videos', {
        // One row is enough: only the header fields are read here.
        params: { tags: key, take: 1 },
      });
      return { tags: data.tags, total: data.total };
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60,
  });
};
