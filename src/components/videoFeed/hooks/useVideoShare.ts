import { useVideoFeed } from './useVideoFeed.ts';

export const useVideoShare = () => {
  const share = useVideoFeed((s) => s.share);
  const { shareVideo, closeShare } = useVideoFeed((s) => s.actions);

  return {
    opened: !!share,
    share,
    shareVideo,
    closeShare,
  };
};
