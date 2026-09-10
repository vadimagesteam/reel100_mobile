import { api } from '../../../lib/api';
import { RelationId } from '../../../state/user/types';

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
  duration: number;
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
  avatar: string | null;
  nickname: string | null;
  whoms: {
    id: RelationId;
    who: { id: RelationId };
  }[];
};

export type VideoProcessingStep =
  | 'UploadingToStorage'
  | 'ContentModeration'
  | 'Encoding240p'
  | 'Encoding360p'
  | 'Encoding480p'
  | 'Encoding720p'
  | 'Encoding1080p'
  | 'GeneratingHls'
  | 'Finalizing';

export type VideoState = {
  id: string;
  slug: string;
  label: string;
};

/** A hashtag on a video: `name` addresses the hashtag page, `label` prints. */
export type VideoTag = {
  id: string;
  name: string;
  label: string;
};

export type VideoPost = {
  id: string;
  label: string;
  slug: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  file: VideoFile | null;
  status: 'Finished' | 'InProcess' | 'Pending' | 'Deleted' | 'Banned';
  processingStep: VideoProcessingStep | null;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  description: string;
  user: VideoUser;
  states: VideoState[];
  /**
   * The hashtags the author attached. Optional because feeds that predate the
   * field — and cached pages written before this shipped — have none.
   */
  tags?: VideoTag[];
  top_100Position: number | null;
  top_100Date: string | null;
};

// quick types here, generate them or move somewhere else to be able to import them as generics
type StringFilter = Partial<{
  equals: string;
  contains: string;
  startsWith: string;
  endsWith: string;
  gt: string;
  gte: string;
  lte: string;
  lt: string;
  not: string[];
  notIn: string[];
}>;

type NumberFilter = Partial<{
  equals: number;
  gt: number;
  gte: number;
  lte: number;
  lt: number;
  not: number[];
  notIn: number[];
}>;

type RelationFilter<Keys extends object> = Partial<{
  every: { [K in keyof Keys]?: StringFilter };
  none: { [K in keyof Keys]?: StringFilter };
  some: { [K in keyof Keys]?: StringFilter };
}>;

type WhereUniqueInput = { id: string };

export type ApiVideosFetcherParams = {
  take: number;
  skip: number;
  where?: Partial<
    Record<keyof Omit<VideoPost, 'status'>, StringFilter | NumberFilter> & {
      // enums
      forMe?: boolean;
      user: WhereUniqueInput;
      status: VideoPost['status'];
      states: RelationFilter<{ id: string }>;
    }
  >;
  orderBy?: Array<Partial<Record<keyof VideoPost, 'Asc' | 'Desc'>>>;
  /**
   * Tag names for the hashtag page. Several tags intersect — videos carrying
   * all of them.
   *
   * These do not go through the GraphQL query below: VideoWhereInput has no
   * tags field, so a tag filter is not expressible there at all. When present,
   * the request is served by the tags endpoint instead. Routing it through this
   * same fetcher is what lets the hashtag page reuse the whole existing grid
   * and video-feed modal rather than fork a parallel set of them.
   */
  tags?: string[];
  /** Ordering of the hashtag grid; ignored unless `tags` is set. */
  tagSort?: 'top' | 'recent';
};

const qqlQuery = `query(
  $orderBy: [VideoOrderByInput!]
  $skip: Float
  $take: Float
  $where: VideoWhereInput
) {
    videos(
        where: $where
        skip: $skip
        orderBy: $orderBy
        take: $take
    ) {
        id
        label
        slug
        createdAt
        updatedAt
        file
        status
        processingStep
        likesCount
        commentsCount
        viewsCount
        description
        user {
          ...ShallowUser
          # We need this to understand if authenticated user is following the author
          whoms {
            id
            who {
                id
            }
          }
        }
        states { id slug label }
        tags { id name label }
        top_100Position
        top_100Date
    }
}
fragment ShallowUser on User { id firstName lastName avatar nickname }
`;

export const apiVideosFetcher = async ({
  take,
  skip,
  orderBy = [],
  where = {},
  tags,
  tagSort = 'top',
}: ApiVideosFetcherParams): Promise<VideoPost[]> => {
  if (tags && tags.length > 0) {
    const { data } = await api.get<{ videos: VideoPost[] }>('/api/tags/videos', {
      params: { tags: tags.join(','), sort: tagSort, skip, take },
    });
    return data.videos;
  }

  console.log('🔥 [apiVideosFetcher]', { where, skip, take, orderBy });

  const { data } = await api.post<{
    data: {
      videos: VideoPost[];
    };
  }>('/graphql', {
    query: qqlQuery,
    variables: {
      take,
      skip,
      orderBy,
      where,
    },
  });

  return data.data.videos;
};
