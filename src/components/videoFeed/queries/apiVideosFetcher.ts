import { api } from '../../../lib/api.ts';
import { sleep } from '../../../utils/promise.ts';

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
  file: VideoFile | null;
  status: 'Finished' | 'InProcess' | 'Pending' | 'Deleted';
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  user: VideoUser;
};

export type ApiVideosFetcherParams = {
  take: number;
  skip: number;
  where?: Record<string, string | number>;
  orderBy?: Record<string, string>;
};

export const apiVideosFetcher = async ({
  take,
  skip,
  orderBy = {},
  where = {},
}: ApiVideosFetcherParams): Promise<VideoPost[]> => {
  console.log('🔥 [apiVideosFetcher]', { where, skip, take, orderBy });
  const response = await api.get<VideoPost[]>('api/videos', {
    params: {
      ...where,
      skip,
      take,
      ...Object.fromEntries(
        Object.entries(orderBy).map(([key, value]) => [`orderBy[${key}]`, value]),
      ),
    },
  });

  return response.data.map((v) => ({
    ...v,
    user: v.user ? v.user : { id: 'dummy_id', firstName: 'MISSING', lastName: 'USER' },
  }));
};
