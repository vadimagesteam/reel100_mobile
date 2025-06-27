import { api } from '../../../../lib/api.ts';
import { CommentType } from '../hooks/useCommentsInfiniteQuery.ts';

export type FetchCommentsParams = {
  videoId: string;
  replyTo?: string[];
  take: number;
  skip: number;
};

export const apiFetchComments = async ({ take, replyTo, videoId, skip }: FetchCommentsParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const replyToWhere = replyTo?.reduce(
    (acc, id, idx) => ({ ...acc, [`where[replyTo][in][${idx}]`]: id }),
    {} as Record<string, string>,
  ) ?? {
    'where[replyTo]': '',
  };

  const response = await api.get<CommentType[]>(`/api/videos/${videoId}/comments`, {
    params: {
      skip,
      take,
      // ...replyToWhere,
    },
  });
  return response.data;
};
