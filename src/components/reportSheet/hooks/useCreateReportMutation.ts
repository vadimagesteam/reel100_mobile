import { useMutation } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';

export type ReportArgs = {
  description: string;
  reason: string;
  userId: string;
  videoId?: string;
};

export const useCreateReportMutation = () => {
  const me = useUser();
  return useMutation({
    mutationFn: async (args: ReportArgs) => {
      const payload = {
        description: args.description,
        reason: args.reason,
        owner: { id: me.id },
        wasReviewed: false,
        user: { id: args.userId },
        ...(args.videoId
          ? {
              video: { id: args.videoId },
            }
          : {}),
      };
      console.log('send payload:', payload);
      const { data } = await api.post('/api/reports', payload);
      console.log('report created:', data);
      return data;
    },
  });
};
