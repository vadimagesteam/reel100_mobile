import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '../../../lib/api';

type UseTrackVideoViewProps = {
  videoId: string;
  enable: boolean;
};

export const useTrackVideoView = ({ videoId, enable }: UseTrackVideoViewProps) => {
  const { mutate: trackVideoView } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      console.log('Track video view', id);
      const { data } = await api.patch(`/api/videos/${id}/track`, undefined);
      console.log('Track video view response', data);
      return data;
    },
    retry: 3,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null;
    if (enable) {
      console.log(`[Video][${videoId}] start tracking timer`);
      timer = setTimeout(() => {
        timer = null;
        trackVideoView({ id: videoId });
      }, 5_000);
    }
    return () => {
      if (timer) {
        console.log(`[Video][${videoId}] cancel tracking`, timer);
        clearTimeout(timer);
      }
    };
  }, [enable, videoId, trackVideoView]);
};
