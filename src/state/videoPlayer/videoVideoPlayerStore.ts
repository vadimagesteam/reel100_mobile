import { create } from 'zustand';
import { CommentType } from '../../components/VideoFeed/Comments/queries/useCommentsInfiniteQuery.ts';

type PlayerStore = {
  isPlayerFullScreen: boolean;
  isPaused: boolean;
  currentTime: number;

  commentsOpened: { videoId: string; userId: string } | null;
  commentText: string;
  commentReply: CommentType | null;
  commentsExpanded: string[];

  hearIconPos: { x: number; y: number };

  actions: {
    setHearIconPos: (coords: { x: number; y: number }) => void;
    updateTime: (time: number) => void;
    setIsPlayerFullScreen: (isFullScreen: boolean) => void;
    setIsPaused: (isPaused: boolean) => void;
    togglePause: () => void;

    openComments: (videoId: string, userId: string) => void;
    closeComments: () => void;
    setCommentText: (text: string) => void;
    setCommentReply: (comment: CommentType) => void;
    resetCommentReply: () => void;
    expandCommentReplies: (commentId: string) => void;
    toggleCommentReplies: (commentId: string) => void;
  };
};

export const useVideoPlayerStore = create<PlayerStore>((set, get) => ({
  //#playerState
  isPlayerFullScreen: false,
  isPaused: false,
  currentTime: 0,

  //#comments
  commentsOpened: null,
  commentText: '',
  commentReply: null,
  commentsExpanded: [],

  //#overlay ui
  hearIconPos: { x: 0, y: 300 },

  actions: {
    setHearIconPos: (coords) => {
      // don't override once set
      if (!get().hearIconPos.x) {
        set({ hearIconPos: coords });
      }
    },
    updateTime: (time) => set({ currentTime: time }),
    setIsPlayerFullScreen: (isPlayerFullScreen: boolean) =>
      set({ isPlayerFullScreen: isPlayerFullScreen }),
    setIsPaused: (isPaused: boolean) => set({ isPaused }),
    togglePause: () => set((v) => ({ isPaused: !v.isPaused })),

    // comments
    setCommentText: (text: string) => set({ commentText: text }),
    openComments: (videoId: string, userId: string) => set({ commentsOpened: { videoId, userId } }),
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
  },
}));

export const useVideoActions = () => useVideoPlayerStore((store) => store.actions);
