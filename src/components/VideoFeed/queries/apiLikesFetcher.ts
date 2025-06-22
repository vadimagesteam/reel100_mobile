import { api } from '../../../lib/api.ts';


type LikeResponse = {
  video: { id: string };
  user: { id: string };
}

export const apiLikesFetcher = async (userId: number, videoIds: number[]) => {
  const _fetchLike = async (videoId: number) =>  {
    const { data } = await api.get<LikeResponse>(`/api/reactions?where[typeField]=Like&where[video][id]=${videoId}&where[user][id]=${userId}`);
    console.log('---> loaded like info', {userId, videoId}, data);
    return data;
  };

  const likes = await Promise.allSettled(
    videoIds.map((videoId) => _fetchLike(videoId)),
  );

  return likes.reduce((acc, v) => {
    if (v.status === 'fulfilled') {
      acc[v.value.video.id] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);
};
