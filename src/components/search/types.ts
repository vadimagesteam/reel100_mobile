// Response shapes for the backend search module (REST, under /api/search).
// Mirrors apps/api-server/src/search/dto in the backend repo.

export type RecommendedUser = {
  id: string;
  username: string;
  /** Display name (nickname, full name, or username). */
  name: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  avatar: string | null;
  /** Videos uploaded in the last 7 days. */
  posts: number;
  /** Likes received in the last 7 days. */
  likes: number;
  /** Ranking score: posts × (likes + 1) over the last 7 days. */
  score: number;
};

export type RecommendedState = {
  id: string;
  label: string;
  slug: string;
  posts: number;
  likes: number;
  score: number;
};

/** GET /api/search/recommendations */
export type SearchRecommendationsResponse = {
  users: RecommendedUser[];
  states: RecommendedState[];
};

export type SearchUserResult = {
  type: 'user';
  id: string;
  username: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  avatar: string | null;
  /** All-time upload count. */
  totalUploads: number;
  /** All-time likes received. */
  totalLikes: number;
};

export type SearchStateResult = {
  type: 'state';
  id: string;
  label: string;
  slug: string;
  uploadsToday: number;
  uploadsLast7Days: number;
  /** Lifetime uploads, shown on the search row. */
  totalUploads: number;
  /** Lifetime likes across the state's videos. */
  totalLikes: number;
};

export type SearchTagRef = {
  id: string;
  /** Normalized lookup key, and what the hashtag page is addressed by. */
  name: string;
  label: string;
};

/**
 * A hashtag row. Carries a list of tags rather than one, so a plain tag and a
 * combination (#oregon + #fishing) are the same shape: one row component, one
 * navigation target.
 */
export type SearchTagResult = {
  type: 'tag';
  id: string;
  name: string;
  /** Display text, e.g. "Fishing" or "Oregon + Fishing". */
  label: string;
  /** One entry is a plain tag; more than one is an intersection. */
  tags: SearchTagRef[];
  videosCount: number;
};

export type SearchVideoResult = {
  type: 'video';
  id: string;
  /** Video title. Older uploads carry the recording's file name — see
   * `videoDisplayTitle`, which is what should be rendered. */
  label: string;
  description: string | null;
  slug: string;
  likesCount: number;
  /** Poster frame for the results grid. Null while the upload is encoding. */
  thumbnail: string | null;
  /** User-authored tag labels, tappable to browse the tag. */
  tags: string[];
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type CombinedSearchResult =
  | SearchUserResult
  | SearchStateResult
  | SearchTagResult
  | SearchVideoResult;

/**
 * One section's rows.
 *
 * `hasMore` rather than a total: the design's section headers show no count,
 * only "View all", so all the app needs to know is whether that link belongs
 * there and when paging has run out.
 */
export type SearchSection<T> = {
  items: T[];
  hasMore: boolean;
};

/** GET /api/search/sections?q= — one preview per section. */
export type SearchSectionsResponse = {
  creators: SearchSection<SearchUserResult>;
  states: SearchSection<SearchStateResult>;
  hashtags: SearchSection<SearchTagResult>;
  videos: SearchSection<SearchVideoResult>;
};

/** The `type` query param of GET /api/search/section. */
export type SearchSectionType = 'creator' | 'state' | 'hashtag' | 'video';

/** GET /api/search/section?q=&type= — one page of a single section. */
export type SearchSectionPageResponse = SearchSection<CombinedSearchResult>;

/** GET /api/search/states?sort=most_active|alphabetical */
export type StateRankingItem = {
  id: string;
  label: string;
  slug: string;
  uploadsToday: number;
  uploadsLast7Days: number;
  totalUploads: number;
  totalLikes: number;
};

export type StateRankingSort = 'most_active' | 'alphabetical';
