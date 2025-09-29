import { createStore } from 'zustand';
import { CommentType } from '../comments/hooks/useCommentsInfiniteQuery';

export type CacheKey = (string | number | object | undefined)[];

export type VideoFeedStore = {
  cacheKey: CacheKey | null;
  isPlayerFullScreen: boolean;
  isPaused: boolean;
  currentTime: number;

  commentsOpened: { videoId: string } | null;
  commentText: string;
  commentReply: CommentType | null;
  commentsExpanded: string[];

  share: { videoId: string } | null;
  report: { videoId: string; userId: string } | null;

  hearIconPos: { x: number; y: number };
  backPressHandler?: () => void;
  allowDelete: boolean;
  screenType: 'inner' | 'modal';
  showVideoDate: boolean;

  actions: {
    setBackPressHandler: (handler: () => void) => void;
    setCacheKey: (key: CacheKey) => void;
    setHeartIconPos: (coords: { x: number; y: number }) => void;
    updateTime: (time: number) => void;
    setIsPlayerFullScreen: (isFullScreen: boolean) => void;
    setIsPaused: (isPaused: boolean) => void;
    togglePause: () => void;

    openComments: (videoId: string) => void;
    closeComments: () => void;
    setCommentText: (text: string) => void;
    setCommentReply: (comment: CommentType) => void;
    resetCommentReply: () => void;
    expandCommentReplies: (commentId: string) => void;
    toggleCommentReplies: (commentId: string) => void;

    shareVideo: (videoId: string) => void;
    closeShare: () => void;

    reportVideo: (data: { videoId: string; userId: string }) => void;
    closeReport: () => void;
  };
};

export const createVideoFeedStore = (initialState: Partial<Omit<VideoFeedStore, 'actions'>> = {}) =>
  createStore<VideoFeedStore>((set, get) => ({
    // Important for tanstack-query
    cacheKey: null,
    backPressHandler: undefined,

    //#playerState
    isPlayerFullScreen: false,
    isPaused: false,
    currentTime: 0,

    //#comments
    commentsOpened: null,
    commentText: '',
    commentReply: null,
    commentsExpanded: [],

    //#share
    share: null,

    //#report
    report: null,

    //#overlay ui
    hearIconPos: { x: 0, y: 300 },
    allowDelete: false,
    screenType: 'inner',
    showVideoDate: false,

    ...initialState,

    actions: {
      setCacheKey: (cacheKey) => {
        const prevKey = get().cacheKey;
        if (prevKey) {
          console.warn('[VideoFeed] Cache key override! Be careful.', {
            prevKey,
            newNext: cacheKey,
          });
        }
        set({ cacheKey });
      },
      setBackPressHandler: (backPressHandler) => {
        set({ backPressHandler });
      },
      setHeartIconPos: (coords) => {
        // don't override once set
        if (!get().hearIconPos.x) {
        }
        set({ hearIconPos: coords });
      },
      updateTime: (time) => set({ currentTime: time }),
      setIsPlayerFullScreen: (isPlayerFullScreen: boolean) =>
        set({ isPlayerFullScreen: isPlayerFullScreen }),
      setIsPaused: (isPaused: boolean) => set({ isPaused }),
      togglePause: () => set((v) => ({ isPaused: !v.isPaused })),

      // comments
      setCommentText: (text: string) => set({ commentText: text }),
      openComments: (videoId: string) => set({ commentsOpened: { videoId } }),
      closeComments: () => set({ commentsOpened: null, commentReply: null, commentsExpanded: [] }),
      setCommentReply: (comment) => set({ commentReply: comment }),
      resetCommentReply: () => set({ commentReply: null }),
      toggleCommentReplies: (commentId: string) =>
        set((prev) => ({
          commentsExpanded: prev.commentsExpanded.includes(commentId)
            ? prev.commentsExpanded.filter((c) => c !== commentId)
            : [...prev.commentsExpanded, commentId],
        })),

      expandCommentReplies: (commentId: string) =>
        set((prev) => ({
          commentsExpanded: prev.commentsExpanded.includes(commentId)
            ? prev.commentsExpanded
            : [...prev.commentsExpanded, commentId],
        })),

      shareVideo: (videoId) => set({ share: { videoId } }),
      closeShare: () => set({ share: null }),
      reportVideo: (report) => set({ report }),
      closeReport: () => set({ report: null }),
    },
  }));
