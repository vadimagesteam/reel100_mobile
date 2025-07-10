import { create } from 'zustand';
import { api } from '../../lib/api.ts';
import { getMimeType } from '../../utils';

export type VideoRecordStore = {
  previewUri: string | null;
  isPreviewReady: boolean;
  error: Error | null;
  uploading: boolean;

  actions: {
    clear: () => void;
    setPreviewUri: (uri: string) => void;
    setIsPreviewReady: (ready: boolean) => void;
    publish: (stateId: string) => Promise<boolean>;
  };
};

export const useVideoRecordStore = create<VideoRecordStore>((set, get) => ({
  previewUri: null,
  isPreviewReady: false,
  error: null,
  uploading: false,

  actions: {
    clear: () => {
      set({
        previewUri: null,
        isPreviewReady: false,
        error: null,
        uploading: false,
      });
    },
    setPreviewUri: (uri) => set({ previewUri: uri }),
    setIsPreviewReady: (ready) => set({ isPreviewReady: ready }),

    publish: async (stateId: string) => {
      const { previewUri } = get();

      if (!previewUri) {
        throw new Error('Nothing to publish');
      }

      const fileName = previewUri
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '');

      const metaDataPayload = {
        label: fileName,
        states: {
          connect: { id: stateId },
        },
      };

      try {
        set({ uploading: true, error: null });
        const response = await api.post('api/videos', metaDataPayload);

        console.log('VIDEO METADATA RESPONSE', response);

        if (response?.status === 201 && response.data?.id) {
          const videoId = response.data.id;

          const { type, name } = getMimeType(previewUri);
          const fileUri = previewUri.startsWith('file://') ? previewUri : `file://${previewUri}`;

          const formData = new FormData();
          formData.append('file', {
            uri: fileUri,
            type,
            name,
          } as any); // as any required by RN FormData type

          const fileUploadResponse = await api.put(`api/videos/${videoId}/file`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('VIDEO FILE UPLOAD RESPONSE', response);
          if (fileUploadResponse.status === 200) {
            set({ uploading: false });
            return true;
          }
        }
      } catch (error: any) {
        set({ error });
      }

      return false;
    },
  },
}));

export const useVideoRecordingPreview = () => {
  return {
    isPreviewReady: useVideoRecordStore((s) => s.isPreviewReady),
    previewUri: useVideoRecordStore((s) => s.previewUri),
    setPreviewUri: useVideoRecordStore((s) => s.actions.setPreviewUri),
    setIsPreviewReady: useVideoRecordStore((s) => s.actions.setIsPreviewReady),
  };
};
