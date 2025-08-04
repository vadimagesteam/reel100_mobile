import { api } from '../../../lib/api';

type BlockedUser = { id: string };

export const blockingApi = {
  blockUser: async (userId: string, blockUserId: string) => {
    const { data } = await api.post<BlockedUser>('/api/blockedUsers', {
      user: { id: userId },
      userToBlock: { id: blockUserId },
    });
    return { id: data.id };
  },

  findUserBlock: async (userId: string) => {
    const { data } = await api.get<BlockedUser[]>(
      `/api/blockedUsers?where[userToBlock]][id][equals]=${userId}`,
    );
    return data.length ? { id: data[0].id } : null;
  },

  unblockUser: async (userId: string) => {
    const blocked = await blockingApi.findUserBlock(userId);
    if (!blocked) {
      console.warn('No blocked user found for unblocking.');
      return;
    }
    await api.delete(`/api/blockedUsers/${blocked.id}`);
  },
};
