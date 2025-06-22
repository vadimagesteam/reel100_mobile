import { api } from '../../../lib/api.ts';
import { sleep } from '../../../utils/promise.ts';

export type ApiVideosFetcherParams = {
  take: number;
  skip: number;
};

export type VideoFileQuality = {
  fps: number;
  width: number;
  format: string;
  height: number;
  aspectRatio: string;
  qualityType: '240p' | '360p' | '480p' | '720p' | '1080p';
};

export type VideoVariation = {
  path: string;
  quality: VideoFileQuality;
  screenshots: string[];
};

export type VideoFile = {
  uuid: string;
  hlsUrl: string;
  encoding: string;
  filename: string;
  mimetype: string;
  storagePath: string;
  metadata: {
    size: number;
    directory: string;
  };
  variation: VideoVariation[];
};

export type VideoUser = {
  id: string;
  firstName: string;
  lastName: string;
};

export type VideoPost = {
  id: string;
  label: string;
  slug: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  file: VideoFile;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  user: VideoUser;
};

export const apiVideosFetcher = async ({
    take,
    skip,
}: ApiVideosFetcherParams) => {
  const orderBy = { likesCount: 'desc'  };
  console.log('🔥 [apiVideosFetcher]', { skip, take });
  const response = await api.get<VideoPost[]>('api/videos?where[status]=Finished', {
    params: {
      skip,
      take,
      ...Object.fromEntries(
        Object.entries(orderBy).map(([key, value]) => [`orderBy[${key}]`, value]),
      ),
    },
  });
  console.log('VIDEOS', response.data);

  return response.data;
};
