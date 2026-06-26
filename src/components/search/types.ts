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
};

/** GET /api/search?q= — combined, alphabetically-sorted users + states. */
export type CombinedSearchResult = SearchUserResult | SearchStateResult;

/** GET /api/search/states?sort=most_active|alphabetical */
export type StateRankingItem = {
  id: string;
  label: string;
  slug: string;
  uploadsToday: number;
  uploadsLast7Days: number;
};

export type StateRankingSort = 'most_active' | 'alphabetical';
